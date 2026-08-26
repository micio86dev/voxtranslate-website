/**
 * Cross-cutting site constants (non-translatable).
 *
 * Every origin is build-time overridable and defaults to production. The apex
 * migration (runbook 121) had to touch the same hostname in a dozen files across
 * three repos, which is the argument for reading them from one place per repo and
 * from the environment where a deploy might differ.
 *
 * Defaults are PRODUCTION, never localhost: this site builds statically on the
 * host, and a missing variable must degrade to the right public URL rather than
 * silently baking a dead one into the shipped HTML.
 */

/** Strip any trailing slash so callers can always append `/path` safely. */
const origin = (value: string | undefined, fallback: string): string =>
  (value || fallback).trim().replace(/\/$/, '');

/** The live VoxTranslate app (where "Try free" / "Open app" point). `PUBLIC_APP_URL`. */
export const APP_URL = origin(import.meta.env.PUBLIC_APP_URL, 'https://app.voxtranslate.app');

/** The Business dashboard app (where the "Business" page CTAs point). `PUBLIC_DASHBOARD_URL`. */
export const DASHBOARD_URL = origin(
  import.meta.env.PUBLIC_DASHBOARD_URL,
  'https://dashboard.voxtranslate.app',
);

/** Sales/contact address for Business enquiries. `PUBLIC_CONTACT_EMAIL`. */
export const CONTACT_EMAIL = (
  import.meta.env.PUBLIC_CONTACT_EMAIL || 'business@voxtranslate.app'
).trim();

/**
 * VoxTranslate API origin (Railway, fronted by Cloudflare), without a trailing
 * slash. Used by the Business contact form (`POST /api/contact`). Overridable at
 * build time via `PUBLIC_API_BASE`.
 */
export const API_BASE = origin(import.meta.env.PUBLIC_API_BASE, 'https://api.voxtranslate.app');

/**
 * Whether the Pro tier is offered. **OFF unless `PUBLIC_PRO_TIER_ENABLED` is truthy at
 * build time**, mirroring the server's `PRO_TIER_ENABLED` — the tier is withdrawn on
 * price/quality, not deleted, so bringing it back is a flag flip on both sides.
 *
 * This site is static, so it cannot read the server's flag at runtime; the two are set
 * together. The server is the enforcing side (an unregistered engine cannot be started);
 * this only stops the marketing site advertising something the app will not offer.
 */
export const PRO_TIER_ENABLED = ['1', 'true', 'yes', 'on'].includes(
  String(import.meta.env.PUBLIC_PRO_TIER_ENABLED ?? '')
    .trim()
    .toLowerCase(),
);

/** Existing legal pages live on the app domain. */
export const LEGAL_URLS = {
  privacy: `${APP_URL}/privacy`,
  terms: `${APP_URL}/terms`,
  acceptableUse: `${APP_URL}/acceptable-use`,
};

/**
 * Marketing site origin — the apex. Kept in sync with astro.config `site`, which
 * reads the same `PUBLIC_SITE_ORIGIN` (from `process.env` there, since
 * `import.meta.env` does not exist in the config file).
 */
export const SITE_ORIGIN = origin(import.meta.env.PUBLIC_SITE_ORIGIN, 'https://voxtranslate.app');

/**
 * Meta (Facebook) Pixel id. Public value; only loaded after marketing consent.
 *
 * Overridable via PUBLIC_FB_PIXEL_ID at build time, like the Google ids below, so
 * swapping the pixel is an env change plus a rebuild rather than a code deploy. An
 * UNSET or empty variable keeps the default below — CI always defines the var, and an
 * undefined repo Variable arrives as an empty string, which must not silently disable
 * tracking. Pass the literal `off` to ship no pixel at all.
 *
 * Whichever id is in use needs this site's domain allowed under the pixel's traffic
 * permissions, or Meta accepts the script and drops every event.
 *
 * History, so the previous ids are not tried again:
 *   - 362182456310675 — a real pixel, but Meta refused its traffic and its settings were
 *     unreachable from this account, so the domain allow-list could not be fixed.
 *   - 1829395151799504 — an APP id, not a pixel (Events Manager routes it under
 *     /list/app/ rather than /list/dataset/). Requests to /tr were answered 200, but an
 *     app data source is not what web conversions are attributed against, and it has no
 *     traffic permissions because apps have no domains.
 */
const configuredPixelId = import.meta.env.PUBLIC_FB_PIXEL_ID;
export const FB_PIXEL_ID =
  configuredPixelId === 'off' ? '' : configuredPixelId || '2706418669760386';

/** Google Analytics 4 Measurement ID (`G-XXXXXXX`). Set via PUBLIC_GA_ID at build
 *  time; empty string ⇒ gtag never loads. Like the Pixel, it loads only after the
 *  visitor accepts the cookie/consent banner. */
export const GA_ID = import.meta.env.PUBLIC_GA_ID ?? '';

/** Google Ads tag id (`AW-XXXXXXXXX`) for conversion tracking / remarketing. Set
 *  via PUBLIC_GOOGLE_ADS_ID at build time; empty string ⇒ the tag never loads.
 *  Shares gtag.js with GA4 and, like the Pixel, loads only after consent. */
export const GOOGLE_ADS_ID = import.meta.env.PUBLIC_GOOGLE_ADS_ID ?? '';

/**
 * The public Chrome Web Store listing. Overridable via `PUBLIC_CHROME_WEBSTORE_URL`
 * like every other origin here, so a staging build can point at an unlisted test
 * item rather than sending reviewers to the live one.
 *
 * The id is the store's, not ours, and it does not change when the extension is
 * updated — only if the item were ever unpublished and re-created, which would
 * also invalidate every install. Treat it as stable.
 */
export const CHROME_WEBSTORE_URL = (
  import.meta.env.PUBLIC_CHROME_WEBSTORE_URL ||
  'https://chromewebstore.google.com/detail/voxtranslate/maabjjeohcieihdockimokcckcnjcmbb'
)
  .trim()
  .replace(/\/$/, '');

/**
 * Official social profiles, rendered in the footer.
 *
 * Order here is the order they appear. Keys must match the `a11y.social.*` i18n
 * keys and the glyph names in `brandIcon()` — a link with no accessible label is
 * an unlabelled icon, which is the single most common footer accessibility bug.
 */
export const SOCIAL = {
  tiktok: 'https://www.tiktok.com/@voxtranslate.app',
  instagram: 'https://www.instagram.com/voxtranslateapp/',
  facebook: 'https://www.facebook.com/profile.php?id=61590895577218',
  linkedin: 'https://www.linkedin.com/company/voxtranslate-app',
} as const;

export type SocialNetwork = keyof typeof SOCIAL;
