/**
 * Task 01 — the measurement harness.
 *
 * Streams the fixed corpus through the LIVE pipeline and records what actually comes
 * back: time to first translated audio, completion time, and the translation the engine
 * produced verbatim. Nothing here is written by hand or by a model — that is the whole
 * point of the task, and the reason `/latency/` can publish numbers instead of adjectives.
 *
 * Protocol, read from the server rather than guessed (server/src/lib.rs `ws_handler`,
 * server/src/protocol.rs, server/tests/integration.rs::audio_produces_subtitles):
 *
 *   1. Two WebSockets to `/ws?room=&lang=&id=&name=` — a listener on the TARGET language
 *      and a speaker on the SOURCE language. `lang` is the peer's own language.
 *   2. Speaker sends `{"type":"start"}`, then raw PCM16 mono @ 24 kHz as binary frames in
 *      100 ms chunks, PACED IN REAL TIME. Blasting the clip at once reads as one
 *      impossibly fast utterance and turn detection never fires.
 *   3. The listener receives `translated_audio` frames ({speaker_id, lang, seq, pcm16_b64})
 *      and a `subtitle_final` ({original, translations{}}).
 *
 * TTFA is measured from the END of the speaker's audio to the FIRST `translated_audio`
 * frame — which deliberately includes the engine's own end-of-turn detection, because a
 * listener waiting in a conversation experiences that delay too.
 *
 * Usage:
 *   node --experimental-strip-types scripts/measure-pairs.ts --validate --audio <file.pcm> \
 *why        --source it --target en
 *   node --experimental-strip-types scripts/measure-pairs.ts --pair english-to-german \
 *        --ttfa-target-ms 1500
 */
import { readFileSync, existsSync, mkdirSync, writeFileSync, readdirSync } from 'node:fs';
import { argv, env, exit } from 'node:process';

/* -- config --------------------------------------------------------------- */

const API_BASE = env.MEASURE_API_BASE ?? 'wss://api.voxtranslate.app';
const SAMPLE_RATE = 24_000;
const BYTES_PER_SAMPLE = 2;
const CHUNK_MS = 100;
const BYTES_PER_CHUNK = (SAMPLE_RATE * BYTES_PER_SAMPLE * CHUNK_MS) / 1000;

/** How long to wait after the audio ends before giving up on a response. */
const RESPONSE_TIMEOUT_MS = 20_000;
/** Silence after the clip so end-of-turn detection fires (mirrors the integration test). */
const TRAILING_SILENCE_MS = 1_500;

const CORPUS_DIR = new URL('../src/data/corpus/', import.meta.url);
const AUDIO_DIR = new URL('../src/data/corpus/audio/', import.meta.url);
const OUT_DIR = new URL('../src/data/measurements/', import.meta.url);

/* -- args ----------------------------------------------------------------- */

function arg(name: string): string | undefined {
  const i = argv.indexOf(`--${name}`);
  return i === -1 ? undefined : argv[i + 1];
}
const has = (name: string) => argv.includes(`--${name}`);

/* -- types ---------------------------------------------------------------- */

interface Utterance {
  id: string;
  /** Absolute path to raw PCM16 mono @ 24 kHz. */
  audio: URL;
  /** What the speaker said, for the record. */
  text: string;
}

interface Sample {
  id: string;
  ttfaMs: number | null;
  completionMs: number | null;
  produced: string | null;
}

/* -- one utterance through the live pipeline ------------------------------ */

async function measureOne(
  utt: Utterance,
  source: string,
  target: string,
  room: string,
): Promise<Sample> {
  const audio = readFileSync(utt.audio);
  const listener = new WebSocket(
    `${API_BASE}/ws?room=${room}&lang=${target}&id=l-${utt.id}&name=harness-listener`,
  );
  const speaker = new WebSocket(
    `${API_BASE}/ws?room=${room}&lang=${source}&id=s-${utt.id}&name=harness-speaker`,
  );

  let firstAudioAt: number | null = null;
  let lastAudioAt: number | null = null;
  let produced: string | null = null;
  let utteranceEndAt = 0;

  const done = new Promise<void>((resolve) => {
    const timer = setTimeout(resolve, RESPONSE_TIMEOUT_MS + TRAILING_SILENCE_MS);
    listener.addEventListener('message', (ev: MessageEvent) => {
      if (typeof ev.data !== 'string') return;
      let msg: Record<string, unknown>;
      try {
        msg = JSON.parse(ev.data);
      } catch {
        return;
      }
      if (msg.type === 'translated_audio' && msg.speaker_id === `s-${utt.id}`) {
        const now = performance.now();
        firstAudioAt ??= now;
        lastAudioAt = now;
      }
      if (msg.type === 'subtitle_final' && msg.speaker_id === `s-${utt.id}`) {
        const t = msg.translations as Record<string, string> | undefined;
        produced = t?.[target] ?? null;
        // The subtitle is final, but audio frames may still be arriving; give them a
        // moment before closing, or completion time is truncated by our own impatience.
        setTimeout(() => {
          clearTimeout(timer);
          resolve();
        }, 2_000);
      }
    });
  });

  await Promise.all([opened(listener), opened(speaker)]);
  speaker.send(JSON.stringify({ type: 'start' }));
  await sleep(150);

  for (let off = 0; off < audio.length; off += BYTES_PER_CHUNK) {
    speaker.send(audio.subarray(off, off + BYTES_PER_CHUNK));
    await sleep(CHUNK_MS);
  }
  // The utterance is over HERE. Everything after this is the pipeline's latency, which
  // is exactly what we are measuring — including its end-of-turn detection.
  utteranceEndAt = performance.now();

  await sleep(TRAILING_SILENCE_MS);
  speaker.send(JSON.stringify({ type: 'stop' }));

  await done;
  listener.close();
  speaker.close();

  return {
    id: utt.id,
    ttfaMs: firstAudioAt === null ? null : Math.round(firstAudioAt - utteranceEndAt),
    completionMs: lastAudioAt === null ? null : Math.round(lastAudioAt - utteranceEndAt),
    produced,
  };
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function opened(ws: WebSocket): Promise<void> {
  return new Promise((resolve, reject) => {
    if (ws.readyState === WebSocket.OPEN) return resolve();
    ws.addEventListener('open', () => resolve(), { once: true });
    ws.addEventListener('error', () => reject(new Error('websocket failed to open')), {
      once: true,
    });
  });
}

/* -- statistics ----------------------------------------------------------- */

/** Nearest-rank percentile. p95 of 48 samples is the 46th — an actual observation,
 *  not an interpolation between two that never happened. */
function percentile(values: number[], p: number): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const rank = Math.ceil((p / 100) * sorted.length);
  return sorted[Math.min(rank, sorted.length) - 1];
}

/* -- validate mode -------------------------------------------------------- */

async function validate(): Promise<void> {
  const file = arg('audio');
  const source = arg('source') ?? 'it';
  const target = arg('target') ?? 'en';
  if (!file || !existsSync(file)) {
    console.error('--validate needs --audio <raw PCM16 mono 24kHz file>');
    exit(1);
  }
  console.log(`validating harness against ${API_BASE}`);
  console.log(`  ${source} → ${target}, clip: ${file}`);

  const sample = await measureOne(
    { id: 'validate', audio: new URL(`file://${file}`), text: '(fixture)' },
    source,
    target,
    `harness-validate-${Date.now()}`,
  );

  console.log('\nresult:');
  console.log(`  time to first audio : ${sample.ttfaMs ?? 'NO AUDIO RECEIVED'} ms`);
  console.log(`  completion          : ${sample.completionMs ?? '—'} ms`);
  console.log(`  produced translation: ${sample.produced ?? 'NONE'}`);

  if (sample.ttfaMs === null && sample.produced === null) {
    console.error(
      '\n✗ nothing came back. The harness is not measuring anything — do NOT trust a\n' +
        '  full run until this prints real values. Check API keys and the target language.',
    );
    exit(1);
  }
  if (sample.ttfaMs === null) {
    console.error(
      '\n⚠ a translation came back but NO translated audio. The engine in use may not\n' +
        '  have the translated_audio capability for this pair; TTFA cannot be measured.',
    );
    exit(1);
  }
  console.log('\n✓ harness measures the live pipeline end to end');
}

/* -- full run ------------------------------------------------------------- */

async function run(): Promise<void> {
  const pair = arg('pair');
  const ttfaTarget = arg('ttfa-target-ms');
  if (!pair) {
    console.error('--pair <source>-to-<target> is required');
    exit(1);
  }
  if (!ttfaTarget) {
    // Deliberately no default. The A/B/C boundary decides what the public language
    // matrix claims, so it is a product decision that must be stated, not a constant
    // some script picked. See docs/seo/tasks/01-measurement-harness.md §4.
    console.error(
      '--ttfa-target-ms is required: it is the A/B/C tier boundary published on\n' +
        '/languages/. There is no defensible default — decide it, then pass it.',
    );
    exit(1);
  }
  const [source, target] = pair.split('-to-');
  if (!source || !target) {
    console.error('--pair must look like english-to-german');
    exit(1);
  }

  const phrases = JSON.parse(readFileSync(new URL('business-phrases.json', CORPUS_DIR), 'utf-8'));
  const terms = JSON.parse(readFileSync(new URL('business-terms.json', CORPUS_DIR), 'utf-8'));
  const audioDir = new URL(`${source}/`, AUDIO_DIR);

  if (!existsSync(audioDir)) {
    console.error(
      `no audio for "${source}" at ${audioDir.pathname}\n\n` +
        'The corpus is TEXT; the pipeline takes AUDIO. Generate or record one raw PCM16\n' +
        'mono 24 kHz file per utterance, named <id>.pcm, before running a measurement.\n' +
        'Synthetic speech measures a cleaner input than a real call — if you use it, say\n' +
        'so on /latency/.',
    );
    exit(1);
  }

  const available = new Set(readdirSync(audioDir).filter((f) => f.endsWith('.pcm')));
  const utterances: Utterance[] = [
    ...phrases.phrases.map((p: { id: string; text: string }) => ({
      id: p.id,
      text: p.text,
      audio: new URL(`${p.id}.pcm`, audioDir),
    })),
    ...Object.values(terms.domains)
      .flat()
      .map((t: unknown, i) => {
        const term = (t as { term: string }).term;
        return { id: `term-${i}`, text: term, audio: new URL(`term-${i}.pcm`, audioDir) };
      }),
  ].filter((u) => available.has(u.audio.pathname.split('/').pop()!));

  if (utterances.length === 0) {
    console.error('audio directory exists but contains no utterance matching the corpus');
    exit(1);
  }

  console.log(`measuring ${pair}: ${utterances.length} utterances against ${API_BASE}`);
  const room = `harness-${pair}-${Date.now()}`;
  const samples: Sample[] = [];
  for (const [i, utt] of utterances.entries()) {
    const s = await measureOne(utt, source, target, room);
    samples.push(s);
    process.stdout.write(`\r  ${i + 1}/${utterances.length}  ttfa=${s.ttfaMs ?? '—'}ms   `);
  }
  console.log('');

  const ttfa = samples.map((s) => s.ttfaMs).filter((v): v is number => v !== null);
  const completion = samples
    .map((s) => s.completionMs)
    .filter((v): v is number => v !== null);

  if (ttfa.length === 0) {
    console.error('no translated audio was received for any utterance — refusing to write');
    exit(1);
  }
  if (ttfa.length < samples.length) {
    console.warn(
      `⚠ ${samples.length - ttfa.length} of ${samples.length} utterances produced no audio.\n` +
        '  They are excluded from the percentiles and sampleSize reflects the real count.',
    );
  }

  const p95 = percentile(ttfa, 95);
  // Tier by the rule, not by judgement (task 01 §4). The glossary half of the rule needs
  // human-verified expected translations, which do not exist yet — so this scores the
  // latency half only and says so, rather than inventing an accuracy figure.
  const meetsLatency = p95 <= Number(ttfaTarget);
  const qualityTier = meetsLatency ? 'B' : 'C';

  const out = {
    pair,
    measuredAt: new Date().toISOString(),
    engineVersions: { standard: env.MEASURE_ENGINE_VERSION ?? 'unknown' },
    hardware: env.MEASURE_HARDWARE ?? 'unknown',
    corpusVersion: phrases.version,
    latency: {
      standard: {
        ttfaP50Ms: percentile(ttfa, 50),
        ttfaP95Ms: p95,
        completionP50Ms: percentile(completion, 50),
        sampleSize: ttfa.length,
      },
    },
    qualityTier,
    glossary: samples
      .filter((s) => s.id.startsWith('term-') && s.produced)
      .map((s) => ({ term: s.id, translation: s.produced! })),
    notes: [
      `TTFA measured from end of speaker audio to first translated_audio frame.`,
      `Tier scored on latency only against a ${ttfaTarget} ms p95 target; the glossary`,
      `half of the A/B/C rule needs human-verified expected translations and was not`,
      `scored, so no pair can be rated A until that reference exists.`,
    ],
  };

  mkdirSync(OUT_DIR, { recursive: true });
  const dest = new URL(`${pair}.json`, OUT_DIR);
  writeFileSync(dest, `${JSON.stringify(out, null, 2)}\n`);
  console.log(`\nwrote ${dest.pathname}`);
  console.log(`  p50 ${out.latency.standard.ttfaP50Ms} ms · p95 ${p95} ms · n=${ttfa.length}`);
}

/* -- entry ---------------------------------------------------------------- */

await (has('validate') ? validate() : run());
