# AGENTS.md — SEO cycle for voxtranslate.app

Rules that apply to every task in `docs/seo/tasks/`. Read this file before executing any task.

---

## 1. Minimum context

- Marketing site: `voxtranslate.app` (apex). App: `app.voxtranslate.app`, excluded from indexing.
- Stack: Astro 5. Mobile PageSpeed is at 95+ and **must not regress**.
- The domain is new: near-zero authority, near-zero traffic.
- Positioning, verified competitor claims and messaging live in `docs/positioning.md`. **Read it before writing any public-facing text.**

## 2. Rules that are never broken

**R1 — No invented claims.** Any statement about a competitor (pricing, language count, technical limits) must come from `docs/positioning.md` or from a primary source you link on the page, with a verification date. If you don't have the source, don't make the claim. A wrong competitor fact is a legal and reputational risk, not a typo.

**R2 — No invented product data.** Latency, accuracy, glossary output, language counts: these come from `src/data/measurements/*.json`, produced by task 01. If the file is missing or stale, **the build must fail**. Do not estimate, do not round, do not "use a plausible value".

**R3 — Publication threshold.** A pair page ships only if its mandatory unique modules are filled with real content (see task 04). The threshold is enforced by the Zod schema, not by discipline: if a field is missing, the build fails.

**R4 — Phased volume.** Never publish more pages than the current phase allows. Between one batch of programmatic pages and the next, allow 8-10 weeks of observation. A mass drop of templated pages on a new domain gets classified as scaled content abuse.

**R5 — Honesty as strategy.** On comparison pages, the "when NOT to choose VoxTranslate" section is mandatory and must be written in good faith. The SERPs are full of listicles where the author ranks themselves first and nobody believes them. Honesty is the only available differentiator.

**R6 — No head terms.** Zero dedicated pages for: `real time translation`, `live translation`, `AI translation software`, `simultaneous interpretation`, `interpretation services`, `remote simultaneous interpreting`, `video call translation`, `meeting translation`, `conference translation`, `zoom translation`, `teams live translation`, `google meet translate`, `best real time translation app`, `voice translator`, `live captions`, `multilingual events`. These are held by DeepL, Google, Wordly and the vendors' own documentation. They exist only as vocabulary for internal anchor text. Sole exception: the `/live-translation/` hub.

**R7 — Performance.** Every new page must be checked with Lighthouse before merge. No blocking JS, no widgets on load. If a page drops below 90 mobile, it does not ship.

## 3. URL architecture — fixed, not negotiable

```
/live-translation/                          pillar hub
/live-translation/{source}-to-{target}/     programmatic pair page
/live-translation/for-{platform}/           platform integration
/alternatives/{brand}/                      comparison
/compare/{a}-vs-{b}/
/pricing/{brand}-pricing/
/for/{persona}/                             use-case landing
/guides/{slug}/                             how-to guides
/latency/                                   measurement methodology
/languages/                                 public language matrix
```

Pair pattern in English: `english-to-german`, **not** `en-de`. That is the pattern people actually search.

## 4. Phase gates

Before executing a task, verify its entry gate. Before declaring it done, verify its exit gate. **If a gate does not pass, stop and say so** instead of proceeding.

| Task | Entry gate | Exit gate |
|---|---|---|
| 00 | Migration complete, 301s stable, no redirect chains | Build green, segmented sitemaps generated, Zod schema enforcing, `app.` excluded from index |
| 01 | Task 00 closed | Measurement JSON present for at least the 20 Tier 1 pairs, with timestamps |
| 02 | Task 01 closed | 10-12 pages live, each with primary sources linked and a "when not to choose us" section |
| 03 | Task 00 closed | 25-30 guides live |
| 04 | **≥8 weeks since task 02**, ≥70% of task 02/03 pages indexed in Search Console, no quality warnings | 20 Tier 1 pair pages live, all with measured data |
| 05 | **≥8-10 weeks since task 04**, ≥70% of Tier 1 pair pages indexed, impressions trending up | Tier 2 and 3 live |

The gates for 04 and 05 require real Search Console data. **Do not estimate them.** If you cannot access the data, stop and ask.

## 5. How to work

- One task at a time. Never run ahead into the next one.
- Atomic commits, one branch per task, PR describing what was created and what still needs manual verification.
- At the end of each task, write a report to `docs/seo/reports/{task}-{date}.md` covering: what was produced, what could not be done and why, what needs human intervention, exit gate status.
- If during a task you discover that something in `docs/positioning.md` is out of date (a competitor changed pricing, Google added languages), **do not fix it on your own initiative** — flag it in the report. That file is shared with sales material.
