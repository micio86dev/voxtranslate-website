/**
 * Bundled seed posts. Used as the build-time fallback when PocketBase is not
 * reachable (e.g. local `pnpm build` with no CMS, or first deploy). When
 * POCKETBASE_URL is set and reachable these are overridden by live content.
 * Keep IDs/slugs in sync with migrations/pb_migrations seed data.
 */
import type { RawPost } from '../lib/pocketbase';

export const FALLBACK_POSTS: RawPost[] = [
  {
    id: 'seed-how-it-works',
    title: 'How VoxTranslate works: real-time multilingual voice translation explained',
    slug: 'how-voxtranslate-works',
    excerpt:
      'A look under the hood at the pipeline that turns your voice into live, translated speech for everyone in the call — and the four engine tiers that power it.',
    author: 'VoxTranslate Team',
    published_at: '2026-05-12T09:00:00.000Z',
    updated: '2026-05-12T09:00:00.000Z',
    lang: 'en',
    tags: ['Product', 'Technology'],
    cover: '/blog/how-voxtranslate-works.svg',
    content: `
<p>VoxTranslate lets people who don't share a language hold a normal video conversation. You speak; everyone else reads — and, on the higher tiers, hears — your words in their own language, live. This post walks through what actually happens between the moment you talk and the moment someone on the other side understands you.</p>

<h2>The real-time pipeline</h2>
<p>Every call runs the same four-stage loop, continuously, for each speaker:</p>
<ol>
  <li><strong>Capture.</strong> Your browser streams short, low-latency audio chunks using the Opus codec — no plugins, no native app.</li>
  <li><strong>Transcribe.</strong> Streaming speech recognition turns that audio into text as you speak, with the source language detected automatically or set by you.</li>
  <li><strong>Translate.</strong> The transcript is translated in parallel into every language present in the room, so a four-person call in four languages is handled at once.</li>
  <li><strong>Deliver.</strong> Each listener sees live subtitles in their chosen language. On higher tiers they also hear a natural spoken translation.</li>
</ol>

<h3>Why peer-to-peer matters</h3>
<p>The video and audio you share with other participants travel directly between browsers over WebRTC, in a mesh of up to four people. Your media isn't recorded or routed through a central server — the server's job is signaling, running the translation pipeline, and relaying chat. Less hops means lower latency and a smaller privacy surface.</p>

<h2>The four engine tiers</h2>
<p>Not every conversation needs the same trade-off between speed, voice quality and cost, so VoxTranslate lets you pick an engine per call.</p>

<h3>Standard</h3>
<p>The default. Fast, economical streaming recognition with live translated subtitles and a built-in browser voice. Perfect for everyday chats where you mainly read along.</p>

<h3>Enhanced</h3>
<p>A client-direct streaming path tuned for ultra-low latency — roughly sub-250-millisecond responsiveness — across a wide set of languages. Ideal for fast, natural back-and-forth where every pause counts.</p>

<h3>Pro</h3>
<p>Live AI translation with a natural synthesized voice. This is the sweet spot for meetings and demos: high quality, a real spoken translation in the listener's ear, and a balanced cost. It's the tier most people reach for.</p>

<h3>Premium</h3>
<p>The highest-fidelity option, with a natural AI voice and the broadest coverage — all 84 supported languages. Built for high-stakes conversations where accuracy and nuance are worth the premium.</p>

<h2>A note on AI output</h2>
<p>Transcription and translation are produced by AI systems and can contain mistakes. The spoken translation you hear is computer-generated — it is not a recording of the speaker's voice. VoxTranslate is built for everyday communication, not for critical legal, medical or safety decisions.</p>

<h2>Try it yourself</h2>
<p>The fastest way to understand the pipeline is to feel it. Open a room, pick your language, and have a one-minute conversation with someone in another. You'll see your words become subtitles — and hear them become speech — in real time.</p>
`,
  },
  {
    id: 'seed-choosing-tier',
    title: 'Choosing the right translation tier for your use case',
    slug: 'choosing-the-right-translation-tier',
    excerpt:
      'Standard, Enhanced, Pro or Premium? A practical guide to picking the VoxTranslate engine that fits your conversation, your latency needs and your budget.',
    author: 'VoxTranslate Team',
    published_at: '2026-05-26T09:00:00.000Z',
    updated: '2026-05-26T09:00:00.000Z',
    lang: 'en',
    tags: ['Guides', 'Product'],
    cover: '/blog/choosing-the-right-translation-tier.svg',
    content: `
<p>VoxTranslate gives you four translation engines and lets you switch between them per call. That flexibility is powerful, but it also raises a fair question: which one should you actually use? Here's how to decide in under a minute.</p>

<h2>Start with the conversation, not the tier</h2>
<p>The best engine depends less on the technology and more on what the conversation is for. Ask yourself three things: How much does latency matter? Do listeners need to <em>hear</em> a natural voice, or is reading subtitles enough? And how many languages need to be covered?</p>

<h2>The tiers at a glance</h2>

<h3>Standard — everyday, read-along chats</h3>
<p>Choose Standard when subtitles are the main event and budget matters. Streaming recognition plus a built-in browser voice keeps it fast and economical. Great for casual catch-ups, community rooms and quick coordination.</p>

<h3>Enhanced — fast, natural back-and-forth</h3>
<p>When the rhythm of the conversation matters — interviews, negotiations, lively group calls — Enhanced's client-direct path delivers roughly sub-250-millisecond responsiveness across a broad language set. Pick it when waiting even half a second would break the flow.</p>

<h3>Pro — meetings and demos</h3>
<p>Pro adds a natural AI voice on top of live translation, so listeners hear a smooth spoken translation rather than a robotic one. It's the balanced choice for client meetings, product demos and webinars — enough polish to feel professional without the top-tier cost. For most teams, this is the default upgrade.</p>

<h3>Premium — high-stakes, every language</h3>
<p>Premium is the highest-fidelity tier, with a natural voice and full coverage of all 84 languages. Reach for it when nuance is non-negotiable: sensitive discussions, cross-cultural negotiations, or any call where a misunderstanding is expensive.</p>

<h2>How billing fits in</h2>
<p>VoxTranslate is credit-based: you start with free credits and top up as you go, with no subscription. Higher tiers cost more per minute of speech because the underlying models do more work, so a practical strategy is to default to Standard or Enhanced and switch up to Pro or Premium for the calls that truly warrant it.</p>

<h3>A simple rule of thumb</h3>
<ul>
  <li><strong>Just need to understand each other?</strong> Standard.</li>
  <li><strong>Need it to feel instant?</strong> Enhanced.</li>
  <li><strong>Presenting to others?</strong> Pro.</li>
  <li><strong>Can't afford to be misunderstood?</strong> Premium.</li>
</ul>

<h2>You're not locked in</h2>
<p>Because you choose the engine at the start of each call, you can experiment cheaply. Try a Standard call today, switch to Pro for your next meeting, and let the results decide.</p>
`,
  },
  {
    id: 'seed-vs-interpreters',
    title: 'VoxTranslate vs traditional interpreters: speed, cost, and quality',
    slug: 'voxtranslate-vs-traditional-interpreters',
    excerpt:
      'How does live AI translation compare to hiring a human interpreter? An honest look at where each one wins on availability, cost, latency and nuance.',
    author: 'VoxTranslate Team',
    published_at: '2026-06-09T09:00:00.000Z',
    updated: '2026-06-09T09:00:00.000Z',
    lang: 'en',
    tags: ['Comparisons', 'Guides'],
    cover: '/blog/voxtranslate-vs-traditional-interpreters.svg',
    content: `
<p>Human interpreters are remarkable. They carry tone, idiom and cultural context in ways software is still catching up to. So when does it make sense to use a tool like VoxTranslate instead? The honest answer: it depends on the conversation. Here's a clear-eyed comparison.</p>

<h2>Availability</h2>
<p>A professional interpreter has to be booked, scheduled and matched to your exact language pair — often days in advance, and rarely at 11pm on a Sunday. VoxTranslate is there the moment you open a room, in any of 84 languages, with no booking. For spontaneous and global-by-default conversations, instant availability is the single biggest difference.</p>

<h2>Cost</h2>
<p>Interpreters typically bill by the hour, often with minimums, and a single rare language pair can be expensive. VoxTranslate is credit-based: you start with free credits, pay only for the minutes you actually speak, and choose a cheaper or pricier engine per call. For short, frequent or unpredictable conversations, the cost difference is dramatic.</p>

<h2>Speed and latency</h2>
<p>Skilled simultaneous interpreters are fast, but they still introduce a delay, and consecutive interpreting roughly doubles the length of a conversation. VoxTranslate's Enhanced tier targets roughly sub-250-millisecond responsiveness, and subtitles appear as you speak — so the back-and-forth stays tight.</p>

<h2>Quality and nuance</h2>
<p>This is where humans still shine. A great interpreter handles sarcasm, legal precision and emotional subtext with judgment that AI doesn't fully match. VoxTranslate's Premium tier closes a lot of the gap with high-fidelity translation and a natural voice, but AI output can still contain errors.</p>

<h3>Where AI clearly wins</h3>
<ul>
  <li><strong>Multi-language rooms.</strong> One interpreter handles one language pair; VoxTranslate translates into every language in the room at once.</li>
  <li><strong>On-demand and after-hours.</strong> No scheduling, no minimums.</li>
  <li><strong>Cost at scale.</strong> Many short conversations are far cheaper.</li>
</ul>

<h3>Where humans clearly win</h3>
<ul>
  <li><strong>Legal, medical and safety-critical settings</strong>, where a mistranslation carries real consequences.</li>
  <li><strong>High-nuance diplomacy and negotiation</strong>, where tone and cultural framing decide the outcome.</li>
  <li><strong>Certified interpretation</strong> required by law or policy.</li>
</ul>

<h2>The practical takeaway</h2>
<p>It isn't really either/or. Use VoxTranslate for the vast majority of everyday cross-language conversations — standups, sales calls, support, community, travel — where speed and availability matter most. Bring in a professional interpreter for the high-stakes moments where certified, human nuance is essential. VoxTranslate even helps there: use it for the prep calls, and save the interpreter for the room that counts.</p>

<p><em>A reminder: VoxTranslate's translations are AI-generated and shouldn't be relied on for critical legal, medical or safety decisions.</em></p>
`,
  },
];
