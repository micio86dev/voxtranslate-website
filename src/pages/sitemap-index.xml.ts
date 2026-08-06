/**
 * `sitemap-index.xml` — the one URL submitted to Search Console.
 *
 * Keeps the filename the previous `@astrojs/sitemap` setup already published and that
 * `public/robots.txt` already points at, so the migration to segmented sitemaps costs no
 * re-submission and breaks no existing reference.
 *
 * All four segments are listed unconditionally, including the ones that are empty today.
 * An empty `<urlset>` is valid and reports as "0 discovered" rather than as an error, which
 * is a more useful state than a segment that silently appears months later.
 */
import type { APIRoute } from 'astro';
import { absoluteUrl } from '../lib/seo';
import { renderSitemapIndex, xmlResponse, BUILD_DATE } from '../lib/sitemap';

const SEGMENTS = [
  'sitemap-pages.xml',
  'sitemap-pairs.xml',
  'sitemap-guides.xml',
  'sitemap-compare.xml',
];

export const GET: APIRoute = ({ site }) =>
  xmlResponse(
    renderSitemapIndex(
      SEGMENTS.map((name) => ({ loc: absoluteUrl(site, `/${name}`), lastmod: BUILD_DATE })),
    ),
  );
