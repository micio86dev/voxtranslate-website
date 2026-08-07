---
title: Teams live captions not translating — what to check
cluster: platform
shortAnswer: "Live captions and translated interpretation are separate features in Teams. Captions transcribe the spoken language; translation requires Teams Interpreter, which needs Microsoft 365 Copilot, covers 10 languages, and excludes external guests and ad hoc meetings."
publishedAt: '2026-08-07T00:00:00.000Z'
---

Most reports of this are two features being confused. Establish which one you are trying to use.

## Live captions ≠ translation

**Live captions** transcribe what is being said, in the language it is being said in. Turning them on does not translate anything.

**Teams Interpreter** is the translation feature — voice-to-voice, in 10 languages — and it is licensed separately.

If captions are appearing but in the wrong language, captions are working correctly and you are looking for a different feature.

## Why Interpreter may not be available

In order of likelihood:

**1. You do not have Microsoft 365 Copilot.** This is the prerequisite. **Teams Premium is not sufficient** — a distinction that catches out most organisations, since Copilot is roughly three times the cost. Microsoft documents this in the [Interpreter agent admin prerequisites](https://learn.microsoft.com/en-us/microsoftteams/interpreter-agent-teams).

**2. The meeting is ad hoc.** Interpreter does not work in ad hoc meetings, webinars or town halls. Scheduled meetings only.

**3. Someone is an external guest.** Guests and anonymous users without a licensed account in your tenant are excluded.

**4. Your language is not in the 10.** Check the current list rather than assuming.

**5. An admin has not enabled it.** Tenant-level configuration is required before hosts can use it.

## "It worked in the meeting but the recording has nothing"

Working as designed, unfortunately. Microsoft's [documentation](https://support.microsoft.com/en-us/teams/copilot/interpreter-in-microsoft-teams-meetings-and-calls) states that meeting recordings capture only the original meeting audio and do not include interpretation audio, and that translated transcripts disappear when the meeting ends.

There is no setting that changes this. If the recording matters — and for a distributed team it usually matters more than the live session — plan for it separately.

## If captions themselves are poor

Caption accuracy is driven mostly by input quality:

- **Fix the microphone first.** Nothing downstream compensates for bad audio.
- **One speaker at a time.** Overlap is where transcription fails hardest.
- **Say acronyms in full** the first time.
- **Type numbers and names in the chat** — highest consequence, worst transcription.

## If Teams cannot do what you need

The gaps that most often force a change are external participants, more than two languages, ad hoc meetings, and recordings that must keep the translation.

The other native options do not fill all of them: **Google Meet** handles one English-anchored language pair per meeting with a 90-minute cap and no translation in recordings; **Zoom** provides translated captions only, with no translated audio at all.
