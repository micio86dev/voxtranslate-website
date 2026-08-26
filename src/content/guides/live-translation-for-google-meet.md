---
title: Live translation in Google Meet
cluster: platform
shortAnswer: Google Meet does voice-to-voice translation well and preserves the speaker's voice, but supports one language pair per meeting, all English-anchored, with a 90-minute cap and no translation in recordings or live streams. Two languages with English on one side is the case it fits.
publishedAt: '2026-08-07T00:00:00.000Z'
---

Google Meet's speech translation is good at the narrow thing it does. The limits are sharp rather than gradual, which makes it easy to evaluate: you are either inside them or you are not.

## What it does

Voice-to-voice translation with the speaker's voice preserved, powered by Gemini, included in Business and Enterprise editions with Gemini.

It covers **5 language pairs, all anchored to English**.

## The limit that decides most cases

**One language pair per meeting.**

A call with Italian, Spanish and German participants is not possible on Meet. Not expensive — impossible. This is architectural, not commercial, so no plan upgrade changes it.

Since every supported pair is English-anchored, two non-English languages cannot be paired with each other either. A Spanish speaker and a German speaker cannot use Meet's translation to talk to one another.

## The other three limits

**90-minute session cap.** Longer meetings, training sessions and workshops fall outside it.

**No translation in recordings or live streams.** The translation exists during the live session and nowhere afterwards. For a distributed team where most people watch later, this removes most of the value.

**Five pairs.** Check the current list against your actual languages rather than assuming coverage.

## When Meet is the right answer

- **Two languages, one of them English**
- One of the supported pairs
- Under 90 minutes
- The live session is what matters, not the recording
- Everyone on a Business or Enterprise edition with Gemini

That is a genuinely common situation — a bilingual team, a recurring call with one international colleague, a regular customer check-in. If it describes you, the feature is already in your licence and works well. Use it.

## When it is not

- Three or more languages
- Two non-English languages
- Over 90 minutes
- Recording or live stream needs the translation
- External participants outside your Workspace

## How it compares on this specific point

Both alternatives trade one limit for another:

- **Teams Interpreter** supports 10 languages rather than 5 pairs, but requires **Microsoft 365 Copilot** rather than Teams Premium, excludes external guests, and does not work in ad hoc meetings, webinars or town halls. Its recordings also drop the interpretation audio, by Microsoft's own documentation.
- **Zoom** covers 34 languages plus 3 target-only, but produces **captions only — no translated audio**.

There is no native option that handles three languages with translated audio in one meeting. That is the gap worth knowing about before you evaluate anything else.

## Following a Meet call in your own language

Everything above is about what the *organiser* can turn on. There is a separate question:
what can you do about a Meet call you were simply invited to, on someone else's Workspace,
where the pair is not English-anchored?

[VoxTranslate for Chrome](/live-translation/for-google-meet-web/) translates the audio of
the Meet tab in your browser, showing subtitles over the call and optionally speaking the
translation. It needs the **web** client — the desktop app has no browser tab to listen to
— and it is one-directional: it translates what you hear, and the other participants get
nothing back.

That is the honest boundary. It solves your comprehension, not the room's. For a meeting
where three people each need to be understood in their own language, the answer is still a
tool that runs the call, not one that listens to it.

## Practical notes

- **Brief speakers to pause at clause boundaries.** Meet's translation, like all of them, needs a phrase to work with.
- **Put numbers and names in the chat.** Highest consequence, cheapest fix.
- **Test with real spontaneous speech**, not a scripted run-through.
- **Decide what happens to the recording** before the meeting, since the translation will not be in it.
