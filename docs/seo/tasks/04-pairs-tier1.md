# Task 04 — Language pair pages, Tier 1

**Entry gate — check this first, and do not proceed if it fails:**
- ≥8 weeks have passed since task 02 shipped
- ≥70% of task 02 and 03 pages are indexed in Search Console
- No manual action or quality warning in Search Console
- Measurement JSON exists for all 20 Tier 1 pairs and is under 180 days old

**Goal:** 20 pair pages, fully generated from measured data.

---

## Why the gate is strict

Publishing dozens of templated pages on a domain with no authority history is the textbook trigger for scaled content abuse classification. The 8-week wait is not caution, it is the observation window that proves the domain is being crawled and trusted normally. If the gate fails, the correct action is to wait, not to publish fewer pages.

## 1. The 20 pages

Ten pairs, both directions. Direction matters: `english to japanese` is an English speaker addressing a Japanese audience; `japanese to english` is someone who needs to understand Japanese. Different intent, different page, both confirmed in autocomplete.

| Pair | Why it's Tier 1 |
|---|---|
| EN↔ES | Nearshoring LatAm, US Hispanic market. Highest volume among B2B pairs |
| EN↔JA | **Highest commercial value.** Low English proficiency, very high enterprise spend, established search culture around 同時通訳 |
| EN↔ZH | Supply chain, sourcing, supplier audits |
| EN↔DE | Largest EU economy, high SaaS spend, English proficiency good but not in operational and manufacturing roles |
| EN↔FR | France, Belgium, Québec, francophone Africa |
| EN↔PT-BR | Brazil: BPO, nearshore dev, events |
| EN↔KO | Semiconductors, electronics, automotive. JotMe already has this page — demand validated by a competitor |
| EN↔IT | Manufacturing, machinery, fashion, pharma. Home market — content and local link advantage |
| EN↔NL | Logistics hub, European HQs. Lower volume, premium buyers |
| EN↔AR | Gulf: events, government. High budgets, low SEO competition. Handle RTL carefully |

## 2. Page template

Modules marked **[U]** must be unique per pair and are enforced by the Zod schema. **[T]** may be templated.

1. **[U] Interactive demo widget** pre-configured for that pair, usable without signup (30-60 seconds free). This is what makes the page a *tool* rather than a doorway. Lazy-loaded, behind interaction — never on load.
2. **[U] Measured latency and accuracy for that specific pair**, pulled from `src/data/measurements/`, with measurement date and a link to `/latency/`. **No competitor does this.** It is the most defensible differentiator on the page.
3. **[U] Real linguistic note** on the difficulty of that direction. Not filler — this is the module that separates a competent page from a generated one. Examples of the substance required:
   - EN→DE: verb-final structure forces the simultaneous engine to buffer, which shows up in the latency tail
   - EN→JA: keigo politeness levels; the register has to be chosen, not just the words
   - EN→AR: RTL rendering and MSA/dialect diglossia
   - EN→ZH: tone and homophone disambiguation
   - DE→IT: long German compounds expanding into Italian phrases, changing output length and timing
4. **[U] Corridor context:** dominant industries, typical meeting type, who buys. E.g. EN↔KO → semiconductors and electronics, supplier qualification calls.
5. **[U] Three use cases** written for the pair: meeting with HQ, presenting to an audience, conference or event.
6. **[U] Glossary of 15-25 business terms** in that direction, showing the translation the engine actually produces. This is *data*, not generated prose — it is what makes the page legitimately unique, in the same way ProZ's translator inventory and Reverso's corpus make theirs unique.
7. **[U] 5-7 pair-specific FAQs** with `FAQPage` schema.
8. **[T]** Product features, security, integrations.
9. **[T]** "AI vs human interpreter" section with a cost and lead-time table. Wordly puts this on every pair page: it answers the primary objection exactly where the buyer is evaluating.
10. **[U/T]** Testimonial: pair-specific if one exists, generic otherwise.
11. **[T→U] Internal linking:** the reverse pair, 4-6 related pairs (same language hub or same geographic corridor), the pillar hub, 2-3 relevant guides, the platform integration page. The link set differs per page, which itself contributes to uniqueness.

Worth copying from JotMe: their pair pages link to 23+ other tool pages. That dense internal mesh is what drives their indexing.

## 3. The pillar hub

Build `/live-translation/` as the aggregating node: links to all pair pages, the platform integration pages, and the main guides. This is the one page allowed to target head terms (rule R6 exception). Do not expect it to rank for 18 months — its job is internal link equity and being citable by AI answers.

## 4. Platform integration pages

`/live-translation/for-zoom/` · `/for-microsoft-teams/` · `/for-google-meet/` · `/for-webex/`

Webex is the least covered by competitors — a genuine gap. Each page states honestly what the native feature does and where it stops, citing the vendor's own documentation.

## 5. Hard rule

**If a page cannot fill modules 1, 2, 3, 5, 6 and 7 with real content, it does not ship.** The build will fail — that is by design. Twenty solid pages beat fifty-six thin ones, and a thin batch can cost the indexing of the good ones too.

---

## Exit gate

- [ ] 20 Tier 1 pair pages live, all schema-valid
- [ ] Every latency figure traceable to a measurement file with a date
- [ ] Every glossary contains real engine output, not written translations
- [ ] Pillar hub live with full internal mesh
- [ ] 4 platform integration pages live
- [ ] Lighthouse mobile ≥ 90 on all new pages, demo widget not blocking LCP
- [ ] `sitemap-pairs.xml` submitted in Search Console

Write the report to `docs/seo/reports/04-{date}.md`, then stop. **Do not start task 05.**
