// Publishes the bundled seed posts into the PocketBase `posts` collection.
//
// WHY THIS EXISTS: in production the website reads posts ONLY from PocketBase —
// `getPosts()` (src/lib/pocketbase.ts) falls back to the bundled data in
// src/data/*.json exclusively when POCKETBASE_URL is unset or unreachable. So a post
// added to the bundled data appears in a local build and in nothing else. This script
// pushes that same data into the CMS, which is what production actually serves.
//
// Safe by default: a slug that already exists in the CMS is SKIPPED, so edits made in
// the PocketBase admin UI are never clobbered by the repo copy. Pass --update-existing
// to overwrite them deliberately. Nothing is ever duplicated.
//
// Usage (credentials never live in the repo):
//   POCKETBASE_URL=https://cms.example \
//   POCKETBASE_ADMIN_EMAIL=… POCKETBASE_ADMIN_PASSWORD=… \
//   node scripts/seed-pocketbase-posts.mjs [--dry-run] [--only=slug,slug] [--update-existing]
//
// Covers: the bundled posts reference /blog/<slug>.svg, served as a static asset by the
// site itself. PocketBase's `cover` is a file field, so this script does NOT upload
// covers — a record without one falls back to the local path (`raw.cover`) through
// `resolve()`. Upload covers in the PocketBase admin UI if you want CMS-hosted images.

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));
const DATA = join(HERE, '..', 'src', 'data');

const url = (process.env.POCKETBASE_URL || '').replace(/\/$/, '');
const email = process.env.POCKETBASE_ADMIN_EMAIL;
const password = process.env.POCKETBASE_ADMIN_PASSWORD;
const dryRun = process.argv.includes('--dry-run');
const updateExisting = process.argv.includes('--update-existing');
const onlyArg = process.argv.find((a) => a.startsWith('--only='));
const only = onlyArg ? new Set(onlyArg.slice('--only='.length).split(',')) : null;

if (!url) throw new Error('POCKETBASE_URL is required');
if (!dryRun && (!email || !password)) {
  throw new Error(
    'POCKETBASE_ADMIN_EMAIL and POCKETBASE_ADMIN_PASSWORD are required (or pass --dry-run)',
  );
}

const json = (f) => JSON.parse(readFileSync(join(DATA, f), 'utf8'));
const posts = json('new-posts.json');
const translations = json('post-translations.json');

/** The record shape `getPosts()` reads back (see src/lib/pocketbase.ts). */
function toRecord(p) {
  return {
    title: p.title,
    slug: p.slug,
    excerpt: p.excerpt,
    content: p.content,
    author: p.author,
    // PocketBase wants "YYYY-MM-DD HH:mm:ss.sssZ"; an ISO string is accepted too.
    published_at: p.published_at,
    lang: p.lang ?? 'en',
    tags: p.tags ?? [],
    published: true,
    // Per-locale overrides for title/excerpt/content, keyed by locale.
    i18n: translations[p.slug] ?? null,
  };
}

async function api(path, init = {}, token) {
  const res = await fetch(`${url}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: token } : {}),
      ...(init.headers ?? {}),
    },
  });
  if (!res.ok) {
    throw new Error(`${init.method ?? 'GET'} ${path} → ${res.status} ${await res.text()}`);
  }
  return res.status === 204 ? null : res.json();
}

async function authenticate() {
  // PocketBase renamed the admin auth route in 0.23 (_superusers); try the new one first.
  for (const path of [
    '/api/collections/_superusers/auth-with-password',
    '/api/admins/auth-with-password',
  ]) {
    try {
      const out = await api(path, {
        method: 'POST',
        body: JSON.stringify({ identity: email, password }),
      });
      return out.token;
    } catch (err) {
      if (!String(err).includes('→ 404')) throw err;
    }
  }
  throw new Error('could not authenticate: neither _superusers nor admins auth route exists');
}

const selected = posts.filter((p) => !only || only.has(p.slug));
if (!selected.length) throw new Error('no posts selected');

// The `posts` collection's own constraints (pb_migrations/1747000000_create_posts.js).
// Checked here because PocketBase answers an over-long excerpt with a bare
// "Something went wrong while processing your request." and an EMPTY data object —
// no field, no length, nothing to go on. Fail locally with the actual reason instead.
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const problems = [];
for (const p of selected) {
  if (p.excerpt.length > 200) {
    problems.push(`${p.slug}: excerpt is ${p.excerpt.length} chars, the field allows 200`);
  }
  if (!SLUG_PATTERN.test(p.slug)) {
    problems.push(`${p.slug}: slug must match ${SLUG_PATTERN} (lowercase, digits, hyphens)`);
  }
  if (!['en', 'it', 'es', 'de', 'fr'].includes(p.lang ?? 'en')) {
    problems.push(`${p.slug}: lang "${p.lang}" is not one of en/it/es/de/fr`);
  }
  for (const field of ['title', 'excerpt', 'content', 'author', 'published_at']) {
    if (!p[field]) problems.push(`${p.slug}: ${field} is required and empty`);
  }
}
if (problems.length) {
  console.error(
    `\nThe bundled data violates the collection's constraints:\n  ${problems.join('\n  ')}\n`,
  );
  process.exit(1);
}

if (dryRun) {
  for (const p of selected) {
    const rec = toRecord(p);
    const langs = rec.i18n ? Object.keys(rec.i18n).join('/') : 'none';
    console.log(`would upsert ${p.slug} — ${rec.content.length} chars, translations: ${langs}`);
  }
  console.log(`\ndry run: ${selected.length} posts, nothing written to ${url}`);
  process.exit(0);
}

const token = await authenticate();
let created = 0;
let updated = 0;
let skipped = 0;
const failed = [];
for (const p of selected) {
  const record = toRecord(p);
  const found = await api(
    `/api/collections/posts/records?perPage=1&filter=${encodeURIComponent(`slug="${p.slug}"`)}`,
    {},
    token,
  );
  const existing = found.items?.[0];
  if (existing && !updateExisting) {
    skipped++;
    // A record can exist and still be invisible: the collection's listRule is
    // `published = true`, so an unpublished draft blocks creation here while never
    // appearing on the site — the confusing state where the CMS "has" the post and
    // readers cannot see it. Say so rather than reporting a bare skip.
    const draft =
      existing.published === false ? ' — DRAFT, not published, so the site does NOT show it' : '';
    console.log(
      `skipped ${p.slug} (already in the CMS${draft}${draft ? '' : ' — pass --update-existing to overwrite'})`,
    );
  } else if (existing) {
    await api(
      `/api/collections/posts/records/${existing.id}`,
      {
        method: 'PATCH',
        body: JSON.stringify(record),
      },
      token,
    );
    updated++;
    console.log(`updated ${p.slug}`);
  } else {
    try {
      await api(
        '/api/collections/posts/records',
        { method: 'POST', body: JSON.stringify(record) },
        token,
      );
      created++;
      console.log(`created ${p.slug}`);
    } catch (err) {
      // The record may well have been written anyway. pb_hooks/deploy.pb.js runs
      // onRecordAfterCreateRequest and POSTs to DEPLOY_HOOK_URL to rebuild the site; when
      // that call fails — a build is already queued, so the hook rate-limits — the hook
      // throws and PocketBase 0.22 reports it as a bare 400 with an empty data object,
      // AFTER the row is committed. Verify before believing the error.
      const check = await api(
        `/api/collections/posts/records?perPage=1&filter=${encodeURIComponent(`slug="${p.slug}"`)}`,
        {},
        token,
      ).catch(() => null);
      if (check?.items?.length) {
        created++;
        console.log(
          `created ${p.slug} — the API returned an error after the write (an after-create` +
            ' hook failed, most likely the deploy hook); the record is there',
        );
      } else {
        failed.push(`${p.slug}: ${err.message}`);
        console.error(`FAILED ${p.slug}`);
      }
    }
  }
}
console.log(`\n${created} created, ${updated} updated, ${skipped} skipped on ${url}`);
if (failed.length) {
  console.error(`\n${failed.length} genuinely failed:`);
  for (const f of failed) console.error(`  ${f}`);
  process.exitCode = 1;
}
console.log('Rebuild the site (Cloudflare Pages) so the new records are prerendered.');
