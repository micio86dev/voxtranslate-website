---
title: Google Meet translation not available in your language
cluster: platform
shortAnswer: "Google Meet supports 5 language pairs, all anchored to English, and only one pair per meeting. If neither of your languages is English, or you need more than one pair in the same call, no plan or setting enables it — the limit is architectural."
publishedAt: null
---

This one usually is not fixable, and knowing that quickly saves a support ticket.

## The three limits

**1. Five pairs, all English-anchored.** Every supported pair has English on one side. Two non-English languages cannot be paired with each other — a Spanish speaker and a German speaker cannot use Meet's translation to talk to one another, at any price.

**2. One language pair per meeting.** A call with Italian, Spanish and German participants is not possible. This is architectural, so no upgrade changes it.

**3. A 90-minute session cap.** Longer meetings, workshops and training sessions fall outside it.

Google documents the feature in [Speech Translation support](https://support.google.com/meet/answer/16221730).

## Also worth knowing before you plan around it

**Recordings and live streams are not translated.** The translation exists during the live session and nowhere afterwards. For a team where most people watch later, this removes most of the value.

## What to check if your language should be supported

If your pair genuinely is one of the five and it still is not appearing:

- **Edition.** It is included in Business and Enterprise editions **with Gemini**. A Workspace plan without Gemini does not have it.
- **Admin configuration.** It may need enabling at organisation level.
- **Both participants.** Each person selects their own language; it does not follow the interface language.
- **Another pair already active.** With one pair per meeting, the first selection claims the slot.

## If the limit is the problem, not the configuration

You are outside what Meet can do, and the other native options have their own sharp edges:

- **Teams Interpreter** covers **10 languages** — wider than Meet's five pairs — but requires **Microsoft 365 Copilot** rather than Teams Premium, excludes external guests and anonymous users, and does not work in ad hoc meetings, webinars or town halls. Its recordings also drop the interpretation audio, by Microsoft's own documentation.
- **Zoom** covers **34 languages plus 3 target-only** but produces **captions only** — no translated audio.

**There is no native option that handles three languages with translated audio in one meeting.** If that is what you need, the answer is a tool alongside your conferencing platform rather than a setting inside it.

## Before you buy anything

Check the three things that rule out most options: how many languages in the same meeting, whether external guests are involved, and whether the recording has to keep the translation. Those three answers narrow the field faster than any feature comparison.
