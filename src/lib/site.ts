/** Cross-cutting site constants (non-translatable). */

/** The live VoxTranslate app (where "Try free" / "Open app" point). */
export const APP_URL = 'https://voxtranslate.app';

/** Existing legal pages live on the app domain. */
export const LEGAL_URLS = {
  privacy: `${APP_URL}/privacy`,
  terms: `${APP_URL}/terms`,
  acceptableUse: `${APP_URL}/acceptable-use`,
};

/** Marketing site origin (kept in sync with astro.config `site`). */
export const SITE_ORIGIN = 'https://voxtranslate.com';

export const SOCIAL = {
  // Placeholder handles — update when official accounts exist.
  x: 'https://x.com/voxtranslate',
  github: 'https://github.com/micio86dev',
};
