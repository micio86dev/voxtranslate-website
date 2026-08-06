/**
 * The schema gate, proven.
 *
 * Task 00's exit gate requires the Zod schemas to be "demonstrably failing the build on a
 * deliberately incomplete fixture". This script is that demonstration, and it runs in CI
 * on every PR — so the guarantee is continuously re-proved rather than checked once by
 * hand and assumed forever after.
 *
 * It asserts BOTH directions. A schema that rejects incomplete fixtures but also rejects
 * valid ones would pass a rejection-only test while blocking every real page, so each
 * collection is checked against a complete fixture too.
 *
 * Run:  node --experimental-strip-types scripts/verify-schema-gate.ts
 *       (the flag is a no-op on Node 24+, required on Node 22.6-22.17)
 */
import type { ZodTypeAny } from 'astro/zod';
import { pairSchema, comparisonSchema, guideSchema } from '../src/content/schemas.ts';
import {
  measurementSchema,
  measurementAgeDays,
  loadMeasurement,
  MAX_MEASUREMENT_AGE_DAYS,
} from '../src/lib/measurements.ts';

let passed = 0;
const failures: string[] = [];

function check(label: string, condition: boolean): void {
  if (condition) {
    passed += 1;
  } else {
    failures.push(label);
  }
}

/** The schema must ACCEPT this input. */
function accepts(schema: ZodTypeAny, label: string, input: unknown): void {
  const result = schema.safeParse(input);
  check(
    `ACCEPT ${label}` +
      (result.success
        ? ''
        : ` — rejected with: ${result.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ')}`),
    result.success,
  );
}

/** The schema must REJECT this input. This is the gate. */
function rejects(schema: ZodTypeAny, label: string, input: unknown): void {
  check(`REJECT ${label}`, !schema.safeParse(input).success);
}

function throws(label: string, fn: () => unknown): void {
  try {
    fn();
    check(`THROW ${label}`, false);
  } catch {
    check(`THROW ${label}`, true);
  }
}

const text = (n: number) => 'x'.repeat(n);
const iso = (d: Date) => d.toISOString();
const NOW = new Date('2026-08-06T00:00:00.000Z');

/* -- pairs ---------------------------------------------------------------- */

const validPair = {
  source: 'english',
  target: 'german',
  sourceCode: 'en',
  targetCode: 'de',
  measurementRef: 'english-to-german.json',
  linguisticNote: text(300),
  corridorContext: text(200),
  useCases: [1, 2, 3].map((n) => ({ title: `Use case ${n}`, body: text(150) })),
  glossary: Array.from({ length: 15 }, (_, i) => ({ term: `t${i}`, translation: `u${i}` })),
  faq: Array.from({ length: 5 }, (_, i) => ({ q: `q${i}`, a: text(80) })),
  relatedPairs: ['a', 'b', 'c', 'd'],
  relatedGuides: ['g1', 'g2'],
  tier: 1,
  publishedAt: null,
};

accepts(pairSchema, 'a complete pair', validPair);
accepts(pairSchema, 'a published pair', { ...validPair, publishedAt: iso(NOW) });

rejects(pairSchema, 'pair with no measurementRef', { ...validPair, measurementRef: undefined });
rejects(pairSchema, 'pair with an empty measurementRef', { ...validPair, measurementRef: '' });
rejects(pairSchema, 'pair with a 299-char linguisticNote', {
  ...validPair,
  linguisticNote: text(299),
});
rejects(pairSchema, 'pair with a 199-char corridorContext', {
  ...validPair,
  corridorContext: text(199),
});
rejects(pairSchema, 'pair with only 2 use cases', {
  ...validPair,
  useCases: validPair.useCases.slice(0, 2),
});
rejects(pairSchema, 'pair with a thin use-case body', {
  ...validPair,
  useCases: [{ title: 'Thin', body: text(149) }, ...validPair.useCases.slice(1)],
});
rejects(pairSchema, 'pair with a 14-term glossary', {
  ...validPair,
  glossary: validPair.glossary.slice(0, 14),
});
rejects(pairSchema, 'pair with 4 FAQs', { ...validPair, faq: validPair.faq.slice(0, 4) });
rejects(pairSchema, 'pair with a 79-char FAQ answer', {
  ...validPair,
  faq: [{ q: 'q', a: text(79) }, ...validPair.faq.slice(1)],
});
rejects(pairSchema, 'pair with 3 related pairs', { ...validPair, relatedPairs: ['a', 'b', 'c'] });
rejects(pairSchema, 'pair with 7 related pairs (link farm)', {
  ...validPair,
  relatedPairs: ['a', 'b', 'c', 'd', 'e', 'f', 'g'],
});
rejects(pairSchema, 'pair with 1 related guide', { ...validPair, relatedGuides: ['g1'] });
rejects(pairSchema, 'pair with an out-of-range tier', { ...validPair, tier: 4 });
rejects(pairSchema, 'pair with a non-ISO publishedAt', { ...validPair, publishedAt: '2026-08-06' });

/* -- comparisons ---------------------------------------------------------- */

const validComparison = {
  kind: 'alternative',
  competitors: ['Wordly'],
  verifiedAt: iso(NOW),
  primarySources: ['https://www.wordly.ai/pricing'],
  whenNotToChooseUs: text(200),
  publishedAt: null,
};

accepts(comparisonSchema, 'a complete comparison', validComparison);

rejects(comparisonSchema, 'comparison with no primary source (R1)', {
  ...validComparison,
  primarySources: [],
});
rejects(comparisonSchema, 'comparison with a non-URL source', {
  ...validComparison,
  primarySources: ['wordly pricing page'],
});
rejects(comparisonSchema, 'comparison with no verifiedAt date (R1)', {
  ...validComparison,
  verifiedAt: undefined,
});
rejects(comparisonSchema, 'comparison with no "when not to choose us" (R5)', {
  ...validComparison,
  whenNotToChooseUs: undefined,
});
rejects(comparisonSchema, 'comparison with a token "when not to choose us" (R5)', {
  ...validComparison,
  whenNotToChooseUs: 'Sometimes we are not the best fit.',
});
rejects(comparisonSchema, 'comparison with no competitor', { ...validComparison, competitors: [] });
rejects(comparisonSchema, 'comparison with an unknown kind', {
  ...validComparison,
  kind: 'roundup',
});

/* -- guides --------------------------------------------------------------- */

const validGuide = {
  title: 'How to run a bilingual all-hands',
  cluster: 'teams',
  shortAnswer: text(280),
  publishedAt: null,
};

accepts(guideSchema, 'a complete guide', validGuide);
rejects(guideSchema, 'guide with a 301-char shortAnswer (unliftable)', {
  ...validGuide,
  shortAnswer: text(301),
});
rejects(guideSchema, 'guide with an unknown cluster', { ...validGuide, cluster: 'misc' });

/* -- measurements --------------------------------------------------------- */

const validMeasurement = {
  pair: 'english-to-german',
  measuredAt: iso(NOW),
  engineVersions: { standard: 'qwen3-livetranslate-flash-realtime' },
  hardware: 'Railway 8vCPU / eu-west',
  corpusVersion: 'business-phrases@1',
  latency: {
    standard: { ttfaP50Ms: 780, ttfaP95Ms: 1420, completionP50Ms: 2100, sampleSize: 48 },
  },
  qualityTier: 'A',
  glossary: [{ term: 'purchase order', translation: 'Bestellung' }],
  notes: [],
};

accepts(measurementSchema, 'a complete measurement', validMeasurement);
rejects(measurementSchema, 'measurement with no p95 (average hides the tail)', {
  ...validMeasurement,
  latency: { standard: { ttfaP50Ms: 780, completionP50Ms: 2100, sampleSize: 48 } },
});
rejects(measurementSchema, 'measurement with a zero sample size', {
  ...validMeasurement,
  latency: { standard: { ...validMeasurement.latency.standard, sampleSize: 0 } },
});
rejects(measurementSchema, 'measurement with no engine tier measured', {
  ...validMeasurement,
  latency: {},
});
rejects(measurementSchema, 'measurement with an invented quality tier', {
  ...validMeasurement,
  qualityTier: 'S',
});
rejects(measurementSchema, 'measurement with no timestamp', {
  ...validMeasurement,
  measuredAt: undefined,
});

// Freshness arithmetic, then the two ways a build is meant to die.
const stale = new Date(NOW.getTime() - (MAX_MEASUREMENT_AGE_DAYS + 1) * 86_400_000);
check(
  'measurementAgeDays computes a 181-day gap',
  Math.round(measurementAgeDays(iso(stale), NOW)) === MAX_MEASUREMENT_AGE_DAYS + 1,
);
check(
  'a same-day measurement is not stale',
  measurementAgeDays(iso(NOW), NOW) <= MAX_MEASUREMENT_AGE_DAYS,
);
throws('loadMeasurement on a missing file (R2)', () => loadMeasurement('no-such-pair', NOW));

/* -- report --------------------------------------------------------------- */

if (failures.length > 0) {
  console.error(
    `\n✗ schema gate: ${failures.length} of ${passed + failures.length} assertions failed\n`,
  );
  for (const f of failures) console.error(`  ${f}`);
  console.error(
    '\nThe schemas are the publication threshold (AGENTS.md R2/R3). A failure here means\n' +
      'thin or unmeasured content could reach the sitemap. Fix the schema, not the test.\n',
  );
  process.exit(1);
}

console.log(`✓ schema gate: ${passed} assertions passed — thin and unmeasured content is rejected`);
