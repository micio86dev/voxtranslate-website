/** Cross-cutting site constants (non-translatable). */

/** The live VoxTranslate app (where "Try free" / "Open app" point). */
export const APP_URL = 'https://voxtranslate.app';

/** The Business dashboard app (where the "Business" page CTAs point). */
export const DASHBOARD_URL = 'https://dashboard.voxtranslate.app';

/** Sales/contact address for Business enquiries. */
export const CONTACT_EMAIL = 'business@voxtranslate.app';

/**
 * VoxTranslate API origin (Railway, fronted by Cloudflare), without a trailing
 * slash. Used by the Business contact form (`POST /api/contact`). Overridable at
 * build time via `PUBLIC_API_BASE`.
 */
export const API_BASE = (import.meta.env.PUBLIC_API_BASE || 'https://api.voxtranslate.app').replace(
  /\/$/,
  '',
);

/** Existing legal pages live on the app domain. */
export const LEGAL_URLS = {
  privacy: `${APP_URL}/privacy`,
  terms: `${APP_URL}/terms`,
  acceptableUse: `${APP_URL}/acceptable-use`,
};

/** Marketing site origin (kept in sync with astro.config `site`). */
export const SITE_ORIGIN = 'https://website.voxtranslate.app';

/**
 * Meta (Facebook) Pixel id. Public value; only loaded after marketing consent.
 *
 * Overridable via PUBLIC_FB_PIXEL_ID at build time, like the Google ids below — so
 * swapping the pixel (or turning it off with an empty value) is an env change plus a
 * rebuild, not a code deploy. The default is the id in use since June 2026; note that
 * Meta rejects its traffic unless this site's domain is allowed on that pixel.
 */
export const FB_PIXEL_ID = import.meta.env.PUBLIC_FB_PIXEL_ID ?? '362182456310675';

/** Google Analytics 4 Measurement ID (`G-XXXXXXX`). Set via PUBLIC_GA_ID at build
 *  time; empty string ⇒ gtag never loads. Like the Pixel, it loads only after the
 *  visitor accepts the cookie/consent banner. */
export const GA_ID = import.meta.env.PUBLIC_GA_ID ?? '';

/** Google Ads tag id (`AW-XXXXXXXXX`) for conversion tracking / remarketing. Set
 *  via PUBLIC_GOOGLE_ADS_ID at build time; empty string ⇒ the tag never loads.
 *  Shares gtag.js with GA4 and, like the Pixel, loads only after consent. */
export const GOOGLE_ADS_ID = import.meta.env.PUBLIC_GOOGLE_ADS_ID ?? '';

export const SOCIAL = {
  // Placeholder handles — update when official accounts exist.
  x: 'https://x.com/voxtranslate',
  github: 'https://github.com/micio86dev',
};
