/**
 * Refresh `src/data/engines.json` from the live API.
 *
 * The marketing build reads a COMMITTED catalogue rather than fetching at build time.
 * The first version of this fetched `GET /api/engines` during the build; it worked
 * locally and returned **403 in CI**, because `api.voxtranslate.app` sits behind the
 * Cloudflare WAF + Bot Fight Mode (runbook 111) and a GitHub Actions runner is exactly
 * the datacenter traffic that is meant to block. Every production page then rendered
 * the "prices are indicative" fallback banner.
 *
 * Weakening the WAF so a static site can build was the wrong trade. A marketing build
 * that cannot succeed without the production API is a liability in its own right — a
 * WAF incident would take website deploys with it — and deterministic builds are worth
 * more here than automatic freshness.
 *
 * So freshness is now a deliberate act: run this from a machine that can reach the API
 * (a dev laptop, or a scheduled job inside the perimeter), review the diff, commit.
 *
 *   node scripts/refresh-engines.mjs
 *
 * Exits non-zero if the catalogue changed, so CI or a cron can use it as a drift alarm
 * without granting anything write access.
 */
import { readFileSync, writeFileSync } from 'node:fs';

const API = process.env.PUBLIC_API_BASE || 'https://api.voxtranslate.app';
const OUT = new URL('../src/data/engines.json', import.meta.url);
const TIER_ORDER = { standard: 0, enhanced: 1, premium: 2 };

const res = await fetch(`${API}/api/engines`, { signal: AbortSignal.timeout(20_000) });
if (!res.ok) {
  console.error(`refresh-engines: ${API}/api/engines returned HTTP ${res.status}`);
  if (res.status === 403) {
    console.error(
      '403 usually means the WAF blocked this client — run from a browser-like network.',
    );
  }
  process.exit(2);
}

const body = await res.json();
const engines = (body.engines ?? [])
  .filter((e) => e.tier in TIER_ORDER)
  .sort((a, b) => TIER_ORDER[a.tier] - TIER_ORDER[b.tier]);

if (engines.length === 0) {
  console.error('refresh-engines: the API returned no recognised tiers — refusing to write.');
  process.exit(2);
}

const before = readFileSync(OUT, 'utf8');
const next = {
  fetchedAt: new Date().toISOString().slice(0, 10),
  source: `${API}/api/engines`,
  engines,
};
const after = `${JSON.stringify(next, null, 2)}\n`;

// Compare everything except the date stamp, so a same-day no-op run is not a "change".
const strip = (s) => s.replace(/"fetchedAt": "[^"]*",\n/, '');
if (strip(before) === strip(after)) {
  console.log('refresh-engines: catalogue unchanged.');
  process.exit(0);
}

writeFileSync(OUT, after, 'utf8');
console.log('refresh-engines: catalogue CHANGED — review the diff and commit.');
for (const e of engines) {
  console.log(
    `  ${e.display_name.padEnd(9)} $${e.rate_per_minute}/min  ${e.output_languages.length} languages`,
  );
}
process.exit(1);
