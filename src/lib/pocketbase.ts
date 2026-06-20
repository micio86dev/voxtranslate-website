/**
 * Typed PocketBase access for blog content.
 *
 * All reads happen at BUILD time (the site is statically prerendered). If
 * POCKETBASE_URL is unset or unreachable, we fall back to bundled seed posts so
 * `pnpm build` always succeeds and previews work without a running CMS.
 */
import PocketBase from 'pocketbase';
import type { Locale } from './i18n';
import { readingMinutes } from './content';
import { FALLBACK_POSTS } from '../data/fallback-posts';

/** Shape stored in PocketBase / bundled fallback (pre-processing). */
export interface RawPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  published_at: string;
  updated?: string;
  lang: Locale;
  tags: string[];
  seo_title?: string;
  seo_desc?: string;
  /** Local cover path (bundled posts). */
  cover?: string;
  /** Absolute cover URL (PocketBase file). */
  coverUrl?: string;
}

/** Post enriched for rendering. */
export interface Post extends RawPost {
  readingMinutes: number;
  /** Resolved cover image (remote URL wins over local path). */
  image?: string;
}

const PB_URL = import.meta.env.POCKETBASE_URL as string | undefined;

function enrich(raw: RawPost): Post {
  return {
    ...raw,
    readingMinutes: readingMinutes(raw.content),
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
  return FALLBACK_POSTS.filter((p) => p.lang === lang)
    .sort(byDateDesc)
    .map(enrich);
}

/** All published posts for a locale, newest first. */
export async function getPosts(lang: Locale): Promise<Post[]> {
  if (!PB_URL) return fallback(lang);
  try {
    const pb = new PocketBase(PB_URL);
    const records = await pb.collection('posts').getFullList({
      filter: `published = true && lang = "${lang}"`,
      sort: '-published_at',
    });
    return records.map((r) =>
      enrich({
        id: r.id,
        title: r.title,
        slug: r.slug,
        excerpt: r.excerpt,
        content: r.content,
        author: r.author,
        published_at: pbDateToIso(r.published_at),
        updated: r.updated ? pbDateToIso(r.updated) : undefined,
        lang: r.lang,
        tags: Array.isArray(r.tags) ? r.tags : [],
        seo_title: r.seo_title || undefined,
        seo_desc: r.seo_desc || undefined,
        coverUrl: r.cover ? `${PB_URL}/api/files/${r.collectionId}/${r.id}/${r.cover}` : undefined,
      }),
    );
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
