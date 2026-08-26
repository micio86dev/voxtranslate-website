---
title: How to translate a live stream in real time
cluster: platform
shortAnswer: Decide whether viewers need translated captions or translated audio, because they need different setups. Captions can be generated from the stream; translated audio generally means producing separate language tracks, which is a production decision rather than a settings change.
publishedAt: '2026-08-07T00:00:00.000Z'
---

Live streaming to a multilingual audience splits into two quite different projects. Confusing them is the usual reason a plan falls apart a week before the event.

## Captions or audio?

**Translated captions** are text over the video. One stream, one audio track, subtitles the viewer selects. Simpler, cheaper, and adequate when your audience reads the language competently.

**Translated audio** means the viewer hears their own language. This generally requires producing a separate audio track per language, which is a production decision — encoders, bandwidth, and a player that lets viewers pick.

Decide this first. Almost everything else follows from it.

## If captions are enough

The workflow is straightforward: the stream is transcribed, the transcript is translated, captions are pushed to the player.

Things that determine quality more than the tool does:

- **Audio quality at the source.** Everything downstream depends on it. A good microphone improves translation more than any setting.
- **A glossary** of names, products and domain terms, loaded in advance.
- **Speaker discipline** — one at a time, clear handovers. Overlapping speech is where live captioning degrades fastest.
- **A caption delay.** A few seconds of buffer materially improves accuracy, and for a one-directional broadcast nobody notices.

## If you need translated audio

This is a production build, not a feature toggle:

1. **A translation source per language** — interpreters, or AI translation producing an audio track
2. **An encoder** that can carry multiple audio tracks, or parallel streams per language
3. **A player** that lets viewers select a track
4. **Bandwidth and cost** that scale with language count

For most organisations this is the point at which a specialist vendor becomes the sensible answer rather than a build.

## The archive is a separate decision

A live stream usually has a much larger audience after the event than during it. That audience is the one you can actually serve well, because asynchronous translation has no latency constraint.

A practical and often better sequence: run the live stream with captions in one or two languages, then publish the recording with properly translated subtitles in as many languages as you need. Cheaper, higher quality, and it serves the larger audience.

If you only have budget for one, translating the archive is frequently the better spend.

## Plan the interaction too

Live chat and Q&A in a multilingual stream is the part most often left monolingual. If the stream is translated and the chat is English-only, the interaction belongs to a subset of your audience.

Collecting questions in writing, in any language, and answering a stated number of them costs nothing and is the difference between a broadcast and an event.

## What a viewer can do without you

Worth knowing, because it changes how much you need to build.

A viewer can translate your stream themselves with a browser extension —
[VoxTranslate for Chrome](/live-translation/for-youtube/) reads the audio of the YouTube
tab and renders subtitles over the player, with an optional spoken translation. It works on
a live stream exactly as it does on a recording, because it listens to the sound rather
than waiting for a caption file.

This does not replace the decisions above. Anything you want **guaranteed** — a language
you have committed to supporting, terminology you need correct, an archive that must be
subtitled — is yours to produce. But it does mean the long tail of languages you were never
going to cover is not simply lost, and it is a reasonable thing to say in the description.

## Before you go live

- Captions or audio, decided and built
- Glossary loaded
- Source audio tested with the real microphone and the real room
- Speaker handover discipline briefed
- Archive plan agreed — what gets subtitled, in which languages, by when
- Chat and Q&A language decided
