# Task 05 — Expansion: Tier 2 and Tier 3

**Entry gate — do not proceed if it fails:**
- ≥8-10 weeks since task 04 shipped
- ≥70% of Tier 1 pair pages indexed
- Impressions on pair pages trending up, not flat
- No quality warnings in Search Console

**Goal:** 36 more pair pages, in two separate batches with observation in between.

---

## 1. Tier 2 — 16 pages, English-anchored expansion

| Pair | Rationale |
|---|---|
| EN↔PL | Poland: European IT nearshoring and shared service centre capital. Underserved |
| EN↔TR | Turkey: manufacturing, textiles, automotive, strong EU export |
| EN↔RU | Historically high volume — **assess reputational and sanctions risk before investing** |
| EN↔SV | Nordics: high SaaS spend, but very high English proficiency means low volume. Lowest priority in this tier |
| EN↔VI | Vietnam: manufacturing growth, China+1 |
| EN↔ID | Indonesia: large market, growing SaaS adoption |
| EN↔HI | ⚠️ Autocomplete shows strong volume, but **B2B monetisation for a Western vendor is low**. Treat as traffic, not leads |
| EN↔TH | ⚠️ Same caveat — largely tourism and consumer intent |

Do not be misled by autocomplete volume on HI and TH. They will inflate the traffic chart and contribute nothing to pipeline. Ship them, but do not let them shift priorities.

## 2. Tier 3 — 20 pages, non-English corridors

**This is the real differentiator and the reason to keep going.** No competitor covers it: Wordly links 5 pairs, all from English; JotMe covers 8, all English-anchored. Non-English corridors are untouched ground.

| Pair | Rationale |
|---|---|
| DE↔IT | The densest manufacturing corridor in Europe (mechanical subcontracting). Low volume, **zero competition** |
| DE↔FR | Franco-German axis: EU institutions, automotive, aerospace |
| DE↔PL | German manufacturing and logistics nearshoring into Poland |
| ES↔PT | Iberia plus the LatAm–Brazil corridor |
| FR↔ES | Southern Europe, francophone/hispanophone LatAm |
| DE↔ES | German industrial investment in Spain and Mexico |
| IT↔FR | Alpine and Mediterranean corridor, fashion and luxury |
| JA↔ZH | High-value intra-Asian trade corridor, no Western SEO coverage at all |
| JA↔KO | Electronics, semiconductors |
| DE↔TR | Strong industrial and workforce ties |

Volume per page is low. That is fine — the aggregate is meaningful, competition is effectively nil, and these pages are the ones that make the site look like a genuine authority on the category rather than an English-first product with a translation feature.

## 3. Sequencing

Ship Tier 2 first. Observe for 6-8 weeks. Then Tier 3. Do not ship 36 pages in one batch.

Requirements are identical to task 04: same template, same unique modules, same Zod enforcement, same measurement data. Run the harness (task 01) for these pairs before generating any page.

## 4. What comes after — do not do it in this task

**Localised pages** (`/it/`, `/de/`, `/es/`, `/fr/`, `/pt/`) are a separate project, not an extension of Tier 3. Only consider it once the English pages are indexed and performing.

The critical detail if and when you do: **the query pattern differs by language and is not mechanically translatable.**

| Language | Pair pattern | Head concept |
|---|---|---|
| EN | `X to Y` | real time / live translation |
| IT | `X Y` (bare, no preposition) | traduzione simultanea |
| ES | `X Y` (bare) | traducción simultánea |
| DE | `X Y` (bare) | Simultanübersetzung / Live-Übersetzung |
| FR | `X Y` (bare) | traduction simultanée |
| **PT** | **`de X para Y`** — the only one with a full preposition | tradução simultânea |
| JA | `X Y` (bare) | 同時通訳 |
| ZH | `X Y` (bare) | 实时翻译 / 同声传译 |

So the Italian slug is `/traduzione-simultanea-inglese-italiano`, **not** `inglese-a-italiano`. Portuguese is the exception: `/traducao-simultanea-de-ingles-para-portugues`. Getting this wrong produces pages that target strings nobody types.

Also note: German searchers explicitly look for the AI variant — `Simultanübersetzung ki` is at position 4 in autocomplete. Recurring modifiers across every language tested: `teams`, `zoom`, `google meet`, `app`, `gratis/free/kostenlos/無料`, `ai/ia/ki`. Hardware modifiers (`airpods`, `iphone`) are consumer intent — exclude them.

Localisation needs hreflang, which needs to be correct or it actively harms. Treat it as its own project with its own gate.

---

## Exit gate

- [ ] Tier 2 live (16 pages), observed for 6-8 weeks before Tier 3
- [ ] Tier 3 live (20 pages)
- [ ] Measurement data present for every published pair
- [ ] No quality warnings in Search Console after each batch
- [ ] Internal mesh updated so new pairs link into existing corridors

Write the report to `docs/seo/reports/05-{date}.md`, then stop.
