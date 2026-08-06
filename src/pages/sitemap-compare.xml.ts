/**
 * `sitemap-compare.xml` — `/alternatives/`, `/compare/` and `/pricing/`.
 *
 * The three highest-commercial-intent families, and the ones a new domain can realistically
 * win. They share a segment because they share a fate: if this sitemap indexes, the
 * strategy is working; if it does not, nothing downstream is worth publishing yet.
 *
 * `lastmod` is the verification date, not the publish date. These pages make dated claims
 * about other companies' pricing, so the date a human last checked the sources is the only
 * freshness signal that means anything here.
 */
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { absoluteUrl } from '../lib/seo';
import { isPublished, comparisonUrl } from '../lib/seo-routes';
import { renderUrlset, xmlResponse, type SitemapEntry } from '../lib/sitemap';

export const GET: APIRoute = async ({ site }) => {
  const comparisons = await getCollection('comparisons');
  const entries: SitemapEntry[] = comparisons
    .filter((entry) => isPublished(entry.data))
    .map((entry) => ({
      loc: absoluteUrl(site, comparisonUrl(entry.data.kind, entry.id)),
      lastmod: entry.data.verifiedAt,
      priority: 0.8,
    }));

  return xmlResponse(renderUrlset(entries));
};
