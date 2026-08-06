/**
 * The URL architecture from docs/seo/AGENTS.md §3, as one source of truth.
 *
 * "Fixed, not negotiable" only holds if there is a single place the shape is written
 * down. Templates, internal links and the four segmented sitemaps all build their URLs
 * from here, so a change is one edit rather than a grep across the repo — and a typo
 * cannot put a page in the sitemap under a URL that does not exist.
 *
 * These routes are deliberately NOT locale-prefixed. `english-to-german` is the pattern
 * people actually search (AGENTS.md §3); the pages exist in English only until
 * localisation is real, which is also why nothing here emits hreflang (§1).
 */

/** Every entry carries a nullable publish date; `null` means "not live yet". */
export interface Publishable {
  publishedAt: string | null;
}

/** Live = has a publish date, and it is not in the future. */
export function isPublished(entry: Publishable, now = new Date()): boolean {
  if (!entry.publishedAt) return false;
  return new Date(entry.publishedAt).getTime() <= now.getTime();
}

/* -- URL builders ---------------------------------------------------------- */

/** `english`, `german` → `english-to-german`. Directional: the reverse is a different page. */
export function pairSlug(source: string, target: string): string {
  return `${source.toLowerCase()}-to-${target.toLowerCase()}`;
}

export const LIVE_TRANSLATION_HUB = '/live-translation/';

export const pairUrl = (slug: string) => `${LIVE_TRANSLATION_HUB}${slug}/`;
export const platformUrl = (platform: string) => `${LIVE_TRANSLATION_HUB}for-${platform}/`;
export const alternativeUrl = (brand: string) => `/alternatives/${brand}/`;
export const versusUrl = (slug: string) => `/compare/${slug}/`;
export const brandPricingUrl = (brand: string) => `/pricing/${brand}-pricing/`;
export const personaUrl = (persona: string) => `/for/${persona}/`;
export const guideUrl = (slug: string) => `/guides/${slug}/`;

export const LATENCY_URL = '/latency/';
export const LANGUAGES_URL = '/languages/';

/**
 * Map a comparison entry to its URL. The three kinds share one collection because they
 * share one contract (verified sources, a publish date, an honest "when not to choose
 * us"), but they live under three different prefixes.
 */
export function comparisonUrl(kind: 'alternative' | 'versus' | 'pricing', slug: string): string {
  switch (kind) {
    case 'alternative':
      return alternativeUrl(slug);
    case 'versus':
      return versusUrl(slug);
    case 'pricing':
      // Slugs are authored as `{brand}-pricing`, matching the public URL exactly.
      return `/pricing/${slug}/`;
  }
}

/* -- Platform and persona registries --------------------------------------- */

export interface PlatformEntry {
  /** URL segment after `for-`, e.g. `zoom` → /live-translation/for-zoom/ */
  slug: string;
  name: string;
}

export interface PersonaEntry {
  slug: string;
  name: string;
}

/**
 * Both registries are EMPTY on purpose.
 *
 * Task 00 builds scaffolding and writes no public content, so these routes compile,
 * type-check and are wired into the sitemaps while producing zero pages. Tasks 02 and 03
 * add entries; nothing else has to change when they do.
 *
 * Note AGENTS.md R6: `/live-translation/for-zoom/` is a platform INTEGRATION page and is
 * allowed. A page targeting the head term "zoom translation" is not.
 */
export const PLATFORMS: readonly PlatformEntry[] = [];
export const PERSONAS: readonly PersonaEntry[] = [];
