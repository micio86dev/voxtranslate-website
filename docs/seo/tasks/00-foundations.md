# Task 00 — Foundations

**Entry gate:** migration to the apex domain complete, 301s stable, no redirect chains.
**Goal:** build the scaffolding that makes every later task safe. No public content is written in this task.

---

## 1. Post-migration audit

Before building anything, verify and fix:

- Every legacy URL 301-redirects to its new location, **in one hop**. No chains, no loops.
- All canonicals point at the apex. Nothing still references the old domain or the app subdomain.
- `app.voxtranslate.app` is excluded from indexing (`X-Robots-Tag: noindex` at the edge is more reliable than robots.txt, which does not prevent indexing of linked URLs).
- `robots.txt` on the apex allows crawling and points at the sitemap index.
- hreflang: none yet. Do not add any until localisation actually exists.

Output the audit result as a table in the task report: URL before, URL after, status code, hops.

## 2. Content collections

Create Astro content collections with Zod schemas that **enforce the quality threshold at build time**. This is the core of the whole pack: the schema is what prevents thin pages, not discipline.

```ts
// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const pairs = defineCollection({
  type: 'data',
  schema: z.object({
    source: z.string(),               // "english"
    target: z.string(),               // "german"
    sourceCode: z.string(),           // "en"
    targetCode: z.string(),           // "de"

    // UNIQUE MODULES — all mandatory. See docs/seo/AGENTS.md rule R2/R3.
    // These come from src/data/measurements/, produced by task 01.
    // Never hand-write them.
    measurementRef: z.string(),       // filename in src/data/measurements/

    linguisticNote: z.string().min(300),   // real difficulty of this direction
    corridorContext: z.string().min(200),  // industries, meeting types, who buys
    useCases: z.array(z.object({
      title: z.string(),
      body: z.string().min(150),
    })).min(3),
    glossary: z.array(z.object({
      term: z.string(),
      translation: z.string(),
      note: z.string().optional(),
    })).min(15),
    faq: z.array(z.object({
      q: z.string(),
      a: z.string().min(80),
    })).min(5),

    relatedPairs: z.array(z.string()).min(4).max(6),
    relatedGuides: z.array(z.string()).min(2),
    tier: z.union([z.literal(1), z.literal(2), z.literal(3)]),
    publishedAt: z.string().datetime().nullable(),  // null = not live yet
  }),
});

const comparisons = defineCollection({
  type: 'content',
  schema: z.object({
    kind: z.enum(['alternative', 'versus', 'pricing']),
    competitors: z.array(z.string()).min(1),
    verifiedAt: z.string().datetime(),        // pricing verification date
    primarySources: z.array(z.string().url()).min(1),
    whenNotToChooseUs: z.string().min(200),   // mandatory, rule R5
    publishedAt: z.string().datetime().nullable(),
  }),
});

const guides = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    cluster: z.enum(['events', 'teams', 'sales', 'platform']),
    shortAnswer: z.string().max(300),   // for featured snippets and AI answers
    relatedPairs: z.array(z.string()).optional(),
    publishedAt: z.string().datetime().nullable(),
  }),
});

export const collections = { pairs, comparisons, guides };
```

Add a build-time check that fails if a `pairs` entry references a `measurementRef` file that does not exist or whose timestamp is older than 180 days.

## 3. Page routes and templates

Create the routes from the URL architecture in `AGENTS.md`. Templates only — no content yet.

Include on every template:
- `BreadcrumbList` schema
- Canonical, OG tags, Twitter card
- `FAQPage` schema where FAQs exist
- `SoftwareApplication` schema on product pages

## 4. Segmented sitemaps

Do **not** use one flat sitemap. Generate a sitemap index pointing to:

```
sitemap-pages.xml
sitemap-pairs.xml
sitemap-guides.xml
sitemap-compare.xml
```

Reason: Search Console reports indexing per sitemap. Segmenting is the only way to tell which content group is being indexed and which is being ignored — which is exactly what the task 04 and 05 gates depend on.

Entries with `publishedAt: null` must be excluded from sitemaps and rendered with `noindex`.

## 5. The two static asset pages

**`/languages/`** — the public language matrix. Structure it as a table of pairs with a declared quality tier (A/B/C). Leave it data-driven: it reads from the same measurement JSON as the pair pages, so it stays honest automatically. For now, build the page and wire it up; it will be empty until task 01 runs.

**`/latency/`** — the measurement methodology page. Explains how latency is measured, on what hardware, with what test corpus, and when. This page is what makes every latency figure on the site credible instead of marketing noise. Build the template; task 01 fills it.

## 6. Performance guardrails

- Add Lighthouse CI to the pipeline with a mobile budget: performance ≥ 90, no regression on LCP or CLS.
- Any interactive widget must be lazy, behind user interaction, never on load.

---

## Exit gate

- [ ] Build green
- [ ] Redirect audit table in the report, zero chains
- [ ] `app.` subdomain returns `noindex`
- [ ] Zod schemas in place and demonstrably failing the build on a deliberately incomplete fixture
- [ ] Sitemap index with 4 segmented sitemaps
- [ ] `/languages/` and `/latency/` routes exist and render
- [ ] Lighthouse CI wired, mobile ≥ 90

Write the report to `docs/seo/reports/00-{date}.md`, then stop.
