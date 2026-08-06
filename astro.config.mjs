// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// Canonical origin for SEO — powers Astro.site so layouts emit absolute
// canonical / Open Graph / hreflang / sitemap URLs. The marketing site owns the
// APEX: all content authority accrues to voxtranslate.app, and the call app moved
// to app.voxtranslate.app. website.voxtranslate.app 301s here permanently — the
// blog URLs are the ones carrying backlinks.
// `import.meta.env` does not exist in the Astro config, so this reads process.env
// directly. Same variable as src/lib/site.ts SITE_ORIGIN — keep them in step.
const SITE = (process.env.PUBLIC_SITE_ORIGIN || 'https://voxtranslate.app').replace(/\/$/, '');

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
  // No sitemap integration. `@astrojs/sitemap` emits one chunked set under a single
  // base name, and the SEO programme (docs/seo/tasks/00-foundations.md §4) needs four
  // separately named sitemaps behind an index so Search Console reports indexing PER
  // CONTENT FAMILY — which is the signal the task 04/05 phase gates are read from.
  // They are generated as endpoints instead: src/pages/sitemap-*.xml.ts, sharing the
  // hreflang builder in src/lib/seo.ts so page and sitemap alternates cannot disagree.
  integrations: [],
  prefetch: { prefetchAll: true, defaultStrategy: 'viewport' },
  image: { service: { entrypoint: 'astro/assets/services/sharp' } },
  vite: {
    // `astro check` sees two copies of Vite's types and rejects the plugin on nominal
    // identity alone: `@tailwindcss/vite` resolves the hoisted `node_modules/vite`
    // (8.x) while Astro 5 bundles its own `astro/node_modules/vite` (6.4.3). The two
    // `Plugin` interfaces are structurally the same apart from the `this` type on
    // `hotUpdate`, which nothing here calls — the build itself is clean.
    //
    // The durable fix is to pin one Vite so both resolve the same package. That needs a
    // regenerated lockfile, so it is deliberately NOT done here: pnpm-lock.yaml already
    // contains only vite@6.4.3, and shipping a package.json that disagrees with it would
    // turn a type-check complaint into a hard `--frozen-lockfile` failure in CI.
    // See docs/runbooks/120-domain-and-listings.md §4.
    // Cast is `any` on purpose: naming either side's type re-imports one of the two
    // conflicting copies and reintroduces the mismatch.
    plugins: [/** @type {any} */ (tailwindcss())],
  },
});
