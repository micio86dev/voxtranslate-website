# Task 02 — Comparison and alternative pages

**Entry gate:** task 01 closed.
**Goal:** 10-12 pages targeting the highest commercial intent available to a zero-authority domain.
**Automation level:** draft automatically, **human review mandatory before publishing**. These pages make factual claims about named companies.

---

## Why these first

Highest intent-to-difficulty ratio in the whole plan. The buyer is already evaluating and has budget. Volume is genuinely low — `interprefy alternative` returns only 2 autocomplete suggestions, against 10 for broader queries — but the acquisition cost is near zero because the SERPs are held by aggregators (G2, SourceForge, Slashdot, SaaSHub, AlternativeTo) and content farms (Maestra, Transync, Subanana, Snapsight, UMEVO), all low-to-mid authority.

Note the ranking opportunity in Wordly's own brand: autocomplete on `wordly ` returns `wordly wise`, `wordly game`, `worldly gray` — only 3 of 10 suggestions are the product. The clean queries are `wordly ai + modifier`, and that is where to aim.

## 1. Pages to build, in priority order

**Batch 1 — ship these 12**

`/alternatives/wordly/`
`/alternatives/interprefy/`
`/alternatives/kudo/`
`/alternatives/interactio/` — less contested than the top three, quick win
`/alternatives/boostlingo/` — same
`/alternatives/jotme/`
`/compare/ai-interpretation-vs-human-interpreter/` — **the single most valuable page here**: it is the query a buyer uses to justify the decision internally, i.e. the one that unlocks budget
`/compare/wordly-vs-interprefy/`
`/compare/kudo-vs-interprefy/`
`/pricing/interprefy-pricing/` — `interprefy pricing` is the strongest brand query in the sector (position 2 in autocomplete)
`/pricing/wordly-pricing/` — `wordly ai price` and `wordly ai translation pricing` sit at positions 2 and 3
`/compare/voxtranslate-vs-wordly/` — claim your own comparison before someone else does

**Later batch:** `/alternatives/palabra-ai/` (near-empty SERP), `/compare/wordly-vs-kudo/`, `/compare/interprefy-vs-interactio/`, `/pricing/kudo-pricing/`, `/pricing/how-much-does-simultaneous-interpretation-cost/`

## 2. Mandatory page structure

Every page:

1. **Verification date at the top.** "Pricing verified 14 September 2026." Nothing dates a comparison page faster than uncited numbers.
2. **What the competitor is genuinely good at**, stated plainly and first. A page that opens by attacking is read as an ad and closed.
3. **Feature table**, not cherry-picked to win.
4. **Pricing**, with primary sources linked. Where a vendor does not publish pricing, say exactly that — "Wordly does not publish prices; the pricing page lists annual hour tiers (10/25/50/100/250/500+) with a minimum purchase of 10 hours and a 12-month expiry" — and link the page. **The absence of a public price is itself the story.**
5. **"When NOT to choose VoxTranslate"** — mandatory, minimum 200 words, written in good faith. If the competitor is better for a use case, say which and why. This is the section that makes the rest believable, and it is the only real differentiator available against a SERP full of self-serving listicles.
6. **CTA**: public pricing, no minimums, no sales call.

## 3. Facts you may use

All from `docs/positioning.md`, all verified against primary sources. Do not restate anything not in that file without linking a source.

The load-bearing ones:
- Wordly, Interprefy, KUDO, Boostlingo: **none publish a price**. All require a sales conversation. Wordly's hours expire after 12 months; Interprefy's hours are not carried over.
- Interprefy prices partly **by number of languages** — which makes a 4-language conversation structurally expensive.
- Palabra is the only AI-native competitor with public pricing: **$0.04/minute** speech-to-speech API, Meetings plans from $45/month.
- JotMe Pro is **$10/month annual for 200 minutes (3h)** — compare like for like, and if the prospect's real usage is 2 hours a month, say JotMe is the right choice.
- Native platform limits: Zoom is **captions only, no audio**; Google Meet does **5 pairs, all English-anchored, one pair per meeting**, 90-minute cap, nothing in recordings; Teams does **10 languages**, requires **Microsoft 365 Copilot**, excludes guests, and does not work in ad hoc meetings or webinars — and its own documentation states recordings capture only the original audio.

## 4. The rage-query guides

Alongside the comparison pages, publish short guides (in `/guides/`) for the queries where someone is actively blocked and therefore maximally receptive:

`zoom live translation not working` · `can zoom translate a meeting in real time` · `teams live translation license required` · `teams live captions not translating` · `google meet translate not available in my language`

Format: answer the actual question honestly in the first 200 characters, explain the limitation with a link to the vendor's own documentation, then — and only then — mention the alternative. A guide that solves the problem earns the click; a guide that baits it burns the domain.

---

## Exit gate

- [ ] 12 pages live
- [ ] Every price claim carries a primary source link and a verification date
- [ ] Every page has a genuine "when not to choose us" section
- [ ] 5 rage-query guides live
- [ ] **Human review completed on every page** — this gate cannot be self-certified by the agent
- [ ] Lighthouse mobile ≥ 90 on all new pages

Write the report to `docs/seo/reports/02-{date}.md`, then stop.
