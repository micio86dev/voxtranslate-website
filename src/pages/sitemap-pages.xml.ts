/**
 * `sitemap-pages.xml` — the editorial site: localized marketing pages and the blog.
 *
 * Kept separate from the three SEO families so Search Console reports their indexing
 * separately. This is the segment that already has authority; mixing it with a fresh batch
 * of programmatic pages would hide exactly the signal the phase gates need.
 */
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { LOCALES, localizePath } from '../lib/i18n';
import { getPosts } from '../lib/pocketbase';
import { buildAlternates, absoluteUrl } from '../lib/seo';
import { listMeasurements } from '../lib/measurements';
import {
  LATENCY_URL,
  LANGUAGES_URL,
  LIVE_TRANSLATION_HUB,
  GUIDES_URL,
  PERSONAS,
  PLATFORMS,
  personaUrl,
  platformUrl,
  isPublished,
} from '../lib/seo-routes';
import { renderUrlset, xmlResponse, BUILD_DATE, type SitemapEntry } from '../lib/sitemap';

/** Localized routes that exist for every locale. '' is the home page. */
const LOCALIZED_ROUTES = ['', 'blog', 'business', 'chrome', 'pricing'];

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

  // The guides hub. Ships with the guides themselves (sitemap-guides.xml) but belongs
  // here: it is a navigational page of this site, not a piece of the guides cluster.
  entries.push({ loc: absoluteUrl(site, GUIDES_URL), lastmod: BUILD_DATE, priority: 0.7 });

  // Platform integration pages. Ordered by PLATFORMS; a draft (publishedAt: null) renders
  // noindex and stays out of here, same rule as the personas below.
  {
    const published = new Map(
      (await getCollection('platforms')).filter((e) => isPublished(e.data)).map((e) => [e.id, e]),
    );
    for (const p of PLATFORMS) {
      const entry = published.get(p.slug);
      if (!entry) continue;
      entries.push({
        loc: absoluteUrl(site, platformUrl(p.slug)),
        lastmod: entry.data.publishedAt ?? BUILD_DATE,
        priority: 0.8,
      });
    }
  }

  // Use-case landing pages. Commercial intent rather than editorial, so they belong with
  // the site's own pages rather than in the guides segment. Drafts render `noindex` and
  // are absent here until someone sets a publish date in the PERSONAS registry.
  for (const persona of PERSONAS.filter((p) => isPublished(p))) {
    entries.push({
      loc: absoluteUrl(site, personaUrl(persona.slug)),
      lastmod: persona.publishedAt ?? BUILD_DATE,
      priority: 0.8,
    });
  }

  return xmlResponse(renderUrlset(entries));
};
