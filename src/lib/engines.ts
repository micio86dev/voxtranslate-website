/**
 * Live translation-engine catalogue, read from the API at BUILD time.
 *
 * The per-minute rate is server-owned (`cost × (1 + markup)`, see
 * `server/src/engine/metadata.rs`). Copying it into `src/i18n/*.json` would mean
 * five files drifting away from the server the moment a markup env var changes —
 * and a marketing site quoting a price the app does not charge is the one SEO
 * asset that is worse than having no pricing page at all.
 *
 * So the site is built against `GET /api/engines`, the same public DTO the app
 * itself renders. The site is fully static, so this runs once per deploy: a price
 * change ships with the next website build, not on a stale cache.
 *
 * `FALLBACK` exists only so an API blip cannot break a deploy. It is deliberately
 * the *current* production catalogue, and `enginesAreStale()` lets the page tell
 * the reader it is showing indicative pricing rather than silently lying.
 */
import { API_BASE } from './site';

export type EngineTier = 'standard' | 'enhanced' | 'premium';

export interface EngineCapabilities {
  /** The engine streams translated audio (not just subtitles + local TTS). */
  translated_audio: boolean;
  /**
   * The per-minute rate is charged once PER TARGET LANGUAGE in the room.
   * True of every server-side tier. Rendering a rate without saying this is a
   * pricing-transparency bug — see the note in `engine/metadata.rs`.
   */
  cost_scales_per_language: boolean;
  /** The browser streams straight to the provider; audio never touches our servers. */
  client_direct: boolean;
  max_room_size: number;
}

export interface Engine {
  id: string;
  display_name: string;
  tier: EngineTier;
  description: string;
  /** USD per minute, per target language. Consumer billing is USD
   *  (`server/src/stripe_handler.rs` → `currency: "usd"`), 1 credit = $1. */
  rate_per_minute: number;
  input_languages: string[];
  output_languages: string[];
  capabilities: EngineCapabilities;
}

/**
 * Production catalogue as of the last verified fetch. Used only when the API is
 * unreachable during a build.
 */
const FALLBACK: Engine[] = [
  {
    id: 'standard',
    display_name: 'Standard',
    tier: 'standard',
    description: 'Natural speech-to-speech translation by Qwen LiveTranslate.',
    rate_per_minute: 0.0045,
    input_languages: new Array(29).fill('') as string[],
    output_languages: new Array(29).fill('') as string[],
    capabilities: {
      translated_audio: true,
      cost_scales_per_language: true,
      client_direct: false,
      max_room_size: 4,
    },
  },
  {
    id: 'cartesia',
    display_name: 'Enhanced',
    tier: 'enhanced',
    description: 'Real-time translation with Cartesia — natural voice and voice cloning.',
    rate_per_minute: 0.0666,
    input_languages: new Array(61).fill('') as string[],
    output_languages: new Array(61).fill('') as string[],
    capabilities: {
      translated_audio: false,
      cost_scales_per_language: true,
      client_direct: true,
      max_room_size: 4,
    },
  },
  {
    id: 'gemini_live_translate',
    display_name: 'Premium',
    tier: 'premium',
    description: 'Natural speech-to-speech translation by Google Gemini 3.5 Live.',
    rate_per_minute: 0.0684,
    input_languages: new Array(84).fill('') as string[],
    output_languages: new Array(84).fill('') as string[],
    capabilities: {
      translated_audio: true,
      cost_scales_per_language: true,
      client_direct: false,
      max_room_size: 4,
    },
  },
];

/** Tier display order — cheapest first, which is also the order of the page. */
const TIER_ORDER: EngineTier[] = ['standard', 'enhanced', 'premium'];

let stale = false;

/** True when the last {@link getEngines} call fell back to the baked catalogue. */
export function enginesAreStale(): boolean {
  return stale;
}

let cached: Engine[] | null = null;

/**
 * Fetch the live engine catalogue. Memoised for the build: Astro renders one page
 * per locale and they must all quote the same numbers.
 */
export async function getEngines(): Promise<Engine[]> {
  if (cached) return cached;

  try {
    const res = await fetch(`${API_BASE}/api/engines`, {
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const body = (await res.json()) as { engines?: Engine[] };
    const engines = body.engines?.filter((e) => TIER_ORDER.includes(e.tier)) ?? [];
    if (engines.length === 0) throw new Error('empty catalogue');

    stale = false;
    cached = sortByTier(engines);
    return cached;
  } catch (err) {
    // A deploy must not fail because the API blinked; the page degrades to
    // "indicative pricing" instead. Loud in the build log so it is not silent.
    console.warn(
      `[engines] falling back to the baked catalogue: ${err instanceof Error ? err.message : err}`,
    );
    stale = true;
    cached = FALLBACK;
    return cached;
  }
}

function sortByTier(engines: Engine[]): Engine[] {
  return [...engines].sort((a, b) => TIER_ORDER.indexOf(a.tier) - TIER_ORDER.indexOf(b.tier));
}

/**
 * Format a per-minute USD rate. Rates run to four decimals ($0.0045), so the
 * usual two-decimal currency format would render the cheapest tier as "$0.00".
 */
export function formatRate(rate: number): string {
  return `$${rate.toFixed(4)}`;
}

/** Cost of a call of `minutes` into `languages` target languages, e.g. "$0.27". */
export function formatCallCost(rate: number, minutes: number, languages = 1): string {
  const total = rate * minutes * languages;
  return total >= 1 ? `$${total.toFixed(2)}` : `$${total.toFixed(2)}`;
}

/** How long the free starter credit lasts on a tier, in whole minutes. */
export function freeMinutes(rate: number, freeCredits = FREE_CREDITS): number {
  return Math.floor(freeCredits / rate);
}

/** Welcome credits granted on signup — `FREE_CREDITS` in the server config (USD). */
export const FREE_CREDITS = 2;
