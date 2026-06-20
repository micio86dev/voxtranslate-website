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
      i18n: {
        defaultLocale: 'en',
        locales: {
          en: 'en-US',
          it: 'it-IT',
          es: 'es-ES',
          de: 'de-DE',
          fr: 'fr-FR',
        },
      },
    }),
  ],
  prefetch: { prefetchAll: true, defaultStrategy: 'viewport' },
  image: { service: { entrypoint: 'astro/assets/services/sharp' } },
  vite: {
    plugins: [tailwindcss()],
  },
});
