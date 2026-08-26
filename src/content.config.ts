/**
 * Content collections for the SEO programme.
 *
 * Deviation from docs/seo/tasks/00-foundations.md, on purpose: the task sketches the
 * LEGACY collections API (`type: 'data'`, file at `src/content/config.ts`). This project
 * is on Astro 5, where that API is deprecated and collections take an explicit loader,
 * with the config at `src/content.config.ts`. The schemas — which are the actual point of
 * the task — are unchanged and live in `src/content/schemas.ts`, shared verbatim with
 * `scripts/verify-schema-gate.ts` so the gate tests the real thing.
 *
 * Nothing here is populated yet. Task 00 builds the enforcement; tasks 02-05 add entries.
 */
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { pairSchema, comparisonSchema, guideSchema, platformSchema } from './content/schemas';

/** Language-pair pages — structured data, one JSON file per direction. */
const pairs = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/pairs' }),
  schema: pairSchema,
});

/** `/alternatives/`, `/compare/`, `/pricing/` — prose with a verified-claims envelope. */
const comparisons = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/comparisons' }),
  schema: comparisonSchema,
});

/** `/live-translation/for-{platform}/` — the browser layer's integration pages. */
const platforms = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/platforms' }),
  schema: platformSchema,
});

/** `/guides/` — the topical-authority cluster. */
const guides = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/guides' }),
  schema: guideSchema,
});

export const collections = { pairs, comparisons, guides, platforms };
