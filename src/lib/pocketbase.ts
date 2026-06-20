/**
 * Typed PocketBase access for blog content.
 *
 * All reads happen at BUILD time (the site is statically prerendered). If
 * POCKETBASE_URL is unset or unreachable, we fall back to bundled seed posts so
 * `pnpm build` always succeeds and previews work without a running CMS.
 */
import PocketBase from 'pocketbase';
import { DEFAULT_LOCALE, type Locale } from './i18n';
import { readingMinutes } from './content';
import { FALLBACK_POSTS } from '../data/fallback-posts';

/** Per-locale overrides for the translatable fields of a post. */
export interface PostTranslation {
  title: string;
  excerpt: string;
  content: string;
}

/**
 * Shape stored in PocketBase / bundled fallback (pre-processing).
 * One record per post (NOT per language): the base fields are the default
 * locale, and `i18n` carries the translations for the other locales.
 */
export interface RawPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  published_at: string;
  updated?: string;
  /** Base language of the un-translated fields. */
  lang: Locale;
  tags: string[];
  seo_title?: string;
  seo_desc?: string;
  /** Translations keyed by locale; missing locales fall back to base fields. */
  i18n?: Partial<Record<Locale, Partial<PostTranslation>>>;
  /** Local cover path (bundled posts). */
  cover?: string;
  /** Absolute cover URL (PocketBase file). */
  coverUrl?: string;
}

/** Post resolved to a single locale, enriched for rendering. */
export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  published_at: string;
  updated?: string;
  lang: Locale;
  tags: string[];
  seo_title?: string;
  seo_desc?: string;
  readingMinutes: number;
  /** Resolved cover image (remote URL wins over local path). */
  image?: string;
}

const PB_URL = import.meta.env.POCKETBASE_URL as string | undefined;

/** Resolve a raw (multi-locale) post into a single-locale, render-ready Post. */
function resolve(raw: RawPost, lang: Locale): Post {
  const tr = lang === raw.lang ? undefined : raw.i18n?.[lang];
  const title = tr?.title || raw.title;
  const excerpt = tr?.excerpt || raw.excerpt;
  const content = tr?.content || raw.content;
  return {
    id: raw.id,
    slug: raw.slug,
    title,
    excerpt,
    content,
    author: raw.author,
    published_at: raw.published_at,
    updated: raw.updated,
    lang,
    tags: raw.tags,
    seo_title: raw.seo_title,
    seo_desc: raw.seo_desc,
    readingMinutes: readingMinutes(content),
    image: raw.coverUrl ?? raw.cover,
  };
}

function byDateDesc(a: RawPost, b: RawPost): number {
  return new Date(b.published_at).getTime() - new Date(a.published_at).getTime();
}

/** PocketBase serialises dates as "YYYY-MM-DD HH:MM:SS.mmmZ" — make it ISO. */
function pbDateToIso(value: unknown): string {
  if (!value) return '';
  const s = String(value).trim().replace(' ', 'T');
  const d = new Date(s);
  return isNaN(d.getTime()) ? String(value) : d.toISOString();
}

function fallback(lang: Locale): Post[] {
  return [...FALLBACK_POSTS].sort(byDateDesc).map((p) => resolve(p, lang));
}

/**
 * All published posts, each resolved to `lang` (newest first). Posts are NOT
 * filtered by language — every post is shown in every locale, translated via
 * its `i18n` map (falling back to the base language per field).
 */
export async function getPosts(lang: Locale): Promise<Post[]> {
  if (!PB_URL) return fallback(lang);
  try {
    const pb = new PocketBase(PB_URL);
    const records = await pb.collection('posts').getFullList({
      filter: `published = true`,
      sort: '-published_at',
    });
    return records.map((r) => {
      const raw: RawPost = {
        id: r.id,
        title: r.title,
        slug: r.slug,
        excerpt: r.excerpt,
        content: r.content,
        author: r.author,
        published_at: pbDateToIso(r.published_at),
        updated: r.updated ? pbDateToIso(r.updated) : undefined,
        lang: (r.lang || DEFAULT_LOCALE) as Locale,
        tags: Array.isArray(r.tags) ? r.tags : [],
        seo_title: r.seo_title || undefined,
        seo_desc: r.seo_desc || undefined,
        i18n: r.i18n && typeof r.i18n === 'object' ? r.i18n : undefined,
        coverUrl: r.cover ? `${PB_URL}/api/files/${r.collectionId}/${r.id}/${r.cover}` : undefined,
      };
      return resolve(raw, lang);
    });
  } catch (err) {
    console.warn(
      `[pocketbase] could not reach ${PB_URL} — using bundled posts. (${(err as Error)?.message ?? err})`,
    );
    return fallback(lang);
  }
}

/** A single post by slug, or null. */
export async function getPost(lang: Locale, slug: string): Promise<Post | null> {
  const posts = await getPosts(lang);
  return posts.find((p) => p.slug === slug) ?? null;
}

/** Up to `limit` posts sharing a tag with `post` (same locale, excluding itself). */
export async function getRelated(lang: Locale, post: Post, limit = 3): Promise<Post[]> {
  const posts = await getPosts(lang);
  const tags = new Set(post.tags);
  return posts
    .filter((p) => p.slug !== post.slug && p.tags.some((t) => tags.has(t)))
    .slice(0, limit);
}

/** Distinct tags across a locale's posts (for the filter UI). */
export async function getTags(lang: Locale): Promise<string[]> {
  const posts = await getPosts(lang);
  return [...new Set(posts.flatMap((p) => p.tags))].sort();
}
