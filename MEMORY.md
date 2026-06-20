# Memory Index — VoxTranslate Website

Project-specific notes for the marketing site submodule.

- Design source of truth: Google Stitch project `3085950735218957737` ("Nexus Glass Evolution") — dark-native glassmorphism; light palette is derived locally.
- Canonical domain: `https://voxtranslate.com` (Cloudflare Pages). The app stays at `voxtranslate.app` (linked from nav/CTAs via `src/lib/site.ts`).
- Blog content: PocketBase (Railway) fetched at build time; `src/data/fallback-posts.ts` is the offline fallback so `pnpm build` always works.
- i18n scope: 5 locales here (en/it/es/de/fr) — distinct from the app's 84 locales.
- PocketBase migrations target the 0.22.x JS API (Dao/schema) — see CLAUDE.md before bumping.
