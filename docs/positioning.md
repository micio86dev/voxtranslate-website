# VoxTranslate — Positioning and competitive reference

*Research conducted 5 August 2026. All pricing verified against primary sources; where not public, this is stated explicitly. Claims in this file were checked by an adversarial verification pass.*

**This file is the single source of truth for public-facing copy and competitor claims. Do not state anything about a competitor that is not in here or backed by a linked primary source.**

---

## 1. The conclusion first

VoxTranslate has **no defensible technology moat**. Palabra.ai sells the same stack via API at $0.04/minute with public pricing; the underlying models are commodities anyone can buy; Google and Microsoft will add languages and raise limits over the next 24 months.

What *is* defensible for 18-36 months is the **combination** of three things no single competitor offers together:

1. **Symmetric multi-language small-group conversation** — the segment the large players ignore because their customer is the event, and that the native platforms cannot solve due to documented architectural limits.
2. **Public consumption-based pricing** — no minimums, no expiry, no per-language tariff — against an entire industry that hides its prices.
3. **Translation persistence** — multi-track recording and per-language transcripts, where Teams and Meet fail by their own documentation's admission.

---

## 2. Competitive landscape

### 2.1 Platform natives — the real price ceiling

These limits are all documented by the vendors themselves and are safe to cite.

| | What it actually does | Languages | Licence |
|---|---|---|---|
| **Zoom** | **Translated captions only. No audio.** | 34 (+3 target-only) | Business Plus / Enterprise, or the Translated Captions add-on |
| **Teams Interpreter** | Voice-to-voice with voice simulation | **10** | Requires **Microsoft 365 Copilot** (~$30/user/month) — Teams Premium ($10/user/month annual) is not sufficient. Excludes guests and anonymous users |
| **Google Meet** | Voice-to-voice, voice preserved (Gemini) | **5 pairs, all English-anchored** | Included in Business/Enterprise editions with Gemini |

Three limits worth their weight in sales conversations:

- **Google Meet supports one language pair per meeting.** A call with Italian, Spanish and German is literally impossible. Plus a 90-minute session cap, and no translation in recordings or live streams.
- **Teams does not work in ad hoc meetings, webinars or town halls**, and external guests without an M365 licence are excluded. Microsoft's own documentation states that *"meeting recordings only capture the original meeting audio and don't include interpretation audio"*, and translated transcripts disappear when the meeting ends. The prerequisite is Microsoft 365 Copilot, not the cheaper Teams Premium — the real barrier to entry is roughly three times what buyers assume.
- **Zoom does not translate to audio.** If a team runs spoken calls, they are reading subtitles. There is also a discrepancy between Zoom's marketing page (46 languages, "included in any paid plan") and its support documentation (34+3 languages, requires Business Plus or an add-on): buyers who assume "Zoom includes it" often find they are on the wrong plan.

### 2.2 Event vendors — expensive and opaque

| | Model | Languages | Public pricing |
|---|---|---|---|
| **Wordly** | Pure AI | 60 speaker + 7 attendee, 3,000+ pairs | **No** — annual hour tiers only (10/25/50/100/250/500+), 10-hour minimum, 12-month expiry |
| **Interprefy** | Hybrid AI + human | 82 full + ~19 partial | **No** — price also scales with **number of languages**; unused hours do not roll over |
| **KUDO** | Hybrid, interpreter marketplace | AI 70+; human 200+ with 12,000 interpreters | **No** — annual from 50 hours |
| **Boostlingo** | Hybrid, human-first | Human 275+; AI Pro 130+ | **No** |

The common thread: **none of them publishes a price**, all require a sales call, all lock buyers into prepaid hours that expire. Wordly is closest to VoxTranslate philosophically (pure AI, no interpreters, 50-90% saving claim against human interpreters) and is the strongest: 5,000+ organisations, SOC 2 Type II, ISO 27001, HIPAA.

Interprefy's structural weakness is that **price scales with language count** — exactly the shape of a 4-person call in 4 languages.

### 2.3 AI natives — the actual competitors

**Palabra.ai** is the most dangerous rival. Same architecture (WebRTC, real-time speech-to-speech), same positioning, **$8.4M pre-seed**, and — unlike everyone else — **public pricing**:

- Speech-to-Speech API: **$0.04/minute**, $50 free credits on signup
- Meetings: Starter **$45/month** annual (3h, $15/h overage) · Pro **$113** (10h) · Team **$375** (50h)

This is a price floor visible to everyone. **Do not compete on unit price.**

**JotMe** is the anchor from below: **$10-15/month effective** (annual) for 3-8 hours of live translation with voice cloning, 200+ languages claimed. It works as a bot joining the call — which adds latency and does not work in native WebRTC — and has no enterprise compliance. But it is the number a small-business buyer will quote at you.

**Lingopal** ($14M Series A, Super Bowl LIX) and **Camb.ai** (IMAX, NASCAR, Australian Open, Comcast) own the broadcast space. If VoxTranslate pushes the WHIP/LL-HLS webinar feature, these are the names it will face.

---

## 3. Positioning

### 3.1 The segment

> **Four people, four languages, everyone speaking, nobody waiting.**

The 4-participant cap is not a weakness to hide: it is the precise definition of the segment. Every competitor analysed is architected for **one-to-many broadcast** — one speaker, N passive listeners. Symmetric multi-language conversation is a technically different problem (N-to-N audio routing with barge-in and overlap handling) that the large players are not solving, because their customer is the event.

Target use case: **the recurring, unscheduled 3-4 person international sales, support or recruiting call.** Teams Interpreter is explicitly unavailable for ad hoc meetings. That is a documented hole.

### 3.2 Commercial model as the differentiator

The biggest gap in this market is not technical, it is commercial. Between "$15/month consumer" and "call sales for a quote on 50 annual hours" there is a chasm, currently occupied only by Palabra. A 30-person company running 15 international calls a month has no obvious option.

Three contractual promises to put on the homepage, because no incumbent can copy them without breaking its own revenue model:

- **Price published per minute**, no sales call
- **Credits that never expire**, against Wordly (12-month expiry) and Interprefy (no rollover)
- **No per-language tariff**, against Interprefy

### 3.3 What to stop doing

**Collapse the four engine tiers into two outcome-oriented modes.** Buyers do not want to choose an ASR engine; they want it to work. Exposing Deepgram/Cartesia/OpenAI/Gemini transfers cognitive load the buyer does not want and signals product immaturity.

- **Economy** — higher latency, low credit cost
- **Realtime** — sub-second, high credit cost

The multi-vendor architecture underneath sells to *technical* buyers as resilience and no lock-in to a single AI supplier. That is a serious procurement argument, but it is not the headline message.

**Do not build go-to-market on webinar broadcast.** Against Lingopal and Camb.ai you do not compete. Sell it as a natural extension for existing call customers: *"same platform, same glossary, same voices, when you go from 4 people to 400."*

---

## 4. Three things to do now

1. **Publish the language matrix.** The 84 claimed languages beat Palabra (60+), Wordly (67), KUDO AI (70+) and Interprefy (82, some partial). But an undocumented number is discounted to zero by any enterprise buyer — everyone inflates (JotMe claims 200+, Camb.ai 150+). A pair-by-pair table with declared quality tiers makes you instantly more credible than a competitor with a bigger, undocumented number.

2. **Build the comparison page against native platform limits**, citing the vendors' own sources. Defensible, unfalsifiable, and it answers the number one objection.

3. **Ship multi-track cloud recording.** Teams and Meet admit in their own documentation that the translation evaporates when the meeting ends. For a company distributed across time zones — the most common multilingual use case — that is a serious functional failure, and you can show it in one slide with no risk.

---

## 5. Objection handling

### "Zoom/Teams/Meet already include this"

*Most frequent, and lethal if unhandled.*

Check what "included" actually means — the three limits in §2.1. Then close with a question, not a statement: **"what are your three most frequent language pairs, and do your external participants have M365 licences?"** If the pairs are not English-anchored, or there are external guests, the native option falls over on its own.

### "Wordly and KUDO have thousands of customers. Who are you?"

True, and not to be denied. Three moves:

1. **Narrow the field:** "Wordly is right for its market — 5,000-person congresses. That is not your use case." Do not compete where they are strong.
2. **Turn risk into a trial:** a pilot on a real call, no contract, no minimum, against their 10-50 prepaid hour minimum. The cost of trying you is near zero.
3. **Exportability as insurance:** contractually guarantee export of transcripts, glossaries and recordings in open formats.

### "You don't have human interpreters"

**A legitimate and partly unanswerable objection** — do not pretend otherwise. Interprefy does live AI→human failover; KUDO has 12,000 interpreters with two hours' notice. You cannot replicate that.

The answer is segmentation, not comparison: *"If you're negotiating a merger, hire a human interpreter — we'll tell you so. We serve the 40 weekly calls that currently happen in approximate English because nobody books an interpreter for a standup."*

Your market is not the interpreter's market: it is the meetings that **currently happen with no translation at all**.

### "Four participants max? That's a toy"

*"Four people speaking four different languages simultaneously is technically harder than four hundred people listening to one speaker. Every voice has to be recognised, translated and routed to three different destinations in real time. Google Meet can't do it — it supports one language pair per meeting."*

If the prospect genuinely needs 12 active participants, **disqualify them**. Losing a badly fitted deal costs less than churn.

### "Palabra is $0.04 a minute. Why pay you?"

*The technical buyer's objection, and the hardest.*

$0.04/min is the **raw API**, not the product — Palabra's own Meetings plans run $45-375/month with $7.5-15/h overage. You sell WebRTC rooms, organisations and projects, per-room glossaries, prepared voice cloning, cloud recording and consumption billing: months of engineering for anyone building it themselves.

*"If you have a team that wants to build it, buy the API. If you want to use it on Monday, buy the product."* **Do not argue about unit cost — you lose.**

### "JotMe costs $10 a month"

Compare like for like: JotMe Pro gives **200 minutes — 3 hours a month**. If their real usage is 2 hours a month, JotMe is the right choice and **say so**. If it is 20 hours, the comparison changes. Non-expiring credits win specifically on **irregular** usage.

### "How do I know the cloned voice and meeting data are safe?"

The objection that blocks you in procurement without certifications. Wordly has SOC 2 Type II + ISO 27001 + HIPAA; KUDO has SOC 2 Type 1 and 2. **You cannot win this comparison today.**

Minimum before any enterprise conversation: explicit consent for voice cloning with revocation and immediate profile deletion; configurable retention with zero default on raw audio; standard DPA and public sub-processor list; contractual no-training; declared EU data residency for the Business layer.

Then **plan ISO 27001**. Until then, disqualify regulated deals rather than spending six months on a security questionnaire you cannot pass. It is a binary budget decision, not a detail.

---

## 6. Data sovereignty

A real but medium-sized gap: Zoom, Teams and Meet process on US infrastructure. Wordly and KUDO have the certifications but are US companies. Interprefy (Swiss) and Interactio (Lithuanian) are the only credible European options, and both are expensive and sales-led.

For European public sector, healthcare, legal and regulated industries, declared EU data residency is sellable — **but only with certifications in hand**. Without them the compliance story is vapour and every procurement filters you out at the first questionnaire.

---

## Primary sources

**Wordly:** [pricing](https://www.wordly.ai/pricing) · [supported languages](https://help.wordly.ai/about-languages-supported) · [fact sheet](https://www.wordly.ai/fact-sheet)
**Interprefy:** [pricing](https://www.interprefy.com/pricing) · [AI languages](https://knowledge.interprefy.com/what-languages-can-interprefy-ai-translate-from-and-to)
**KUDO:** [pricing](https://kudo.ai/pricing) · [AI Speech Translator](https://kudo.ai/solutions/kudo-ai-speech-translator/)
**Boostlingo:** [AI Pro](https://boostlingo.com/boostlingo-ai-pro/)
**Zoom:** [Translated Captions support article](https://support.zoom.com/hc/en/article?id=zm_kb&sysparm_article=KB0059081)
**Teams:** [Interpreter — support](https://support.microsoft.com/en-us/teams/copilot/interpreter-in-microsoft-teams-meetings-and-calls) · [Interpreter agent — admin prerequisites](https://learn.microsoft.com/en-us/microsoftteams/interpreter-agent-teams) · [Teams Premium pricing](https://www.microsoft.com/en-us/microsoft-teams/premium)
**Google Meet:** [Speech Translation](https://support.google.com/meet/answer/16221730) · [GA announcement, Feb 2026](https://workspaceupdates.googleblog.com/2026/02/speech-translation-meet-ga.html)
**Palabra:** [pricing](https://www.palabra.ai/pricing)
**JotMe:** [pricing](https://www.jotme.io/pricing)
**Lingopal:** [site](https://lingopal.ai/) · **Camb.ai:** [site](https://www.camb.ai/)
