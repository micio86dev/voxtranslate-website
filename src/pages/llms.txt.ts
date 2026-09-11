/**
 * /llms.txt — a curated, machine-readable map of the site for LLMs and AI agents
 * (the llmstxt.org convention: H1 + blockquote summary, then link sections).
 * Generated at build time from the same PocketBase/fallback content as the blog,
 * so the post list never drifts. Complements robots.txt + the sitemap.
 */
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
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
  PHONE_TRANSLATION_URL,
} from '../lib/seo-routes';

const clean = (s: string) => s.replace(/\s+/g, ' ').trim();

export const GET: APIRoute = async ({ site }) => {
  const posts = await getPosts('en');
  // Counted, not typed. Every other list in this file is derived — platforms, personas,
  // posts, locales — and this one was a literal `35`, which is true today and silently
  // false the moment a guide is added. That is the same failure shape as the plan prices
  // `org-plans.ts` exists to prevent.
  // Filtered the way `/guides/index.astro` and `sitemap-guides.xml.ts` filter it, and the
  // way `PERSONAS` is filtered below with the same imported helper. An unfiltered count
  // would replace a literal that drifts with a derivation that drifts — advertising a
  // draft guide to every crawler while `/guides/` does not list it.
  const guideCount = (await getCollection('guides')).filter((g) => isPublished(g.data)).length;
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
    `- [Translated phone calls](${url(PHONE_TRANSLATION_URL)}): Business and Enterprise organisations call ordinary telephone numbers from the dashboard, with both sides translated in real time — the person on the other end needs no account, no app and no internet, only a phone. OUTBOUND ONLY today: VoxTranslate cannot yet receive calls, bridge two telephones, carry video on a call, or guarantee EU-only processing, and mainland China is switched off pending a route validated from inside the country. The recipient is told, in their own language, before anything is recorded or transcribed.`,
    `- [Launch the app](${APP_URL}): start or join a real-time translated video call.`,
    `- [Install the Chrome extension](${CHROME_WEBSTORE_URL}): the Chrome Web Store listing.`,
    '',
    '## Where the extension applies',
    ...PLATFORMS.map((p) => `- [Live translation for ${p.name}](${url(platformUrl(p.slug))})`),
    '',
    '## Guides and use cases',
    `- [Live translation hub](${url(LIVE_TRANSLATION_HUB)}): the entry point for the guides, platform pages and language matrix.`,
    `- [All guides](${url(GUIDES_URL)}): ${guideCount} practical guides on running meetings, webinars and calls across languages.`,
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
