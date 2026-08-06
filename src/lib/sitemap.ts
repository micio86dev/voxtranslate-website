/**
 * Segmented sitemap generation.
 *
 * Deliberately hand-rolled rather than delegated to `@astrojs/sitemap`, which emits one
 * chunked set under a single base name. Task 00 §4 requires four SEPARATELY NAMED
 * sitemaps behind an index, and the reason is operational rather than cosmetic: Search
 * Console reports indexing per submitted sitemap. Segmenting by content family is the only
 * way to see that, say, the guides are being indexed while the pair pages are being
 * ignored — which is precisely the signal the task 04 and 05 phase gates are read from.
 * A flat sitemap answers "how many URLs are indexed" and nothing else.
 *
 * Entries with `publishedAt: null` never reach any of these functions; they are filtered
 * at the call site and rendered `noindex`.
 */
import type { Alternate } from './seo';

export interface SitemapEntry {
  /** Absolute URL. */
  loc: string;
  /** ISO 8601. The one freshness field Google actually consults. */
  lastmod?: string;
  priority?: number;
  /** hreflang siblings. Must match the in-page tags exactly or Google flags the mismatch. */
  alternates?: Alternate[];
}

export interface SitemapRef {
  loc: string;
  lastmod?: string;
}

/** XML text escaping. URLs may legitimately contain `&`, which is not optional to escape. */
function xml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function renderEntry(entry: SitemapEntry): string {
  const parts = [`    <loc>${xml(entry.loc)}</loc>`];
  if (entry.lastmod) parts.push(`    <lastmod>${xml(entry.lastmod)}</lastmod>`);
  if (entry.priority !== undefined) {
    parts.push(`    <priority>${entry.priority.toFixed(1)}</priority>`);
  }
  for (const alt of entry.alternates ?? []) {
    parts.push(
      `    <xhtml:link rel="alternate" hreflang="${xml(alt.hreflang)}" href="${xml(alt.href)}"/>`,
    );
  }
  return `  <url>\n${parts.join('\n')}\n  </url>`;
}

/** A `<urlset>` document. Declares the xhtml namespace only when alternates are present. */
export function renderUrlset(entries: SitemapEntry[]): string {
  const needsXhtml = entries.some((e) => e.alternates?.length);
  const ns = [
    'xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
    needsXhtml ? 'xmlns:xhtml="http://www.w3.org/1999/xhtml"' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset ${ns}>
${entries.map(renderEntry).join('\n')}
</urlset>
`;
}

/** A `<sitemapindex>` document — the single URL submitted to Search Console. */
export function renderSitemapIndex(sitemaps: SitemapRef[]): string {
  const body = sitemaps
    .map((s) => {
      const lastmod = s.lastmod ? `\n    <lastmod>${xml(s.lastmod)}</lastmod>` : '';
      return `  <sitemap>\n    <loc>${xml(s.loc)}</loc>${lastmod}\n  </sitemap>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</sitemapindex>
`;
}

/** Shared response shape for every sitemap endpoint. */
export function xmlResponse(body: string): Response {
  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}

/**
 * The site is rebuilt in full on every deploy, so build time is an honest `<lastmod>`
 * for pages whose content has no date of its own. Computed once per build.
 */
export const BUILD_DATE = new Date().toISOString();
