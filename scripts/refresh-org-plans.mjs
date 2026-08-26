/**
 * Refresh `src/data/org-plans.json` from the live API.
 *
 * Sibling of `refresh-engines.mjs`, and the same trade for the same reason: the build
 * reads a COMMITTED snapshot rather than fetching, because `api.voxtranslate.app` sits
 * behind the Cloudflare WAF + Bot Fight Mode (runbook 111) and a GitHub Actions runner
 * is exactly the datacenter traffic that is meant to block. Freshness is a deliberate
 * act, not a build-time dependency on the production perimeter.
 *
 *   node scripts/refresh-org-plans.mjs
 *
 * WHY THIS EXISTS
 * ---------------
 * The Business and Enterprise prices were typed into all five `src/i18n/*.json` files.
 * Five hand-maintained copies of a number whose truth lives in Stripe, with nothing
 * comparing them — so when the copy was changed from EUR to USD ahead of the Stripe
 * prices themselves, the site advertised $49/$199 against Price objects denominated in
 * EUR (~$53/$215) and stayed that way for two months. Nothing was broken; nothing was
 * checking.
 *
 * The amount and the currency now come from `GET /api/business/plans`, which reads them
 * off the Stripe Price. The i18n files keep what they should have kept all along: plan
 * names, feature bullets, and the words around the number.
 *
 * Exits non-zero if the catalogue changed, so a cron can use it as a drift alarm.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const API = process.env.PUBLIC_API_BASE || 'https://api.voxtranslate.app';
const OUT = new URL('../src/data/org-plans.json', import.meta.url);

/** Display order: cheaper plan first, monthly before annual. */
const ORDER = ['business:month', 'business:year', 'enterprise:month', 'enterprise:year'];
const rank = (p) => {
  const i = ORDER.indexOf(`${p.plan}:${p.interval}`);
  return i === -1 ? ORDER.length : i;
};

const res = await fetch(`${API}/api/business/plans`, { signal: AbortSignal.timeout(20_000) });
if (!res.ok) {
  console.error(`refresh-org-plans: ${API}/api/business/plans returned HTTP ${res.status}`);
  if (res.status === 403) {
    console.error(
      '403 usually means the WAF blocked this client — run from a browser-like network.',
    );
  }
  if (res.status === 503) {
    console.error('503 means org billing is not configured on the server, or no price resolved.');
  }
  process.exit(2);
}

const body = await res.json();
const plans = (body.plans ?? [])
  .filter((p) => typeof p.unit_amount === 'number' && typeof p.currency === 'string')
  .sort((a, b) => rank(a) - rank(b));

if (plans.length === 0) {
  console.error('refresh-org-plans: the API returned no priced plans — refusing to write.');
  process.exit(2);
}

// A partial catalogue is a real signal, not something to paper over: if one Price is
// unreachable the pricing page would silently lose a plan. Say so, loudly, and still
// write — a stale-but-complete file is worse than a fresh one you were warned about.
if (plans.length !== ORDER.length) {
  console.warn(
    `refresh-org-plans: WARNING — expected ${ORDER.length} plans, got ${plans.length}. ` +
      `Missing: ${ORDER.filter((k) => !plans.some((p) => `${p.plan}:${p.interval}` === k)).join(', ')}`,
  );
}

// Mixed currencies across the four would break every "or X/yr" line on the site, which
// pairs a monthly and an annual figure in one sentence.
const currencies = [...new Set(plans.map((p) => p.currency))];
if (currencies.length > 1) {
  console.error(
    `refresh-org-plans: plans span multiple currencies (${currencies.join(', ')}) — refusing to write.`,
  );
  process.exit(2);
}

const before = existsSync(OUT) ? readFileSync(OUT, 'utf8') : '';
const next = {
  fetchedAt: new Date().toISOString().slice(0, 10),
  source: `${API}/api/business/plans`,
  plans,
};
const after = `${JSON.stringify(next, null, 2)}\n`;

const strip = (s) => s.replace(/"fetchedAt": "[^"]*",\n/, '');
if (strip(before) === strip(after)) {
  console.log('refresh-org-plans: catalogue unchanged.');
  process.exit(0);
}

writeFileSync(OUT, after, 'utf8');
console.log('refresh-org-plans: catalogue CHANGED — review the diff and commit.');
for (const p of plans) {
  const amount = (p.unit_amount / 100).toFixed(2);
  console.log(`  ${p.plan.padEnd(11)} ${p.interval.padEnd(6)} ${p.currency.toUpperCase()} ${amount}`);
}
process.exit(1);
