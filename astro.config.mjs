// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Canonical origin for SEO — powers Astro.site so layouts emit absolute
// canonical / Open Graph / hreflang / sitemap URLs. Marketing site is served on
// Cloudflare Pages at the website.voxtranslate.app apex.
const SITE = 'https://website.voxtranslate.app';

// 5 marketing locales. Keep in sync with src/i18n/*.json and the sitemap map.
export const LOCALES = ['en', 'it', 'es', 'de', 'fr'];

// The whole site is statically rebuilt on every deploy, so build time is an
// honest <lastmod> for the sitemap. Computed once at config load.
const BUILD_DATE = new Date().toISOString();

export default defineConfig({
  site: SITE,
  // Pure static prerender → flat files in dist/, deployed to Cloudflare Pages
  // (headers/redirects via public/_headers & _redirects). Build-time sharp keeps
  // images optimal with no runtime image function — ideal for Lighthouse 100.
  output: 'static',
  trailingSlash: 'always',
  i18n: {
    defaultLocale: 'en',
    locales: LOCALES,
    // Every locale is URL-prefixed (/en/, /it/ …). `/` is NOT auto-redirected —
    // src/pages/index.astro does soft browser-language detection instead.
    routing: { prefixDefaultLocale: true, redirectToDefaultLocale: false },
  },
  integrations: [
    sitemap({
      // hreflang codes MUST match the in-page <link rel="alternate"> tags, which
      // buildAlternates() (src/lib/seo.ts) emits as plain language codes (en, it,
      // es, de, fr). Google flags sitemap↔page hreflang mismatches, and
      // VoxTranslate targets each language globally (not a single region), so
      // plain codes are the right target — not region-qualified en-US/it-IT.
      i18n: {
        defaultLocale: 'en',
        locales: {
          en: 'en',
          it: 'it',
          es: 'es',
          de: 'de',
          fr: 'fr',
        },
      },
      // Give every URL a <lastmod> (build date) so crawlers get a freshness
      // hint — the one field Google actually consults. The localized home pages
      // also get top priority; other routes inherit the sitemap default (0.7).
      serialize(item) {
        item.lastmod = BUILD_DATE;
        if (/^\/(?:[a-z]{2}\/)?$/.test(new URL(item.url).pathname)) {
          item.priority = 1.0;
        }
        return item;
      },
    }),
  ],
  prefetch: { prefetchAll: true, defaultStrategy: 'viewport' },
  image: { service: { entrypoint: 'astro/assets/services/sharp' } },
  vite: {
    plugins: [tailwindcss()],
  },
});
