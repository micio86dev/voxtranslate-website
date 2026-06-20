/** HTML content helpers for blog posts (TOC + reading time). */

export interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '') // strip accents
    .replace(/<[^>]+>/g, '') // strip nested tags
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

/**
 * Inject stable ids into h2/h3 headings and return a flat TOC.
 * Works for both PocketBase rich-text and bundled fallback HTML.
 */
export function processContent(html: string): { html: string; toc: TocItem[] } {
  const toc: TocItem[] = [];
  const used = new Set<string>();

  const out = html.replace(/<h([23])([^>]*)>([\s\S]*?)<\/h\1>/g, (_m, lvl, attrs, inner) => {
    const level = Number(lvl) as 2 | 3;
    const text = inner.replace(/<[^>]+>/g, '').trim();
    let id = slugify(text) || `section-${toc.length + 1}`;
    let n = 2;
    while (used.has(id)) id = `${id}-${n++}`;
    used.add(id);
    toc.push({ id, text, level });
    // Preserve any existing attributes but ensure our id wins.
    const cleanedAttrs = String(attrs).replace(/\s*id="[^"]*"/g, '');
    return `<h${lvl}${cleanedAttrs} id="${id}">${inner}</h${lvl}>`;
  });

  return { html: out, toc };
}

/** Estimate reading time in minutes from HTML (≈200 wpm, min 1). */
export function readingMinutes(html: string): number {
  const words = html
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
