/**
 * /llms.txt — a curated, machine-readable map of the site for LLMs and AI agents
 * (the llmstxt.org convention: H1 + blockquote summary, then link sections).
 * Generated at build time from the same PocketBase/fallback content as the blog,
 * so the post list never drifts. Complements robots.txt + the sitemap.
 */
import type { APIRoute } from 'astro';
import { getPosts } from '../lib/pocketbase';
import { absoluteUrl } from '../lib/seo';
import { LOCALE_NAMES, LOCALES, localizePath } from '../lib/i18n';

const APP_URL = 'https://voxtranslate.app/';
const clean = (s: string) => s.replace(/\s+/g, ' ').trim();

export const GET: APIRoute = async ({ site }) => {
  const posts = await getPosts('en');
  const url = (path: string) => absoluteUrl(site, path);

  const lines = [
    '# VoxTranslate',
    '',
    '> Free real-time AI voice translator for video calls: VoxTranslate transcribes, translates and speaks every voice in a call live — voice-to-voice across 84 languages, right in the browser.',
    '',
    "VoxTranslate turns any video call into a multilingual conversation: live speech-to-text captions, spoken voice-to-voice translation in each listener's own language, and auto-translated text chat. It runs in the browser with no install and is free to start. The app lives at https://voxtranslate.app; this marketing site (product, business, blog) lives at https://website.voxtranslate.app.",
    '',
    '## Product',
    `- [VoxTranslate — real-time AI voice translator](${url(localizePath('en'))}): product overview, features, four quality tiers, and pricing.`,
    `- [VoxTranslate for Business](${url(localizePath('en', 'business'))}): translated meetings for teams — shared call history, multilingual transcripts, projects, and compliance.`,
    `- [Launch the app](${APP_URL}): start or join a real-time translated video call.`,
    '',
    '## Blog',
    `- [VoxTranslate blog](${url(localizePath('en', 'blog'))}): guides and comparisons on real-time voice translation and how the engine tiers work.`,
    ...posts.map(
      (p) =>
        `- [${clean(p.title)}](${url(localizePath('en', `blog/${p.slug}`))}): ${clean(p.excerpt)}`,
    ),
    '',
    '## Other languages',
    ...LOCALES.filter((l) => l !== 'en').map(
      (l) => `- ${LOCALE_NAMES[l]}: ${url(localizePath(l))}`,
    ),
    '',
  ];

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
