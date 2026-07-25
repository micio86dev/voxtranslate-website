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
    console.log(`skipped ${p.slug} (already in the CMS — pass --update-existing to overwrite)`);
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
    await api(
      '/api/collections/posts/records',
      {
        method: 'POST',
        body: JSON.stringify(record),
      },
      token,
    );
    created++;
    console.log(`created ${p.slug}`);
  }
}
console.log(`\n${created} created, ${updated} updated, ${skipped} skipped on ${url}`);
console.log('Rebuild the site (Cloudflare Pages) so the new records are prerendered.');
