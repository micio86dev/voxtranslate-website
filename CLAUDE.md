# CLAUDE.md — VoxTranslate Website

Marketing site & multilingual blog for VoxTranslate. Lives as a git submodule at
`website/` inside the main VoxTranslate repo. Separate deploy pipeline from the app.

## Stack

- **Framework:** Astro 5 (static SSG, `output: 'static'`, `trailingSlash: 'always'`)
- **Styling:** Tailwind CSS v4 via `@tailwindcss/vite` (tokens in `src/styles/global.css` with `@theme`)
- **CMS:** PocketBase (Docker, on Railway) — fetched at build time; bundled fallback posts when offline
- **Animations:** native Web Animations API (no dep) — hero stagger + scroll reveal, gated on `prefers-reduced-motion`
- **i18n:** Astro native i18n routing — 5 locales: `en` (default), `it`, `es`, `de`, `fr`
- **Hosting:** Cloudflare Pages (static) + Cloudflare Pages Functions (geo-redirect)
- **CI/CD:** GitHub Actions (lint + typecheck + build + Lighthouse on PR; deploy on push to `main`)
- **Fonts:** self-hosted woff2 — Sora (display), Hanken Grotesk (body), JetBrains Mono (labels)

Design system: **"Nexus Glass Evolution"** (Google Stitch) — futuristic glassmorphism,
deep navy + electric-blue/violet/cyan accents. Default LIGHT theme + dark toggle.

## Directory structure

```
src/
  components/{layout,home,blog,ui}/   # PascalCase .astro components
  layouts/{BaseLayout,BlogLayout}.astro
  pages/
    index.astro                       # root: soft browser-lang detection
    [lang]/index.astro                # localized home
    [lang]/blog/index.astro           # blog list (client tag filter + pagination)
    [lang]/blog/[slug].astro          # blog post
    404.astro
  lib/{i18n,seo,pocketbase,content,site}.ts
  i18n/{en,it,es,de,fr}.json          # UI strings (en is canonical)
  data/fallback-posts.ts              # bundled seed posts (build-time fallback)
  styles/global.css                   # design tokens + base + utilities
  scripts/animations.ts               # Motion One entry/scroll animations
public/{fonts,og,blog}/ , favicon.svg, robots.txt, _headers, _redirects
functions/_middleware.ts              # Cloudflare Pages geo-redirect
docker/pocketbase/                    # Dockerfile, compose, railway.toml, pb_migrations, pb_hooks
.github/workflows/{ci,deploy}.yml
```

## Conventions

- Files: kebab-case. Components: PascalCase `.astro`. Props typed via `interface Props`.
- All UI strings live in `src/i18n/*.json`; never hardcode copy in components. Use `useTranslations(lang)` → `t('key')` and `tList(lang, 'key')` for arrays.
- URLs are locale-prefixed with a trailing slash: `/en/`, `/it/blog/`, `/de/blog/<slug>/`.
- Commits: Conventional Commits (`feat:`, `fix:`, `perf:`, `chore:`).
- Branches: `main` = production, `develop` = staging.

## Common tasks

**Run locally**
```bash
pnpm install
pnpm dev                 # http://localhost:4321
pnpm build && pnpm preview
pnpm typecheck           # astro check
pnpm lint                # prettier + eslint
```

**Run PocketBase locally**
```bash
docker compose -f docker/pocketbase/docker-compose.yml up --build
# Admin: http://127.0.0.1:8090/_/   Health: http://127.0.0.1:8090/api/health
# Then build the site against it:
POCKETBASE_URL=http://127.0.0.1:8090 pnpm build
```
Migrations in `docker/pocketbase/pb_migrations/` auto-apply on boot (create `posts` +
`categories`, seed 3 EN posts). NOTE: migrations target the PocketBase **0.22.x** JS API
(`Dao`/`schema`). Bumping `PB_VERSION` to ≥0.23 requires porting them to the `app`/`fields` API.

**Add a new language**
1. Add the code to `LOCALES` in `src/lib/i18n.ts` (+ `LOCALE_NAMES`, `LOCALE_FLAGS`, `OG_LOCALES`).
2. Add it to `astro.config.mjs` `i18n.locales` and the `@astrojs/sitemap` locale map.
3. Create `src/i18n/<code>.json` (copy `en.json`, translate values).
4. Add `<code>` to the `lang` select in `docker/pocketbase/pb_migrations/*_create_posts.js`.

**Add a component** — create `src/components/<area>/<Name>.astro` with a typed `interface Props`;
style with Tailwind utilities (token classes like `bg-base`, `text-ink`, `border-line`) or a
scoped `<style>` block using the CSS variables from `global.css`.

**Regenerate icons/OG** — edit `public/favicon.svg` / `public/og/default.svg`, then
`node scripts/gen-icons.mjs`.

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `POCKETBASE_URL` | Build | PocketBase instance URL (Railway). Unset → bundled fallback posts. |
| `CLOUDFLARE_API_TOKEN` | CI only | Cloudflare Pages deploy via wrangler-action. |
| `CLOUDFLARE_ACCOUNT_ID` | CI only | Cloudflare account ID. |
| `DEPLOY_HOOK_URL` | PocketBase env | Optional. Triggers a site rebuild when a post is published. |

Never commit `.env`. Copy `.env.example` and fill in values locally.

## Infrastructure

### Cloudflare
- DNS: marketing site served at `website.voxtranslate.app` (subdomain on Cloudflare). Canonical site origin = `https://website.voxtranslate.app`.
- Pages: deployed via GitHub Actions on push to `main` (`cloudflare/wrangler-action`, project `voxtranslate-website`).
- Geo-redirect: `functions/_middleware.ts` sends `/` to the visitor's language (CF-IPCountry), respecting a `vox-lang` cookie.
- Bot Fight Mode: if ENABLED, whitelist ClaudeBot, GPTBot, PerplexityBot in
  Dashboard → Security → Bots (robots.txt already allows them).
- Cache Rules (set manually in dashboard, mirror `public/_headers`):
  - `/fonts/*` → Cache Everything, TTL 1 year
  - `/_astro/*` → Cache Everything, TTL 1 year
  - `/api/collections/*` → Cache Everything, TTL 5 minutes (PocketBase proxy)
- Recommended toggles: HTTP/3 ON, Early Hints ON, Brotli ON, **Rocket Loader OFF** (breaks Astro scripts).

### PocketBase (Railway)
- Service root directory: `docker/pocketbase`. Attach a Volume mounted at `/pb/pb_data`.
- Expose via a Cloudflare DNS (proxied) record to hide the Railway origin; set `POCKETBASE_URL` to that host.
- Cache GET `/api/collections/posts/records` at the Cloudflare edge (~5 min).

**Shipping a CMS change (migrations, seeds) — the service has NO Git source.** Every
deployment is a directory upload, so a "Redeploy" in the Railway UI republishes the OLD
snapshot and silently ignores a migration you just committed. Nothing errors; the content
simply does not change. The sequence that works:

```bash
cd docker/pocketbase
railway link --project <pocketbase-project-id> --environment production --service voxtranslate-pocketbase   # once per checkout
railway up --detach            # uploads THIS directory; migrations run at boot
# then rebuild the static site so it reads the migrated content:
gh workflow run deploy.yml --ref main
```

- `railway link` is not optional: `railway up --project … --service …` fails with
  "No linked project found" — the flags alone do not bind the directory (CLI 5.30.x).
- If `railway` returns `Unauthorized`, check for a stale `RAILWAY_API_TOKEN` in your
  shell: it takes precedence over the browser session. Prefix with
  `env -u RAILWAY_API_TOKEN`.
- `--detach` avoids the log-stream flake that makes the CLI exit 1 on a healthy deploy.
- Cloudflare can serve the old page for a while after the rebuild. Verify with a
  cache-busting query string before concluding a locale was missed.
- Migrations are content-destructive and their `down` is usually a no-op: back the
  collection up first — `curl "$PB/api/collections/posts/records?perPage=200" -o backup.json`.
