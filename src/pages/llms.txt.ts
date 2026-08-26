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
import { APP_URL, SITE_ORIGIN, CHROME_WEBSTORE_URL } from '../lib/site';
import {
  PLATFORMS,
  PERSONAS,
  platformUrl,
  personaUrl,
  isPublished,
  GUIDES_URL,
  LIVE_TRANSLATION_HUB,
} from '../lib/seo-routes';

const clean = (s: string) => s.replace(/\s+/g, ' ').trim();

export const GET: APIRoute = async ({ site }) => {
  const posts = await getPosts('en');
  const url = (path: string) => absoluteUrl(site, path);

  const lines = [
    '# VoxTranslate',
    '',
    '> Real-time translation in two places: video calls and webinars you run yourself, and the audio of any tab in Chrome. Credit-based, billed to the listener per minute of translation received, no subscription required.',
    '',
    `VoxTranslate is two products on one account. **Calls and webinars**: up to four participants, each speaking and hearing their own language, with live subtitles, spoken translation and diarized transcripts — webinar attendees join by link and pick their own language. **VoxTranslate for Chrome**: an extension that translates the audio playing in one browser tab, giving you subtitles over the page and an optional spoken translation, which covers Google Meet Web, Zoom Web, YouTube and YouTube Live, Twitch, course players and podcasts. Billing is LISTENER-side: you are charged per minute, from $0.0045, at the rate of the engine YOU chose, and only while someone else is speaking a language different from yours — one stream per simultaneous foreign speaker. Speaking is free. Nothing is charged when everyone in the room already shares a language. Webinars are the exception: the host's organisation pays and attendees never do. Language coverage is per tier: Standard 29, Enhanced 61, Premium 84. No latency figure is published anywhere on this site, because none has been measured on the shipped build. This marketing site lives at ${SITE_ORIGIN}; the call app lives at ${APP_URL}.`,
    '',
    '## Product',
    `- [VoxTranslate — real-time translated calls and webinars](${url(localizePath('en'))}): product overview, features, three quality tiers, and pricing.`,
    `- [VoxTranslate for Chrome](${url(localizePath('en', 'chrome'))}): the browser extension — what it captures (one tab's audio, never the microphone), what you control, and what it does not do.`,
    `- [Pricing](${url(localizePath('en', 'pricing'))}): per-minute rates per engine, worked examples, and the billing rules.`,
    `- [VoxTranslate for Business](${url(localizePath('en', 'business'))}): translated meetings for teams — shared call history, multilingual transcripts, projects, and compliance.`,
    `- [Launch the app](${APP_URL}): start or join a real-time translated video call.`,
    `- [Install the Chrome extension](${CHROME_WEBSTORE_URL}): the Chrome Web Store listing.`,
    '',
    '## Where the extension applies',
    ...PLATFORMS.map((p) => `- [Live translation for ${p.name}](${url(platformUrl(p.slug))})`),
    '',
    '## Guides and use cases',
    `- [Live translation hub](${url(LIVE_TRANSLATION_HUB)}): the entry point for the guides, platform pages and language matrix.`,
    `- [All guides](${url(GUIDES_URL)}): 35 practical guides on running meetings, webinars and calls across languages.`,
    ...PERSONAS.filter((p) => isPublished(p)).map(
      (p) => `- [For ${p.name}](${url(personaUrl(p.slug))})`,
    ),
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
