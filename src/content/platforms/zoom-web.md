---
name: Zoom Web
surface: meeting
shortAnswer: >-
  VoxTranslate for Chrome translates the audio of a Zoom meeting joined in the browser, showing
  live subtitles over the call and optionally speaking the translation. It needs the Zoom web
  client, not the desktop app, and it changes nothing for anyone else in the meeting.
howItWorks: >-
  Join the meeting through Zoom's browser option rather than letting it open the desktop app,
  then press the VoxTranslate toolbar button on that tab. VoxTranslate captures the audio of
  that tab only, transcribes and translates it, and renders subtitles in an overlay above the
  Zoom web interface. On tiers that produce audio the translation is spoken as well, and the
  original Zoom audio keeps its own volume control, ducking under the translated voice and
  returning the moment it stops. Nothing is sent from your microphone, and nothing appears in
  the meeting for other participants.
limitations: >-
  Zoom pushes people towards its desktop client, and the desktop client has no browser tab, so
  the extension cannot reach it — you have to take the "join from your browser" link. Some hosts
  disable browser joining entirely, in which case this does not apply. Translation is for you
  alone; it does not send anything back into the meeting. Chrome only. Zoom's own translated
  captions are a different feature with different coverage, and this does not replace or
  interact with them.
relatedGuides:
  - translate-a-zoom-meeting-in-real-time
  - can-zoom-translate-a-meeting-in-real-time
publishedAt: '2026-08-26T00:00:00.000Z'
---

## The Zoom-specific catch, first

Zoom really wants you in its desktop app. The browser join link exists but is not the
default path, and some hosts turn it off. VoxTranslate listens to a browser tab, so if
you end up in the desktop client there is nothing for it to listen to.

Worth knowing before you install it, rather than after.

## What Zoom's own translation does

Zoom offers **translated captions — text only, no audio**. Its support documentation lists
34 source languages plus 3 target-only, and it requires Business Plus or Enterprise, or
the Translated Captions add-on. Its marketing pages have advertised a larger number, which
is a common source of "we thought Zoom included this" conversations. See
[can Zoom translate a meeting in real time](/guides/can-zoom-translate-a-meeting-in-real-time/)
for the detail.

If you are on the right plan and reading captions is enough, use Zoom's. It is included in
what you already pay for.

## What the extension adds

Two things Zoom's captions do not do: it works regardless of the host's Zoom plan, and it
can **speak** the translation rather than only writing it. If a call runs 45 minutes,
reading it and listening to it are genuinely different experiences.

And it is invisible to everyone else. No add-on for the host to enable, no bot in the
participant list, no plan conversation.

## What it does not do

It does not translate *you* for the room. Everyone else still hears whatever language you
speak. For a meeting where every participant needs to be understood in their own language,
[start a VoxTranslate room](https://app.voxtranslate.app) instead — that is the product
built for it, and it does up to four languages at once.
