/**
 * Measurement files — the build-time freshness gate.
 *
 * Every product number on a pair page (latency, glossary output, quality tier) comes
 * from `src/data/measurements/{source}-to-{target}.json`, produced by task 01 by running
 * the real pipeline. This module is the enforcement point for docs/seo/AGENTS.md R2:
 * if a referenced measurement file is missing, malformed, or stale, the build FAILS.
 *
 * The 180-day ceiling is not arbitrary. Stale performance data on a public page is worse
 * than no data: it will eventually be wrong, and `/latency/` stakes the site's whole
 * credibility argument on those numbers being real. A hard expiry turns "someone should
 * re-measure" into a broken build, which is the only version of that sentence that gets
 * acted on.
 */
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { z } from 'astro/zod';

/** Measurement files are considered stale past this age. See task 01 §6. */
export const MAX_MEASUREMENT_AGE_DAYS = 180;

/** Resolved against this module so it holds wherever the build is invoked from. */
const MEASUREMENTS_DIR = new URL('../data/measurements/', import.meta.url);

/** Per-tier latency block. p50 AND p95 — an average hides the tail, and in a
 *  conversation the tail is the only part anyone notices. */
const latencyBlock = z.object({
  ttfaP50Ms: z.number().nonnegative(),
  ttfaP95Ms: z.number().nonnegative(),
  completionP50Ms: z.number().nonnegative(),
  sampleSize: z.number().int().positive(),
});

/**
 * The contract task 01's harness must satisfy. Declared here, in task 00, so the
 * harness has a target to hit rather than a shape to invent.
 */
export const measurementSchema = z.object({
  pair: z.string().min(1), // "english-to-german"
  measuredAt: z.string().datetime(),
  engineVersions: z.record(z.string()),
  hardware: z.string().min(1),
  corpusVersion: z.string().min(1),
  latency: z.record(latencyBlock).refine((v) => Object.keys(v).length > 0, {
    message: 'at least one engine tier must be measured',
  }),
  /** A/B/C, assigned by a rule in code — never by hand. See task 01 §4. */
  qualityTier: z.enum(['A', 'B', 'C']),
  glossary: z
    .array(
      z.object({
        term: z.string().min(1),
        translation: z.string().min(1),
        note: z.string().optional(),
      }),
    )
    .min(1),
  notes: z.array(z.string()).default([]),
});

export type Measurement = z.infer<typeof measurementSchema>;

/** Normalise a `measurementRef` to a filename, so entries may omit the extension. */
function refToFilename(ref: string): string {
  return ref.endsWith('.json') ? ref : `${ref}.json`;
}

export function measurementAgeDays(measuredAt: string, now = new Date()): number {
  return (now.getTime() - new Date(measuredAt).getTime()) / 86_400_000;
}

/**
 * Load and validate one measurement file.
 *
 * Throws — deliberately — on missing file, invalid JSON, schema mismatch, or age over
 * {@link MAX_MEASUREMENT_AGE_DAYS}. Called from `getStaticPaths()` on the pair route, so
 * a throw aborts `astro build` rather than shipping a page with a hole in it.
 */
export function loadMeasurement(ref: string, now = new Date()): Measurement {
  const filename = refToFilename(ref);
  const url = new URL(filename, MEASUREMENTS_DIR);

  if (!existsSync(url)) {
    throw new Error(
      `[measurements] "${filename}" does not exist in src/data/measurements/. ` +
        `Pair pages may not ship without measured data (AGENTS.md R2). ` +
        `Run the task 01 harness for this pair, or set publishedAt: null to hold it as an ` +
        `unindexed draft.`,
    );
  }

  let raw: unknown;
  try {
    raw = JSON.parse(readFileSync(url, 'utf-8'));
  } catch (cause) {
    throw new Error(`[measurements] "${filename}" is not valid JSON`, { cause });
  }

  const parsed = measurementSchema.safeParse(raw);
  if (!parsed.success) {
    throw new Error(
      `[measurements] "${filename}" does not match the harness contract:\n` +
        parsed.error.issues
          .map((i) => `  - ${i.path.join('.') || '(root)'}: ${i.message}`)
          .join('\n'),
    );
  }

  const age = measurementAgeDays(parsed.data.measuredAt, now);
  if (age > MAX_MEASUREMENT_AGE_DAYS) {
    throw new Error(
      `[measurements] "${filename}" was measured ${Math.floor(age)} days ago, over the ` +
        `${MAX_MEASUREMENT_AGE_DAYS}-day limit. Re-run the task 01 harness — publishing ` +
        `stale latency figures is worse than publishing none.`,
    );
  }

  return parsed.data;
}

/** Every measurement file currently on disk. Powers `/languages/`. */
export function listMeasurements(now = new Date()): Measurement[] {
  let files: string[];
  try {
    files = readdirSync(MEASUREMENTS_DIR).filter((f) => f.endsWith('.json'));
  } catch {
    return []; // directory not created yet — task 01 has not run
  }
  return files.map((f) => loadMeasurement(f, now)).sort((a, b) => a.pair.localeCompare(b.pair));
}
