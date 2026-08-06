# Task 03 — Problem-aware guides

**Entry gate:** task 00 closed. Can run in parallel with task 02.
**Goal:** 25-30 guides that build topical authority and get cited by AI answer engines.

---

## Why these matter

Individually tiny volume, almost no competition, and — the decisive part — these are the queries **AI answer engines cite**, because they need a procedural answer rather than a brand. For a zero-authority domain this is the growth engine.

Also worth knowing what you are up against: the SERPs for the events cluster are currently held by translation agencies (Translated, Tomedes, Avantpage, GMR). **No modern SaaS is ranking there.** Interprefy is the only competitor doing this well, via its blog — and it does not touch the language pair cluster at all.

## 1. The four clusters

### Events and webinars — highest priority

`how to run a multilingual webinar` · `how to host a webinar in multiple languages` · `webinar software with live translation` · `how to add interpretation to a webinar` · `do I need an interpreter for my webinar` · `how to make my conference accessible to non-english speakers` · `hybrid event multiple languages setup` · `international town hall meeting languages`

### Distributed teams — enters via the HR and D&I budget, not IT

`team standup different languages` · `how to run meetings with a multilingual team` · `remote team language barrier solutions` · `my team doesn't speak english well meetings` · `how to include non-native english speakers in meetings` · `offshore development team communication problems language` · `onboarding employees who don't speak english` · `training session for employees in multiple languages` · `all hands meeting global team language`

### Sales and procurement

`translate a client call in real time` · `how to do a sales call with a foreign client` · `how to negotiate with a supplier who doesn't speak english` · `factory audit call china language barrier` · `supplier qualification call translation` · `customer support call in another language` · `interview candidate who speaks another language`

### Platform how-tos — all confirmed in autocomplete

`how to translate a meeting in real time` · `how to translate a teams meeting live` · `how to translate zoom meeting in real time` · `real time translation for zoom breakout rooms` · `live translation for google meet` · `real time translation for webex` · `translate a youtube live stream in real time` · `translate meeting minutes into multiple languages`

### One oddity worth 2-3 pages

`live translation for church services` sits at position 4-5 in autocomplete for `live translation for `, above `phone calls` and `zoom`, and the SERP contains no SaaS at all. It is not the target buyer, but it is a cheap topical authority accelerator. Two or three pages, not a strategy.

## 2. Format

- **Answer the question in the first 200 characters** — this is the `shortAnswer` field in the schema. It is what gets pulled into featured snippets and AI answers.
- Then the detail: numbered steps, screenshots where a UI is involved, honest mention of what the native platform can and cannot do.
- Not 3,000-word essays. These win on being useful and specific, not long.
- `FAQPage` schema where there are FAQs.
- Internal links to the relevant pair pages and comparison pages — but only where genuinely relevant.

## 3. Use-case landing pages

Five pages at `/for/{persona}/`, distinct from guides in that they carry a direct commercial CTA:

`/for/webinar-organizers/` · `/for/distributed-teams/` · `/for/procurement/` · `/for/internal-comms/` · `/for/sales-teams/`

Each maps to one guide cluster and links into it.

## 4. Tone

These guides answer questions from people who often do not know the product category exists. Do not open with a pitch. Solve the problem, mention the product where it is genuinely the answer, and be straight about when a native platform feature is sufficient — if someone needs English↔Spanish only, on Google Meet, for under 90 minutes, Meet does the job and saying so costs nothing and buys credibility.

---

## Exit gate

- [ ] 25-30 guides live across all four clusters
- [ ] Every guide has a `shortAnswer` under 300 characters
- [ ] 5 use-case landing pages live
- [ ] Internal linking wired between guides, use-cases and the pillar hub
- [ ] Lighthouse mobile ≥ 90 on all new pages

Write the report to `docs/seo/reports/03-{date}.md`, then stop.
