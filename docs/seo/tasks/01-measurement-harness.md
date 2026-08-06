# Task 01 — Measurement harness

**Entry gate:** task 00 closed.
**Goal:** produce, by measurement, the data that makes pair pages legitimately unique. Nothing here is written by hand or by a model.

---

## Why this task exists

Every competitor's language pair page says roughly the same thing in slightly different words. Wordly links only 5 pairs; JotMe covers 8. DeepL's pair pages are pure templates — they rank on domain authority alone, which VoxTranslate does not have. Copying that template on a new domain produces doorway pages.

The way out is not better writing, it is **data nobody else has**. VoxTranslate can measure real latency and real translation output per language pair, because it owns the pipeline. That turns a template into an instrument.

This task builds the instrument.

## 1. Test corpus

Create `src/data/corpus/business-phrases.json`: 40-60 sentences representative of real B2B calls, in English, tagged by category.

Categories to cover: supplier negotiation, sales discovery, technical support, recruiting interview, project status, contract terms, scheduling, small talk / turn-taking.

Sentences must include the hard cases, because those are what produce the interesting numbers:
- long sentences with a subordinate clause (stresses buffering on verb-final target languages)
- numbers, dates, currencies
- proper nouns and product names
- interruption / overlap markers
- a polite request and a direct refusal (register handling)

Also create `src/data/corpus/business-terms.json`: 25-40 business terms per domain (purchase order, lead time, invoice, escrow, milestone, warranty, NDA, headcount, onboarding, SLA...). These feed the per-pair glossaries.

## 2. The harness

Build `scripts/measure-pairs.ts` that, for each language pair and each engine tier:

1. Runs the corpus through the live pipeline
2. Records, per sentence: time to first audio output, total completion time, and the produced translation
3. Runs the term list and records the translation the engine actually produces
4. Aggregates and writes JSON

Output shape, one file per pair at `src/data/measurements/{source}-to-{target}.json`:

```json
{
  "pair": "english-to-german",
  "measuredAt": "2026-09-14T09:12:00Z",
  "engineVersions": { "standard": "...", "realtime": "..." },
  "hardware": "…",
  "corpusVersion": "business-phrases@1",
  "latency": {
    "standard": { "ttfaP50Ms": 0, "ttfaP95Ms": 0, "completionP50Ms": 0, "sampleSize": 0 },
    "realtime": { "ttfaP50Ms": 0, "ttfaP95Ms": 0, "completionP50Ms": 0, "sampleSize": 0 }
  },
  "qualityTier": "A",
  "glossary": [
    { "term": "purchase order", "translation": "…", "note": "" }
  ],
  "notes": []
}
```

Report **p50 and p95**, not averages. An average latency hides the tail, and the tail is what users actually notice in a conversation.

## 3. Which pairs to measure

The 20 Tier 1 pairs, both directions. Each pair is directional — `english to japanese` and `japanese to english` are different measurements and different pages.

```
EN↔ES · EN↔JA · EN↔ZH · EN↔DE · EN↔FR · EN↔PT-BR · EN↔KO · EN↔IT · EN↔NL · EN↔AR
```

If capacity allows, also run Tier 2 and 3 — the data does not expire quickly and task 05 will need it. But Tier 1 is the gate.

## 4. Quality tiering

Assign each pair an A/B/C tier from the measurements, using a rule written down in code, not judgment:

- **A** — p95 time-to-first-audio under the realtime target, glossary output correct on ≥90% of terms
- **B** — meets one of the two
- **C** — meets neither

Publish the tiers on `/languages/`. This is counterintuitive but important: **publicly admitting that some pairs are B or C makes the A claims credible.** Every competitor inflates their language count (JotMe claims 200+, Camb.ai 150+, none of them document quality). A documented matrix beats a bigger undocumented number with any serious buyer.

## 5. Fill the two asset pages

**`/latency/`** — write the methodology from the harness: corpus, sample size, hardware, engine versions, measurement date, definition of time-to-first-audio. Link every pair page's latency figure back here.

This page directly answers a real buyer behaviour: `interprefy speed test` appears in Google autocomplete, which means buyers try to verify latency claims and do not trust vendors. Nobody in this market publishes a methodology. Being first is cheap and durable.

**`/languages/`** — render the full matrix from the measurement files, with tier, pair, and last-measured date.

## 6. Keep it fresh

Add a scheduled job (GitHub Action, weekly or monthly) that re-runs the harness and opens a PR when numbers move by more than a set threshold. Stale performance data on a public page is worse than none: it will eventually be wrong, and the whole credibility argument collapses with it.

The build check from task 00 fails if any measurement file is older than 180 days.

---

## Exit gate

- [ ] Corpus files committed
- [ ] Harness runs end to end and is documented in the README
- [ ] Measurement JSON present for all 20 Tier 1 pairs, with timestamps
- [ ] Quality tiers assigned by rule, not by hand
- [ ] `/latency/` published with real methodology
- [ ] `/languages/` rendering the live matrix
- [ ] Refresh job scheduled

Write the report to `docs/seo/reports/01-{date}.md`, then stop.
