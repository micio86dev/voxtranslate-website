/**
 * Content schemas for the SEO programme — the quality threshold, as code.
 *
 * These live in a PLAIN module rather than inside `config.ts` on purpose. Astro's
 * `astro:content` is a virtual module that only resolves inside the Astro build, so a
 * schema declared there cannot be exercised by anything else. Keeping the shapes here
 * means `scripts/verify-schema-gate.mjs` asserts against the very same objects the
 * build uses, instead of against a copy that can silently drift out of step.
 *
 * `astro/zod` is Astro's own bundled Zod, re-exported by `astro:content`. Importing it
 * directly keeps this file dependency-free while guaranteeing one Zod instance.
 *
 * The rules these encode are docs/seo/AGENTS.md R2 (no invented product data) and R3
 * (publication threshold). Both are deliberately enforced by a failing build: a `.min()`
 * cannot be talked out of, and a reviewer under deadline can.
 */
import { z } from 'astro/zod';

/**
 * Rollout tier. Tier 1 is the 20 highest-intent corridors (task 04); tiers 2 and 3 are
 * the phased expansion (task 05). The value gates nothing on its own — R4's phased
 * volume is enforced by which entries carry a `publishedAt`.
 */
export const tierSchema = z.union([z.literal(1), z.literal(2), z.literal(3)]);

/**
 * `null` means "written but not live". Entries with a null `publishedAt` are excluded
 * from every sitemap and rendered `noindex`, which is what lets a pair page be committed
 * and reviewed before it is ever exposed to a crawler.
 */
export const publishedAtSchema = z.string().datetime().nullable();

/**
 * A language-pair page.
 *
 * Every `.min()` below is a publication threshold, not a style preference. A pair page
 * whose unique modules are thin is a templated page with a language name substituted in
 * — precisely the shape Google classifies as scaled content abuse. The build refuses it.
 *
 * `measurementRef` is a filename in `src/data/measurements/`, produced by task 01 by
 * running the real product. It is never hand-written: see `assertMeasurementFresh()`.
 */
export const pairSchema = z.object({
  source: z.string().min(2), // "english"
  target: z.string().min(2), // "german"
  sourceCode: z.string().min(2).max(8), // "en"
  targetCode: z.string().min(2).max(8), // "de"

  // --- UNIQUE MODULES — all mandatory (AGENTS.md R2 / R3) --------------------
  // Measured data, produced by task 01. Never hand-written.
  measurementRef: z.string().min(1),

  /** What actually makes this DIRECTION hard: word order, register, compounding. */
  linguisticNote: z.string().min(300),
  /** Who buys this corridor: industries, meeting types, buying context. */
  corridorContext: z.string().min(200),
  useCases: z
    .array(
      z.object({
        title: z.string().min(1),
        body: z.string().min(150),
      }),
    )
    .min(3),
  /** Measured glossary output, not a dictionary dump. */
  glossary: z
    .array(
      z.object({
        term: z.string().min(1),
        translation: z.string().min(1),
        note: z.string().optional(),
      }),
    )
    .min(15),
  faq: z
    .array(
      z.object({
        q: z.string().min(1),
        a: z.string().min(80),
      }),
    )
    .min(5),

  // --- Internal linking ------------------------------------------------------
  // A pair page that links nowhere is an orphan; one that links everywhere is a
  // link farm. 4-6 siblings plus 2 guides is the shape that distributes crawl
  // budget without looking automated.
  relatedPairs: z.array(z.string()).min(4).max(6),
  relatedGuides: z.array(z.string()).min(2),

  tier: tierSchema,
  publishedAt: publishedAtSchema,
});

/**
 * A comparison page: `/alternatives/{brand}/`, `/compare/{a}-vs-{b}/`, `/pricing/{brand}-pricing/`.
 *
 * `primarySources` and `verifiedAt` implement R1: a claim about a competitor's pricing
 * or limits is a legal and reputational exposure, so the page must carry the source it
 * came from and the date someone checked it. `whenNotToChooseUs` implements R5 — the
 * section is mandatory because a comparison where the author always wins convinces
 * nobody, and honesty is the only differentiator available to a new domain.
 */
export const comparisonSchema = z.object({
  kind: z.enum(['alternative', 'versus', 'pricing']),
  competitors: z.array(z.string().min(1)).min(1),
  /** Date the pricing/limits claims were last checked against a primary source. */
  verifiedAt: z.string().datetime(),
  primarySources: z.array(z.string().url()).min(1),
  /** Mandatory, in good faith (R5). */
  whenNotToChooseUs: z.string().min(200),
  publishedAt: publishedAtSchema,
});

/**
 * A how-to guide. `shortAnswer` is capped rather than floored: it is the block that
 * gets lifted into a featured snippet or an AI answer, and past ~300 characters it
 * stops being liftable.
 */
export const guideSchema = z.object({
  title: z.string().min(1),
  cluster: z.enum(['events', 'teams', 'sales', 'platform']),
  shortAnswer: z.string().min(1).max(300),
  relatedPairs: z.array(z.string()).optional(),
  publishedAt: publishedAtSchema,
});

export type Pair = z.infer<typeof pairSchema>;
export type Comparison = z.infer<typeof comparisonSchema>;
export type Guide = z.infer<typeof guideSchema>;
