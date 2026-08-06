/**
 * `sitemap-guides.xml` — the how-to cluster.
 *
 * Guides and pair pages are indexed at very different rates on a new domain: editorial
 * how-tos get picked up quickly, programmatic pages do not. Separating them keeps one
 * from masking the other in Search Console.
 */
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { absoluteUrl } from '../lib/seo';
import { isPublished, guideUrl } from '../lib/seo-routes';
import { renderUrlset, xmlResponse, type SitemapEntry } from '../lib/sitemap';

export const GET: APIRoute = async ({ site }) => {
  const guides = await getCollection('guides');
  const entries: SitemapEntry[] = guides
    .filter((entry) => isPublished(entry.data))
    .map((entry) => ({
      loc: absoluteUrl(site, guideUrl(entry.id)),
      lastmod: entry.data.publishedAt ?? undefined,
      priority: 0.7,
    }));

  return xmlResponse(renderUrlset(entries));
};
