/**
 * SEO helpers — canonical URLs, hreflang alternates, and JSON-LD builders.
 * Keeps BaseLayout/BlogLayout thin and ensures every page emits consistent,
 * absolute, locale-aware metadata.
 */
import { LOCALES, OG_LOCALES, localizePath, type Locale } from './i18n';

const SITE_NAME = 'VoxTranslate';

/** Join the site origin with a path, collapsing duplicate slashes. */
export function absoluteUrl(site: string | URL | undefined, path: string): string {
  const origin = (site ? site.toString() : 'https://website.voxtranslate.app').replace(/\/+$/, '');
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `${origin}${clean}`;
}

export interface Alternate {
  hreflang: string;
  href: string;
}

/**
 * Build hreflang alternates for `pathWithoutLocale` ('' = home, 'blog',
 * 'blog/my-post') across every locale, plus an x-default pointing at English.
 */
export function buildAlternates(
  site: string | URL | undefined,
  pathWithoutLocale: string,
): Alternate[] {
  const alts: Alternate[] = LOCALES.map((l) => ({
    hreflang: l,
    href: absoluteUrl(site, localizePath(l, pathWithoutLocale)),
  }));
  alts.push({
    hreflang: 'x-default',
    href: absoluteUrl(site, localizePath('en', pathWithoutLocale)),
  });
  return alts;
}

export function ogLocale(lang: Locale): string {
  return OG_LOCALES[lang];
}

/* ---- JSON-LD ------------------------------------------------------------ */

export function websiteJsonLd(site: string | URL | undefined, lang: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: absoluteUrl(site, localizePath(lang)),
    inLanguage: lang,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${absoluteUrl(site, localizePath(lang, 'blog'))}?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

export function softwareAppJsonLd(site: string | URL | undefined) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: SITE_NAME,
    applicationCategory: 'CommunicationApplication',
    operatingSystem: 'Web',
    url: absoluteUrl(site, '/'),
    description:
      'Real-time translated video calls. VoxTranslate transcribes, translates and speaks every voice in your call live across 84 languages.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      description: 'Free starter credits, credit-based usage billing.',
    },
  };
}

export interface PostLike {
  title: string;
  slug: string;
  excerpt: string;
  author: string;
  published_at: string;
  updated?: string;
  coverUrl?: string;
}

export function blogJsonLd(site: string | URL | undefined, lang: Locale, posts: PostLike[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: `${SITE_NAME} Blog`,
    url: absoluteUrl(site, localizePath(lang, 'blog')),
    inLanguage: lang,
    blogPost: posts.map((p) => ({
      '@type': 'BlogPosting',
      headline: p.title,
      url: absoluteUrl(site, localizePath(lang, `blog/${p.slug}`)),
      datePublished: p.published_at,
      author: { '@type': 'Person', name: p.author },
    })),
  };
}

export function blogPostingJsonLd(site: string | URL | undefined, lang: Locale, post: PostLike) {
  const url = absoluteUrl(site, localizePath(lang, `blog/${post.slug}`));
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    inLanguage: lang,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    url,
    datePublished: post.published_at,
    dateModified: post.updated ?? post.published_at,
    author: { '@type': 'Person', name: post.author },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: { '@type': 'ImageObject', url: absoluteUrl(site, '/icon.png') },
    },
    ...(post.coverUrl ? { image: post.coverUrl } : {}),
  };
}
