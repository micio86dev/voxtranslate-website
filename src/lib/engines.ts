/**
 * Translation-engine catalogue.
 *
 * Read from a COMMITTED snapshot (`src/data/engines.json`), not fetched at build time.
 *
 * The per-minute rate is server-owned (`cost × (1 + markup)`, see
 * `server/src/engine/metadata.rs`), so it must not be retyped into the five
 * `src/i18n/*.json` files — they would drift the moment a markup env var changes, and a
 * marketing site quoting a price the app does not charge is worse than no pricing page.
 *
 * The first version of this fetched `GET /api/engines` during the build. It worked
 * locally and returned **403 in CI**: `api.voxtranslate.app` is behind the Cloudflare WAF
 * and Bot Fight Mode (runbook 111), and a GitHub Actions runner is precisely the
 * datacenter traffic that is designed to stop. Every production page shipped the
 * "indicative prices" fallback banner as a result.
 *
 * Opening the WAF so a static site can build was the wrong trade — it weakens the origin's
 * protection to serve a marketing convenience, and it makes website deploys fail during a
 * WAF incident. One committed file, refreshed deliberately, keeps the single source of
 * truth without the build depending on the production perimeter.
 *
 * To refresh: `node scripts/refresh-engines.mjs`, review the diff, commit.
 */
import catalogue from '../data/engines.json';

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
  /**
   * USD per minute, per target language. Consumer billing is USD
   * (`server/src/stripe_handler.rs` → `currency: "usd"`), 1 credit = $1.
   */
  rate_per_minute: number;
  input_languages: string[];
  output_languages: string[];
  capabilities: EngineCapabilities;
}

/** Cheapest tier first — the order the pricing page and the homepage both render. */
export const ENGINES: Engine[] = catalogue.engines as Engine[];

/** ISO date the committed catalogue was last refreshed from the API. */
export const CATALOGUE_DATE: string = catalogue.fetchedAt;

/**
 * Format a per-minute USD rate. Rates run to four decimals ($0.0045), so the usual
 * two-decimal currency format would render the cheapest tier as "$0.00".
 *
 * Floating-point rates arrive from the API as e.g. 0.06659999999999999; toFixed rounds
 * them back to the intended 0.0666.
 */
export function formatRate(rate: number): string {
  return `$${rate.toFixed(4)}`;
}

/** Cost of a call of `minutes` into `languages` target languages, e.g. "$0.27". */
export function formatCallCost(rate: number, minutes: number, languages = 1): string {
  return `$${(rate * minutes * languages).toFixed(2)}`;
}

/** Welcome credits granted on signup — `FREE_CREDITS` in the server config (USD). */
export const FREE_CREDITS = 2;

/** How long the free starter credit lasts on a tier, in whole minutes. */
export function freeMinutes(rate: number, freeCredits = FREE_CREDITS): number {
  return Math.floor(freeCredits / rate);
}
