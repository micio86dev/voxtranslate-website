/** Cross-cutting site constants (non-translatable). */

/** The live VoxTranslate app (where "Try free" / "Open app" point). */
export const APP_URL = 'https://voxtranslate.app';

/** The Business dashboard app (where the "Business" page CTAs point). */
export const DASHBOARD_URL = 'https://dashboard.voxtranslate.app';

/** Sales/contact address for Business enquiries. */
export const CONTACT_EMAIL = 'business@voxtranslate.app';

/** Existing legal pages live on the app domain. */
export const LEGAL_URLS = {
  privacy: `${APP_URL}/privacy`,
  terms: `${APP_URL}/terms`,
  acceptableUse: `${APP_URL}/acceptable-use`,
};

/** Marketing site origin (kept in sync with astro.config `site`). */
export const SITE_ORIGIN = 'https://website.voxtranslate.app';

/** Meta (Facebook) Pixel id. Public value; only loaded after marketing consent. */
export const FB_PIXEL_ID = '362182456310675';

export const SOCIAL = {
  // Placeholder handles — update when official accounts exist.
  x: 'https://x.com/voxtranslate',
  github: 'https://github.com/micio86dev',
};
