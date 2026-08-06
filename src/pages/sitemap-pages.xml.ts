/**
 * `sitemap-pages.xml` — the editorial site: localized marketing pages and the blog.
 *
 * Kept separate from the three SEO families so Search Console reports their indexing
 * separately. This is the segment that already has authority; mixing it with a fresh batch
 * of programmatic pages would hide exactly the signal the phase gates need.
 */
import type { APIRoute } from 'astro';
import { LOCALES, localizePath } from '../lib/i18n';
import { getPosts } from '../lib/pocketbase';
import { buildAlternates, absoluteUrl } from '../lib/seo';
import { listMeasurements } from '../lib/measurements';
import { LATENCY_URL, LANGUAGES_URL, LIVE_TRANSLATION_HUB } from '../lib/seo-routes';
import { renderUrlset, xmlResponse, BUILD_DATE, type SitemapEntry } from '../lib/sitemap';

/** Localized routes that exist for every locale. '' is the home page. */
const LOCALIZED_ROUTES = ['', 'blog', 'business', 'pricing'];

export const GET: APIRoute = async ({ site }) => {
  const entries: SitemapEntry[] = [];

  for (const route of LOCALIZED_ROUTES) {
    for (const lang of LOCALES) {
      entries.push({
        loc: absoluteUrl(site, localizePath(lang, route)),
        lastmod: BUILD_DATE,
        priority: route === '' ? 1.0 : 0.7,
        alternates: buildAlternates(site, route),
      });
    }
  }

  // Blog posts carry their own publication date, which is a better <lastmod> than the
  // build timestamp. Each post exists only in the locale it was written for, so no
  // hreflang siblings are emitted.
  for (const lang of LOCALES) {
    const posts = await getPosts(lang);
    for (const post of posts) {
      entries.push({
        loc: absoluteUrl(site, localizePath(lang, `blog/${post.slug}`)),
        lastmod: post.updated ?? post.published_at,
        priority: 0.6,
      });
    }
  }

  // Standalone Italian landing page — no locale prefix, no hreflang siblings.
  entries.push({
    loc: absoluteUrl(site, '/traduzione-simultanea-videochiamate/'),
    lastmod: BUILD_DATE,
    priority: 0.7,
  });

  // The pillar hub always ships. `/latency/` and `/languages/` are noindex until task 01
  // produces measurements, and a noindex page in a sitemap is a contradictory signal —
  // so they join the sitemap on the same build that makes them indexable.
  entries.push({
    loc: absoluteUrl(site, LIVE_TRANSLATION_HUB),
    lastmod: BUILD_DATE,
    priority: 0.8,
  });
  if (listMeasurements().length > 0) {
    entries.push({ loc: absoluteUrl(site, LATENCY_URL), lastmod: BUILD_DATE, priority: 0.8 });
    entries.push({ loc: absoluteUrl(site, LANGUAGES_URL), lastmod: BUILD_DATE, priority: 0.8 });
  }

  return xmlResponse(renderUrlset(entries));
};
