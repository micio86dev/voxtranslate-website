/**
 * Lightweight i18n over src/i18n/*.json.
 *
 * URLs are locale-prefixed (/en/…, /it/…). `useTranslations(lang)` returns a
 * `t(key, vars?)` lookup with dot-path keys, {var} interpolation, and graceful
 * fallback to English for any missing key.
 */
import en from '../i18n/en.json';
import it from '../i18n/it.json';
import es from '../i18n/es.json';
import de from '../i18n/de.json';
import fr from '../i18n/fr.json';

export const LOCALES = ['en', 'it', 'es', 'de', 'fr'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'en';

export const LOCALE_NAMES: Record<Locale, string> = {
  en: 'English',
  it: 'Italiano',
  es: 'Español',
  de: 'Deutsch',
  fr: 'Français',
};

export const LOCALE_FLAGS: Record<Locale, string> = {
  en: '🇬🇧',
  it: '🇮🇹',
  es: '🇪🇸',
  de: '🇩🇪',
  fr: '🇫🇷',
};

/** OpenGraph locale codes for <meta property="og:locale">. */
export const OG_LOCALES: Record<Locale, string> = {
  en: 'en_US',
  it: 'it_IT',
  es: 'es_ES',
  de: 'de_DE',
  fr: 'fr_FR',
};

type Dict = Record<string, unknown>;
const DICTS: Record<Locale, Dict> = { en, it, es, de, fr };

export function isLocale(value: string | undefined): value is Locale {
  return !!value && (LOCALES as readonly string[]).includes(value);
}

function lookup(dict: Dict, key: string): unknown {
  return key.split('.').reduce<unknown>((acc, part) => {
    if (acc && typeof acc === 'object' && part in (acc as Dict)) {
      return (acc as Dict)[part];
    }
    return undefined;
  }, dict);
}

function interpolate(str: string, vars?: Record<string, string | number>): string {
  if (!vars) return str;
  return str.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m));
}

/** Returns a translator bound to `lang`, falling back to English. */
export function useTranslations(lang: Locale) {
  const dict = DICTS[lang] ?? DICTS[DEFAULT_LOCALE];
  return function t(key: string, vars?: Record<string, string | number>): string {
    const value = lookup(dict, key) ?? lookup(DICTS[DEFAULT_LOCALE], key);
    if (typeof value === 'string') return interpolate(value, vars);
    return key; // surfaces missing keys instead of crashing
  };
}

/** Raw (typed-unknown) access for arrays/objects, e.g. feature lists. */
export function tList<T = unknown>(lang: Locale, key: string): T[] {
  const value = lookup(DICTS[lang] ?? {}, key) ?? lookup(DICTS[DEFAULT_LOCALE], key);
  return Array.isArray(value) ? (value as T[]) : [];
}

/** Build a locale-prefixed path (trailing slash): localizePath('it','blog') -> '/it/blog/'. */
export function localizePath(lang: Locale, path = ''): string {
  const clean = path.replace(/^\/+/, '').replace(/\/+$/, '');
  return clean ? `/${lang}/${clean}/` : `/${lang}/`;
}

/** Extract the locale from a pathname; returns DEFAULT_LOCALE if none matches. */
export function localeFromPath(pathname: string): Locale {
  const seg = pathname.split('/').filter(Boolean)[0];
  return isLocale(seg) ? seg : DEFAULT_LOCALE;
}
