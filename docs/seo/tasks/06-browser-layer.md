# Task 06 — The browser layer

**Entry gate:** tasks 02 and 03 closed (11 comparisons + 35 guides live since 2026-08-07). Does
**not** depend on task 01 or 04 — nothing here publishes a measured number.
**Goal:** make the second product visible, and stop overstating the first.

---

## Why this exists

VoxTranslate ships two products. The site sells one.

The Chrome extension has been live in the Web Store since 2026-08 and translates the audio of any
Chrome tab into subtitles plus spoken translation. It appears **nowhere** on `voxtranslate.app` —
`rg 'chrome extension'` over `src/`, `public/` and `docs/` returns nothing. Every acquisition path
to it today is someone already searching the Web Store for it.

That matters more than a missing feature callout, because the extension changes what the company
*is*. The calls product asks a buyer to move a meeting. The extension asks them to move nothing at
all: it works on the tab they already have open, which covers Google Meet Web, Zoom Web, YouTube,
Twitch, a course player, a podcast. The positioning that follows — *don't change your platform,
change the language* — is not a slogan bolted onto the existing one. It is the honest description
of a product that already shipped.

Second, `docs/marketing/directory-listings.md:17-18` has been carrying this since 2026-08-05:

> Per-tier language counts, never a blanket "84". Standard 29 · Enhanced 61 · Premium 84. Only
> Premium covers 84. **The homepage headline currently overstates this.**

Three weeks, still live. A page that oversells its language coverage undermines every other number
on the site, including the ones that are right — and this site's entire strategic argument, per
AGENTS.md R5, is that it tells the truth when competitors don't. Fixing it is not housekeeping.

## 1. Rule compliance, stated up front

**R2 (no invented product data).** Nothing in this task publishes a latency figure, and nothing
depends on `src/data/measurements/`. Every product number traces to the live `/api/engines`
catalogue committed at `src/data/engines.json`, or to `server/src/` with a file:line in the report.

**R4 (phased volume).** Five new pages: one localized product page and four platform pages. The
four fill `PLATFORMS`, a registry that has been declared and empty since task 00 — this is the
route architecture executing as designed, not an expansion of it. No new blog posts, no new
guides. The remaining topics wait out the observation window.

**R6 (no head terms).** The platform pages target integration intent — *"translate Google Meet Web
in your browser"* — not `google meet translate`. The distinction is already written into the header
of `src/pages/live-translation/for-[platform].astro`. Each slug carries the `-web` qualifier where
the product only works on the web client, because saying "Google Meet" when we mean the browser
tab would be the same class of error as the 84.

**R5 (honesty).** `platformSchema` makes a `limitations` field mandatory, mirroring
`comparisonSchema.whenNotToChooseUs`. A platform page that only lists what works is an advert.

**R7 (performance).** `/en/chrome/` and one platform page get added to the Lighthouse matrix.

## 2. What gets built

### The accuracy pass — ships first, alone

Every unconditional "84" becomes a qualified one, in all five locales. The per-tier split
(29 / 61 / 84) already renders in `Tiers.astro` from `src/data/engines.json`; the headline stat and
`llms.txt` need to stop contradicting it.

### `/{lang}/chrome/` — the extension's product page

Localized like `/{lang}/pricing/` and `/{lang}/business/`, so it inherits canonical, hreflang and
OG from `BaseLayout` rather than growing its own. What it must say, and nothing beyond it:

- It captures **the audio of one tab**, the one you pressed the button on. Never the microphone,
  never another tab, never a background tab (`PRIVACY.md:15-20`).
- Output is live subtitles, and spoken translation on the tiers that produce audio.
- The original audio has a 0–100% volume control and ducks under the translated voice
  (`src/offscreen/pipeline.ts:99,495-505`).
- It works on **any tab with sound** — there is no site allowlist and no per-site adapter. Google
  Meet Web, Zoom Web, YouTube, YouTube Live, Twitch, course players, podcasts are examples, not a
  support boundary.
- **Chrome only** (`README.md:124-125`). Not Firefox, Safari or Edge. Not the Meet or Zoom desktop
  apps.
- The subtitle overlay cannot be injected on `chrome://` pages or the Web Store itself; audio
  translation still runs (`src/background/index.ts:469`).
- Same account, same balance as the web app. Billed per minute of speech.

### `/live-translation/for-{platform}/` × 4

`google-meet-web`, `zoom-web`, `youtube`, `twitch`. Each answers one question in ≤300 characters,
then explains the setup, then states its limitations honestly — including, where true, that the
platform's own native feature may be enough.

### The link graph

`/guides/` does not exist. 35 guides ship, 15 are linked from persona pages, ~20 are reachable only
through `sitemap-guides.xml`. A hub page fixes both in one file.

`/contact` 404s, and it is the support URL printed in the extension's privacy notice and its Web
Store data disclosure.

## 3. Exit gate

- [ ] No unconditional "84 languages" anywhere in `src/`, including `llms.txt`
- [ ] `/{lang}/chrome/` live in all five locales, hreflang complete
- [ ] `PLATFORMS` non-empty; four platform pages in `sitemap-pages.xml`
- [ ] `/guides/` returns 200 and links all published guides
- [ ] `/contact` resolves
- [ ] Web Store CTA reachable from the home page in one click
- [ ] Footer social links present, labelled, `rel="noopener noreferrer"`
- [ ] `pnpm verify:schemas` covers `platformSchema`
- [ ] Lighthouse ≥ 0.90 mobile on the new pages, accessibility ≥ 0.90, SEO ≥ 0.95
- [ ] No latency figure published

## 4. What this task must not do

Do not write the remaining brief topics as blog posts (Twitch billing, voice vs captions, privacy
and transcripts). They are real gaps, but R4's observation window applies to this batch first, and
several are better served by extending an existing guide than by a new URL.

Do not touch `/latency/` or `/languages/`. They are correctly `noindex` and correctly empty until
task 01 runs.

Do not restate the Business/Enterprise prices until the Stripe currency question in
`docs/marketing/directory-listings.md:20-22` is closed.
