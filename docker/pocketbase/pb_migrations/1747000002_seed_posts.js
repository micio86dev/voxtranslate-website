/// <reference path="../pb_data/types.d.ts" />

// Seed the three launch posts (English). Mirrors src/data/fallback-posts.ts so
// production shows real content the moment PocketBase comes online.
migrate(
  (db) => {
    const dao = new Dao(db);
    const collection = dao.findCollectionByNameOrId('posts');

    const posts = [
      {
        title: 'How VoxTranslate works: real-time multilingual voice translation explained',
        slug: 'how-voxtranslate-works',
        excerpt:
          "A look under the hood at the pipeline that turns your voice into live, translated speech for everyone in the call — and the four engine tiers that power it.",
        author: 'VoxTranslate Team',
        published_at: '2026-05-12 09:00:00.000Z',
        lang: 'en',
        tags: ['Product', 'Technology'],
        content: `
<p>VoxTranslate lets people who don't share a language hold a normal video conversation. You speak; everyone else reads — and, on the higher tiers, hears — your words in their own language, live. This post walks through what actually happens between the moment you talk and the moment someone on the other side understands you.</p>
<h2>The real-time pipeline</h2>
<p>Every call runs the same four-stage loop, continuously, for each speaker:</p>
<ol>
  <li><strong>Capture.</strong> Your browser streams short, low-latency audio chunks using the Opus codec — no plugins, no native app.</li>
  <li><strong>Transcribe.</strong> Streaming speech recognition turns that audio into text as you speak, with the source language detected automatically or set by you.</li>
  <li><strong>Translate.</strong> The transcript is translated in parallel into every language present in the room.</li>
  <li><strong>Deliver.</strong> Each listener sees live subtitles in their chosen language. On higher tiers they also hear a natural spoken translation.</li>
</ol>
<h3>Why peer-to-peer matters</h3>
<p>The video and audio you share travel directly between browsers over WebRTC, in a mesh of up to four people. Your media isn't recorded or routed through a central server — the server handles signaling, translation and chat relay. Fewer hops means lower latency and a smaller privacy surface.</p>
<h2>The four engine tiers</h2>
<p>Not every conversation needs the same trade-off between speed, voice quality and cost, so VoxTranslate lets you pick an engine per call.</p>
<h3>Standard</h3>
<p>The default. Fast, economical streaming recognition with live translated subtitles and a built-in browser voice. Perfect for everyday chats.</p>
<h3>Enhanced</h3>
<p>A client-direct streaming path tuned for ultra-low latency — roughly sub-250-millisecond responsiveness — across a wide set of languages. Ideal for fast, natural back-and-forth.</p>
<h3>Pro</h3>
<p>Live AI translation with a natural synthesized voice. The sweet spot for meetings and demos: high quality, a real spoken translation, and a balanced cost.</p>
<h3>Premium</h3>
<p>The highest-fidelity option, with a natural AI voice and the broadest coverage — all 84 supported languages. Built for high-stakes conversations.</p>
<h2>A note on AI output</h2>
<p>Transcription and translation are produced by AI and can contain mistakes. The spoken translation you hear is computer-generated — not a recording of the speaker. VoxTranslate is built for everyday communication, not for critical legal, medical or safety decisions.</p>
<h2>Try it yourself</h2>
<p>The fastest way to understand the pipeline is to feel it. Open a room, pick your language, and have a one-minute conversation with someone in another.</p>`,
      },
      {
        title: 'Choosing the right translation tier for your use case',
        slug: 'choosing-the-right-translation-tier',
        excerpt:
          'Standard, Enhanced, Pro or Premium? A practical guide to picking the VoxTranslate engine that fits your conversation, your latency needs and your budget.',
        author: 'VoxTranslate Team',
        published_at: '2026-05-26 09:00:00.000Z',
        lang: 'en',
        tags: ['Guides', 'Product'],
        content: `
<p>VoxTranslate gives you four translation engines and lets you switch between them per call. That flexibility is powerful, but it raises a fair question: which one should you actually use? Here's how to decide in under a minute.</p>
<h2>Start with the conversation, not the tier</h2>
<p>The best engine depends less on the technology and more on what the conversation is for. Ask yourself: How much does latency matter? Do listeners need to <em>hear</em> a natural voice, or is reading enough? And how many languages need coverage?</p>
<h2>The tiers at a glance</h2>
<h3>Standard — everyday, read-along chats</h3>
<p>Choose Standard when subtitles are the main event and budget matters. Fast and economical. Great for casual catch-ups and quick coordination.</p>
<h3>Enhanced — fast, natural back-and-forth</h3>
<p>When the rhythm of the conversation matters — interviews, negotiations, lively group calls — Enhanced's client-direct path delivers roughly sub-250-millisecond responsiveness.</p>
<h3>Pro — meetings and demos</h3>
<p>Pro adds a natural AI voice on top of live translation. The balanced choice for client meetings, demos and webinars. For most teams, this is the default upgrade.</p>
<h3>Premium — high-stakes, every language</h3>
<p>Premium is the highest-fidelity tier, with a natural voice and full coverage of all 84 languages. Reach for it when nuance is non-negotiable.</p>
<h2>How billing fits in</h2>
<p>VoxTranslate is credit-based: start with free credits and top up as you go, no subscription. Higher tiers cost more per minute of speech, so default to Standard or Enhanced and switch up for the calls that warrant it.</p>
<h3>A simple rule of thumb</h3>
<ul>
  <li><strong>Just need to understand each other?</strong> Standard.</li>
  <li><strong>Need it to feel instant?</strong> Enhanced.</li>
  <li><strong>Presenting to others?</strong> Pro.</li>
  <li><strong>Can't afford to be misunderstood?</strong> Premium.</li>
</ul>
<h2>You're not locked in</h2>
<p>Because you choose the engine at the start of each call, you can experiment cheaply. Try Standard today, switch to Pro for your next meeting, and let the results decide.</p>`,
      },
      {
        title: 'VoxTranslate vs traditional interpreters: speed, cost, and quality',
        slug: 'voxtranslate-vs-traditional-interpreters',
        excerpt:
          'How does live AI translation compare to hiring a human interpreter? An honest look at where each one wins on availability, cost, latency and nuance.',
        author: 'VoxTranslate Team',
        published_at: '2026-06-09 09:00:00.000Z',
        lang: 'en',
        tags: ['Comparisons', 'Guides'],
        content: `
<p>Human interpreters are remarkable. They carry tone, idiom and cultural context in ways software is still catching up to. So when does a tool like VoxTranslate make sense instead? The honest answer: it depends on the conversation.</p>
<h2>Availability</h2>
<p>A professional interpreter has to be booked, scheduled and matched to your exact language pair. VoxTranslate is there the moment you open a room, in any of 84 languages, with no booking.</p>
<h2>Cost</h2>
<p>Interpreters bill by the hour, often with minimums. VoxTranslate is credit-based: start with free credits, pay only for the minutes you speak, and choose a cheaper or pricier engine per call.</p>
<h2>Speed and latency</h2>
<p>Skilled simultaneous interpreters are fast, but consecutive interpreting roughly doubles a conversation's length. VoxTranslate's Enhanced tier targets roughly sub-250-millisecond responsiveness, with subtitles as you speak.</p>
<h2>Quality and nuance</h2>
<p>This is where humans still shine — sarcasm, legal precision and emotional subtext. Premium closes much of the gap with high-fidelity translation and a natural voice, but AI output can still contain errors.</p>
<h3>Where AI clearly wins</h3>
<ul>
  <li><strong>Multi-language rooms.</strong> One interpreter handles one pair; VoxTranslate translates into every language at once.</li>
  <li><strong>On-demand and after-hours.</strong> No scheduling, no minimums.</li>
  <li><strong>Cost at scale.</strong> Many short conversations are far cheaper.</li>
</ul>
<h3>Where humans clearly win</h3>
<ul>
  <li><strong>Legal, medical and safety-critical settings.</strong></li>
  <li><strong>High-nuance diplomacy and negotiation.</strong></li>
  <li><strong>Certified interpretation</strong> required by law or policy.</li>
</ul>
<h2>The practical takeaway</h2>
<p>It isn't really either/or. Use VoxTranslate for the vast majority of everyday cross-language conversations, and bring in a professional interpreter for the high-stakes moments where certified, human nuance is essential.</p>
<p><em>A reminder: VoxTranslate's translations are AI-generated and shouldn't be relied on for critical legal, medical or safety decisions.</em></p>`,
      },
    ];

    for (const p of posts) {
      const record = new Record(collection);
      record.set('title', p.title);
      record.set('slug', p.slug);
      record.set('excerpt', p.excerpt);
      record.set('content', p.content);
      record.set('author', p.author);
      record.set('published_at', p.published_at);
      record.set('lang', p.lang);
      record.set('tags', p.tags);
      record.set('published', true);
      dao.saveRecord(record);
    }
  },
  (db) => {
    const dao = new Dao(db);
    const slugs = [
      'how-voxtranslate-works',
      'choosing-the-right-translation-tier',
      'voxtranslate-vs-traditional-interpreters',
    ];
    for (const slug of slugs) {
      try {
        const record = dao.findFirstRecordByFilter('posts', `slug = "${slug}"`);
        if (record) dao.deleteRecord(record);
      } catch (_) {
        // already gone
      }
    }
  },
);
