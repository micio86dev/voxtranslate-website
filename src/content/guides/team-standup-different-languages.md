---
title: Running a standup when the team speaks different languages
cluster: teams
shortAnswer: Move status to writing and keep the call for blockers only. A standup is the worst possible format for live translation — short, fast, overlapping turns — and the cheapest fix is usually to stop doing status verbally at all.
publishedAt: '2026-08-07T00:00:00.000Z'
---

A standup is the hardest meeting format to translate and the easiest to redesign so that it does not need translating.

## Why standups translate badly

Everything that makes a standup efficient makes it hard to translate:

- **Turns are short.** Translation systems need a phrase to work with; a three-word update gives them nothing.
- **Turns overlap.** People interject, agree, correct each other mid-sentence.
- **The vocabulary is dense** — ticket numbers, service names, internal acronyms, half-English jargon in an otherwise non-English sentence.
- **The pace is the point.** A 15-minute standup with translation delay becomes a 25-minute standup, and then people stop coming.

If you translate your standup live and nothing else changes, you will have made it worse.

## The redesign that usually works

**Status goes in writing, before the call.** Each person posts their update in their own language in the team channel; automatic translation in the channel handles the rest. Written text translates far better than fast speech, and people writing in a second language can take thirty seconds to get it right.

**The call is for blockers only.** Ten minutes, only people with something to unblock. Fewer speakers, longer turns, more context — which is exactly the shape live translation handles well.

This is not a workaround. Teams with no language barrier at all often end up here for the same reasons.

## If the call has to stay

Sometimes the synchronous standup is doing social work that a channel post does not replace. In that case:

1. **Go round in a fixed order.** Removing the question "who goes next" removes most of the overlap.
2. **Ban interjection during updates.** Comments go in the chat and get picked up after.
3. **Put ticket numbers and service names in the chat**, not only spoken. These are what mistranslate worst and they are trivially typed.
4. **Build a glossary** of your service names, internal acronyms and product terms if your tooling supports one. This is the highest-leverage single step.
5. **Accept a longer meeting.** If you add translation and keep the same time box, you have just cut the amount of information exchanged.

## Check what your platform can actually do

Standups usually involve several languages, ad hoc scheduling, and sometimes external contractors — which is the exact combination native tooling handles worst:

- **Google Meet supports one language pair per meeting.** A team with Polish, Spanish and German speakers cannot use it for this, at any price.
- **Teams Interpreter** covers 10 languages, requires **Microsoft 365 Copilot** rather than Teams Premium, and **is not available in ad hoc meetings** — which most standups are.
- **Zoom** produces translated captions only. For a fast-moving standup, reading captions while trying to speak is worse than it sounds.

If your team is two languages, English on one side, on Meet, and the standup is a scheduled recurring event, the native option may genuinely work. Test it for a week before buying anything.

## The honest version

Most teams that report a language problem in standups have a **meeting design** problem that the language barrier exposed. Fifteen people giving verbal status to an audience of fifteen was never efficient. It just used to be tolerable.
