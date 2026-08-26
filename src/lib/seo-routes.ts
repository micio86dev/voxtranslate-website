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
 * The guides hub. `/guides/{slug}/` shipped in task 03 without one, so two thirds of
 * the guides had no inbound internal link at all and were reachable only through
 * `sitemap-guides.xml` — a sitemap entry is a crawl hint, not a vote.
 */
export const GUIDES_URL = '/guides/';

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
  /** URL segment after `for-`, e.g. `zoom-web` → /live-translation/for-zoom-web/ */
  slug: string;
  name: string;
}

export interface PersonaEntry {
  slug: string;
  name: string;
  /** Same convention as the collections: `null` = written but not live. */
  publishedAt: string | null;
}

/**
 * Platform integration pages, filled by task 06.
 *
 * Note AGENTS.md R6: `/live-translation/for-zoom-web/` is a platform INTEGRATION page and
 * is allowed. A page targeting the head term "zoom translation" is not.
 *
 * The `-web` suffix on the two meeting platforms is not decoration. The extension listens
 * to a browser tab, so it reaches Google Meet and Zoom through their WEB clients and not
 * their desktop applications. A slug that said `for-zoom` would promise the desktop app
 * on the strength of its URL alone, which is the same class of error as an unqualified
 * language count.
 *
 * This registry is the ORDER; the content lives in `src/content/platforms/{slug}.md` and
 * `platformSchema` is what stops a thin one shipping. A slug here with no matching entry
 * fails the build in `for-[platform].astro`, which is the intended direction: the URL
 * architecture is declared, the content has to earn it.
 */
export const PLATFORMS: readonly PlatformEntry[] = [
  { slug: 'google-meet-web', name: 'Google Meet Web' },
  { slug: 'zoom-web', name: 'Zoom Web' },
  { slug: 'youtube', name: 'YouTube and YouTube Live' },
  { slug: 'twitch', name: 'Twitch' },
];

/**
 * Use-case landing pages (task 03 §3). Unlike guides, these carry a direct commercial
 * CTA, which is why each is a hand-written page under `src/pages/for/` rather than an
 * entry in a collection rendered through one template.
 *
 * All five are drafts. They render for review, `noindex`, and stay out of the sitemap
 * until someone sets a date here — publishing five pages of commercial copy is a
 * decision, not a build step.
 */
export const PERSONAS: readonly PersonaEntry[] = [
  {
    slug: 'webinar-organizers',
    name: 'webinar organisers',
    publishedAt: '2026-08-07T00:00:00.000Z',
  },
  { slug: 'distributed-teams', name: 'distributed teams', publishedAt: '2026-08-07T00:00:00.000Z' },
  { slug: 'procurement', name: 'procurement teams', publishedAt: '2026-08-07T00:00:00.000Z' },
  {
    slug: 'internal-comms',
    name: 'internal communications',
    publishedAt: '2026-08-07T00:00:00.000Z',
  },
  { slug: 'sales-teams', name: 'sales teams', publishedAt: '2026-08-07T00:00:00.000Z' },
];

/** Look up a persona by slug. Throws rather than returning undefined, so a typo in a
 *  page's slug fails the build instead of rendering an untitled page. */
export function personaBySlug(slug: string): PersonaEntry {
  const found = PERSONAS.find((p) => p.slug === slug);
  if (!found) throw new Error(`[seo-routes] unknown persona slug "${slug}"`);
  return found;
}
