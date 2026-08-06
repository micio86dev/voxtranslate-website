---
title: Zoom live translation not working — what to check
cluster: platform
shortAnswer: "Zoom provides translated captions only, never translated audio. If you expected to hear another language, the feature is working as designed. If captions are missing, check your plan: it needs Business Plus, Enterprise, or the Translated Captions add-on."
publishedAt: null
---

Two very different problems get reported the same way. Work out which one you have first.

## "I can't hear the translation"

This is not a fault. **Zoom does not produce translated audio at all.** Its feature is translated captions — text on screen — across 34 languages plus 3 target-only.

If your expectation was voice-to-voice, no setting will produce it. That is a different product, not a configuration.

## "I don't see the captions"

Now it is a real problem. In order of likelihood:

**1. Your plan does not include it.** Translated captions require **Business Plus or Enterprise**, or the **Translated Captions add-on**. This is the most common cause.

Worth knowing: Zoom's marketing page and its [support documentation](https://support.zoom.com/hc/en/article?id=zm_kb&sysparm_article=KB0059081) disagree — the marketing page cites 46 languages and describes the feature as included in any paid plan, the support article states 34 plus 3 and lists the plan requirements above. Check your own admin console rather than the pricing page.

**2. It is not enabled at account level.** An admin has to switch it on before hosts can use it. A host cannot enable it for themselves.

**3. The host has not turned it on for the meeting.** Account-level availability is not the same as being active in a session.

**4. Your language pair is not supported.** The 3 target-only languages can be translated *into* but not *from*.

**5. Participants have not selected a language.** Each attendee chooses their own caption language — it does not follow their interface language.

## "The captions are wrong or delayed"

Captions degrade with overlapping speech, fast delivery, heavy accents and poor microphones. In order of impact:

- **Fix the microphone.** Everything downstream depends on the input.
- **One speaker at a time.** Overlap is where captioning fails hardest.
- **Say acronyms in full** the first time.
- **Put numbers and names in the chat** as well — these caption worst and matter most.

## If you actually need translated audio

Zoom will not do it. The options are human interpreters using Zoom's interpretation channels where your plan supports them, a separate translation tool running alongside the call, or a different platform for those specific meetings.

Before switching, check the other two: **Google Meet** does voice-to-voice but only one English-anchored language pair per meeting with a 90-minute cap; **Teams Interpreter** does 10 languages but requires Microsoft 365 Copilot and excludes external guests.
