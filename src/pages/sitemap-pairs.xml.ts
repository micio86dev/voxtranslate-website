/**
 * `sitemap-pairs.xml` — programmatic language-pair pages.
 *
 * The segment the task 04 and 05 gates are read from. Keeping it isolated is what makes
 * "70% of Tier 1 pairs indexed" a number that can actually be looked up rather than
 * inferred from a site-wide total.
 *
 * Only published entries appear. Drafts render `noindex` and are absent here.
 */
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { absoluteUrl } from '../lib/seo';
import { isPublished, pairUrl } from '../lib/seo-routes';
import { renderUrlset, xmlResponse, type SitemapEntry } from '../lib/sitemap';

export const GET: APIRoute = async ({ site }) => {
  const pairs = await getCollection('pairs');
  const entries: SitemapEntry[] = pairs
    .filter((entry) => isPublished(entry.data))
    .map((entry) => ({
      loc: absoluteUrl(site, pairUrl(entry.id)),
      lastmod: entry.data.publishedAt ?? undefined,
      priority: entry.data.tier === 1 ? 0.8 : 0.6,
    }));

  return xmlResponse(renderUrlset(entries));
};
