// Cloudflare Pages Function — runs before static asset serving.
//   0. Staging guard (env-gated): when STAGING_BASIC_AUTH is set, require HTTP
//      Basic Auth and mark every response noindex. Unset in production ⇒ no-op.
//   1. Canonical-host enforcement: any request to the *.pages.dev subdomain
//      (the permanent project domain + per-deploy <hash> aliases, which can't be
//      deleted) is 301'd to the custom domain, so the site is only reachable —
//      and only indexed — at CANONICAL_HOST. Skipped on staging (own host).
//   2. Language redirect for the bare root: an explicit `vox-lang` cookie wins,
//      otherwise the browser's Accept-Language, otherwise English.
const DEFAULT_CANONICAL_HOST = 'website.voxtranslate.app';

interface Env {
  /** `user:pass` — when set, this deploy is staging: gate it + noindex it. */
  STAGING_BASIC_AUTH?: string;
  /** Overrides the canonical host (staging serves under its own domain). */
  CANONICAL_HOST?: string;
}

// Kept in sync with src/lib/i18n.ts — this function runs outside the Astro build, so it
// cannot import from src/.
const LOCALES = ['en', 'it', 'es', 'de', 'fr'] as const;
type Locale = (typeof LOCALES)[number];
const DEFAULT_LOCALE: Locale = 'en';
/** Where an explicit language choice is remembered (written by LangSwitcher). */
const COOKIE = 'vox-lang';

export async function onRequest(context: EventContext<Env, string, unknown>) {
  const { request, next, env } = context;
  const url = new URL(request.url);
  const staging = !!env.STAGING_BASIC_AUTH;

  // 0. Staging: require Basic Auth before serving anything, and never index.
  if (staging) {
    if (!checkBasicAuth(request, env.STAGING_BASIC_AUTH!)) {
      return new Response('Authentication required.', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="VoxTranslate staging"',
          'X-Robots-Tag': 'noindex, nofollow',
        },
      });
    }
    const res = await next();
    const out = new Response(res.body, res);
    out.headers.set('X-Robots-Tag', 'noindex, nofollow');
    return out;
  }

  // 1. Force the canonical host: bounce any *.pages.dev hostname to the custom
  //    domain (permanent 301), preserving path + query. Makes pages.dev
  //    effectively unreachable and untracked.
  const canonicalHost = env.CANONICAL_HOST || DEFAULT_CANONICAL_HOST;
  if (url.hostname.endsWith('.pages.dev')) {
    return Response.redirect(`https://${canonicalHost}${url.pathname}${url.search}`, 301);
  }

  // 2. Only language-redirect the bare root.
  if (url.pathname !== '/') return next();

  const lang = pickLanguage(request);
  // This redirect is per-visitor: it depends on Accept-Language and on the cookie. A
  // shared cache holding one copy of it sends the first visitor's language to everyone
  // (observed: `/` kept answering /es/ for German and Japanese browsers because the
  // edge had cached the Spanish redirect). Vary states the real cache key; no-store
  // keeps it out of shared caches entirely, and recomputing costs nothing.
  return new Response(null, {
    status: 302,
    headers: {
      Location: `${url.origin}/${lang}/`,
      Vary: 'Accept-Language, Cookie',
      'Cache-Control': 'no-store',
    },
  });
}

/**
 * Which locale the bare root should send this visitor to:
 *   1. the `vox-lang` cookie — an explicit choice, so it outranks everything
 *   2. `Accept-Language` — what the browser is actually configured for
 *   3. `en`
 *
 * Deliberately NOT geo: country and language are different things, and conflating
 * them serves Spanish to a German speaker in Madrid. `Accept-Language` is the
 * visitor's own stated preference, which is what we want to honour.
 */
function pickLanguage(request: Request): Locale {
  const stored = readCookie(request.headers.get('Cookie') || '', COOKIE);
  if (stored && isLocale(stored)) return stored;

  // "de-CH,de;q=0.9,en;q=0.8" — highest q first, so first supported match wins.
  const header = request.headers.get('Accept-Language') || '';
  const tags = header
    .split(',')
    .map((part) => ({
      code: part.split(';')[0].trim().slice(0, 2).toLowerCase(),
      q: Number(/q=([\d.]+)/.exec(part)?.[1] ?? 1),
    }))
    .filter((t) => t.code)
    .sort((a, b) => b.q - a.q);
  for (const tag of tags) {
    if (isLocale(tag.code)) return tag.code;
  }
  return DEFAULT_LOCALE;
}

function readCookie(header: string, name: string): string | undefined {
  for (const part of header.split(';')) {
    const [k, ...v] = part.trim().split('=');
    if (k === name) return decodeURIComponent(v.join('='));
  }
  return undefined;
}

function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/** Constant-ish Basic Auth check against an `expected` "user:pass" string. */
function checkBasicAuth(request: Request, expected: string): boolean {
  const header = request.headers.get('Authorization') || '';
  const [scheme, encoded] = header.split(' ');
  if (scheme !== 'Basic' || !encoded) return false;
  try {
    return atob(encoded) === expected;
  } catch {
    return false;
  }
}
