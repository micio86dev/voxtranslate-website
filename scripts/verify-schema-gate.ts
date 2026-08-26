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
import { readFileSync, readdirSync } from 'node:fs';
import type { ZodTypeAny } from 'astro/zod';
import {
  pairSchema,
  comparisonSchema,
  guideSchema,
  platformSchema,
} from '../src/content/schemas.ts';
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

/** A fixture minus one required field — the shape a half-written page actually has. */
function omit<T extends object, K extends keyof T>(obj: T, key: K): Omit<T, K> {
  const copy = { ...obj };
  delete copy[key];
  return copy;
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

/* -- reveal animations ----------------------------------------------------- */

/**
 * A page that uses `data-reveal` MUST load the animations script.
 *
 * global.css hides `[data-reveal]` behind `:where(html.js:not(.reduce-motion))`, and
 * BaseLayout adds `html.js` on every page — so the hiding always applies and only the
 * animations script ever undoes it. A page with reveal markup and no script renders a
 * complete, valid, correctly-structured, entirely INVISIBLE document.
 *
 * That happened to /{lang}/pricing/ and went unnoticed for three weeks: 200 OK, full
 * HTML, valid FAQ schema, Lighthouse SEO 1.0. Every automated signal was green because
 * every automated signal reads the DOM, and the DOM was fine. Only a human eye — or
 * this check — sees the difference between "present" and "visible".
 */
{
  const pagesDir = new URL('../src/pages/', import.meta.url);
  const offenders: string[] = [];
  const walk = (dir: URL): void => {
    for (const name of readdirSync(dir, { withFileTypes: true })) {
      const child = new URL(name.name + (name.isDirectory() ? '/' : ''), dir);
      if (name.isDirectory()) walk(child);
      else if (name.name.endsWith('.astro')) {
        const src = readFileSync(child, 'utf-8');
        if (src.includes('data-reveal') && !src.includes('scripts/animations')) {
          offenders.push(name.name);
        }
      }
    }
  };
  walk(pagesDir);
  check(
    `NO page uses data-reveal without the animations script${offenders.length ? ` — offenders: ${offenders.join(', ')}` : ''}`,
    offenders.length === 0,
  );
}

/* -- platforms ------------------------------------------------------------ */

const validPlatform = {
  name: 'Zoom Web',
  surface: 'meeting',
  shortAnswer: text(280),
  howItWorks: text(220),
  limitations: text(180),
  relatedGuides: [
    'translate-a-zoom-meeting-in-real-time',
    'can-zoom-translate-a-meeting-in-real-time',
  ],
  publishedAt: null,
};

accepts(platformSchema, 'a complete platform page', validPlatform);
rejects(platformSchema, 'platform with a 301-char shortAnswer (unliftable)', {
  ...validPlatform,
  shortAnswer: text(301),
});
// The three that make this page more than a template with a name substituted in.
rejects(platformSchema, 'platform with a thin howItWorks', {
  ...validPlatform,
  howItWorks: text(199),
});
rejects(
  platformSchema,
  'platform with NO limitations section (R5)',
  omit(validPlatform, 'limitations'),
);
rejects(platformSchema, 'platform with a token limitations section', {
  ...validPlatform,
  limitations: text(149),
});
rejects(platformSchema, 'platform linking fewer than 2 guides (orphan)', {
  ...validPlatform,
  relatedGuides: ['translate-a-zoom-meeting-in-real-time'],
});
rejects(platformSchema, 'platform with an unknown surface', {
  ...validPlatform,
  surface: 'radio',
});

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

/* -- corpus --------------------------------------------------------------- */

// The corpus is the fixed reference every latency figure is measured against. If it
// silently degrades — a category quietly dropped, the hard cases edited out because they
// were awkward — the numbers keep being produced and stop meaning what the methodology
// page says they mean. That failure is invisible in the output, so it is checked here.

const phrasesDoc = JSON.parse(
  readFileSync(new URL('../src/data/corpus/business-phrases.json', import.meta.url), 'utf-8'),
);
const termsDoc = JSON.parse(
  readFileSync(new URL('../src/data/corpus/business-terms.json', import.meta.url), 'utf-8'),
);

const phrases = phrasesDoc.phrases as Array<{ id: string; category: string; traits: string[] }>;

check(
  `corpus holds 40-60 phrases (has ${phrases.length})`,
  phrases.length >= 40 && phrases.length <= 60,
);
check(
  'corpus is versioned',
  typeof phrasesDoc.version === 'string' && phrasesDoc.version.length > 0,
);
check('phrase ids are unique', new Set(phrases.map((p) => p.id)).size === phrases.length);

// Task 01 §1 names these eight explicitly.
const REQUIRED_CATEGORIES = [
  'supplier-negotiation',
  'sales-discovery',
  'technical-support',
  'recruiting-interview',
  'project-status',
  'contract-terms',
  'scheduling',
  'small-talk',
];
const presentCategories = new Set(phrases.map((p) => p.category));
for (const c of REQUIRED_CATEGORIES) {
  check(`corpus covers category "${c}"`, presentCategories.has(c));
}
check(
  'corpus has no category outside the declared eight',
  [...presentCategories].every((c) => REQUIRED_CATEGORIES.includes(c)),
);

// The hard cases. These are the reason the corpus produces an interesting p95 rather than
// a flattering mean, so each must survive editing.
const REQUIRED_TRAITS = ['subordinate', 'numeric', 'propernoun', 'overlap', 'register'];
for (const t of REQUIRED_TRAITS) {
  const n = phrases.filter((p) => p.traits.includes(t)).length;
  check(`corpus keeps at least 4 "${t}" phrases (has ${n})`, n >= 4);
}
check(
  'every declared trait is documented',
  REQUIRED_TRAITS.every((t) => typeof phrasesDoc.traits?.[t] === 'string'),
);
check(
  'no phrase claims an undocumented trait',
  phrases.every((p) => p.traits.every((t) => REQUIRED_TRAITS.includes(t))),
);

const terms = Object.values(termsDoc.domains as Record<string, Array<{ term: string }>>).flat();
check(`term list holds at least 25 terms (has ${terms.length})`, terms.length >= 25);
check('term list is versioned', typeof termsDoc.version === 'string');
check('terms are unique across domains', new Set(terms.map((t) => t.term)).size === terms.length);
// Pair pages require a glossary of 15+ (pairSchema), so the pool must comfortably exceed it.
check('term pool exceeds the pair-page glossary minimum', terms.length > 15);

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
