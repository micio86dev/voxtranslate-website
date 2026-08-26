---
name: Google Meet Web
surface: meeting
shortAnswer: >-
  VoxTranslate for Chrome translates the audio of the Google Meet tab in your browser, giving
  you live subtitles over the call and an optional spoken translation. It works with the web
  client, not the desktop app, and nobody else in the meeting has to install or change anything.
howItWorks: >-
  You join the meeting at meet.google.com as usual, then press the VoxTranslate toolbar button
  on that tab. The click itself is what grants access, to that one tab and nothing else.
  VoxTranslate captures the tab's audio, transcribes and translates it, and draws subtitles in
  an overlay above the Meet interface — including in fullscreen. On tiers that produce audio you
  also hear a spoken translation, with the original Meet audio on its own volume control that
  ducks underneath while the translation speaks. Your microphone is never captured, so what you
  say goes into Meet exactly as it always did.
limitations: >-
  This works on the Meet web client only. The Google Meet desktop and mobile applications have
  no browser tab to listen to, so they are out of scope. Translation is one-directional and
  local to you: it translates what you hear, and the other participants get nothing back — for a
  call where everyone needs to be understood in their own language, a VoxTranslate room is the
  right tool instead. Chrome only. The spoken language is detected once when you press start, so
  a meeting that switches language halfway through needs the session restarted.
relatedGuides:
  - live-translation-for-google-meet
  - google-meet-translate-not-available-in-my-language
publishedAt: '2026-08-26T00:00:00.000Z'
---

## Why this comes up

Google Meet has its own speech translation, and where it fits it is good: voice-to-voice
with the speaker's voice preserved. But it covers **five language pairs, all anchored to
English**, and it supports **one pair per meeting** — so a call with Italian, Spanish and
German participants is not a plan upgrade away, it is impossible. It also needs Business
or Enterprise with Gemini, which excludes most external guests.

Those limits are documented by Google and are the reason people go looking for something
else. See [live translation for Google Meet](/guides/live-translation-for-google-meet/)
for what the native feature does and where it stops.

## What changes with the extension

Nothing, for everyone else. That is the point.

You are not asking the organiser to move the meeting, add a bot, or grant a workspace
integration. There is no participant list entry for VoxTranslate, because it is not in
the meeting — it is in your browser, listening to your own tab.

That also sets the honest boundary: it solves *your* comprehension, not the room's. If
three people each need to be heard in their own language, that is a different problem and
[a VoxTranslate room](https://app.voxtranslate.app) is the tool for it.

## When the native feature is enough

If your meetings are consistently English-to-one-other-language, everyone is on a Google
Workspace plan with Gemini, and nobody external joins — use Meet's own translation. It is
included, it preserves the speaker's voice, and adding a second tool for it would be
worse, not better.

The extension earns its place when the pair is not English-anchored, when there are three
languages in the room, when guests have no Workspace licence, or when you simply want to
follow a call you were invited to and cannot change.
