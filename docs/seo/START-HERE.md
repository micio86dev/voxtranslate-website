# START HERE — VoxTranslate SEO pack

## What this is

An SEO work cycle split into 6 self-contained tasks. Each task can be handed to Claude Code on its own, with no other context.

## One-time install

Copy this folder into the marketing site repo:

```
docs/
  positioning.md          ← permanent context, referenced from AGENTS.md
  seo/
    AGENTS.md             ← cycle rules and phase gates
    tasks/
      00-foundations.md
      01-measurement-harness.md
      02-comparison-pages.md
      03-guides.md
      04-pairs-tier1.md
      05-expansion.md
```

Then add this to the root `AGENTS.md` (or `CLAUDE.md`):

```md
## Marketing context
Before writing any public-facing copy — headlines, meta descriptions, landing page
text, FAQs — read `docs/positioning.md`. It contains positioning, messaging,
verified competitor claims, and objection handling. Never invent competitor claims
or product numbers that are not in that file.
For SEO work, follow `docs/seo/AGENTS.md`.
```

## How to run it

**One task at a time.** The prompt is always the same shape:

```
Read docs/seo/AGENTS.md, then execute docs/seo/tasks/00-foundations.md.
Stop at the exit gate and report back.
```

Swap the task number each round.

## Order and timing

| # | Task | When | Automatable |
|---|---|---|---|
| 00 | Foundations | Right after the migration, once 301s are stable | ✅ fully |
| 01 | Measurement harness | Right after 00 | ✅ fully |
| 02 | Comparison pages | After 01 | ⚠️ auto-draft, human review mandatory |
| 03 | Guides | In parallel with 02 | ✅ almost fully |
| 04 | Tier 1 pairs (20 pages) | Only 8+ weeks after 02/03, gate passed | ✅ fully, if 01 produced the data |
| 05 | Tier 2 and 3 expansion | Only 8-10 weeks after 04, gate passed | ✅ fully |

## The two things not to do

**Do not run task 04 before its gate passes.** The gate exists because publishing dozens of templated pages on a low-authority domain gets classified as scaled content abuse and leads to deindexing. The gate must be checked against real Search Console data, not eyeballed.

**Do not let an agent write the latency figures or the glossaries.** That is task 01's job, and it *measures* them by running the actual product. If an agent writes them, the pages become plausible narrative with no substance — precisely what Google penalises. Task 04 is designed to fail if the data is missing.

## The rationale, in three lines

The first pages that pay off are not the ones targeting big keywords (owned by DeepL, Google and Wordly — unwinnable within 12 months) but high-commercial-intent comparison pages, where the SERPs are held by aggregators and content farms that *are* beatable. Language pair pages are the structural asset, but they only work if they contain data that exists nowhere else. The order is: foundations → measure → commercial intent → topical authority → scale.
