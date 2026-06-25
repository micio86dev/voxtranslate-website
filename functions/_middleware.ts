// Cloudflare Pages Function — runs before static asset serving.
//   0. Staging guard (env-gated): when STAGING_BASIC_AUTH is set, require HTTP
//      Basic Auth and mark every response noindex. Unset in production ⇒ no-op.
//   1. Canonical-host enforcement: any request to the *.pages.dev subdomain
//      (the permanent project domain + per-deploy <hash> aliases, which can't be
//      deleted) is 301'd to the custom domain, so the site is only reachable —
//      and only indexed — at CANONICAL_HOST. Skipped on staging (own host).
//   2. Geo-based language redirect for the bare root, honoring a cookie pref.
const DEFAULT_CANONICAL_HOST = 'website.voxtranslate.app';

interface Env {
  /** `user:pass` — when set, this deploy is staging: gate it + noindex it. */
  STAGING_BASIC_AUTH?: string;
  /** Overrides the canonical host (staging serves under its own domain). */
  CANONICAL_HOST?: string;
}

const COUNTRY_TO_LANG: Record<string, string> = {
  IT: 'it',
  DE: 'de',
  AT: 'de',
  CH: 'de', // Switzerland is multilingual; default to the largest group.
  ES: 'es',
  MX: 'es',
  AR: 'es',
  CO: 'es',
  FR: 'fr',
  BE: 'fr',
};

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

  // 2. Only geo-redirect the bare root.
  if (url.pathname !== '/') return next();

  // Respect an existing cookie preference.
  const cookie = request.headers.get('Cookie') || '';
  if (cookie.includes('vox-lang=')) return next();

  // Use Cloudflare's geo header.
  const country = request.headers.get('CF-IPCountry') || 'US';
  const lang = COUNTRY_TO_LANG[country] || 'en';

  return Response.redirect(`${url.origin}/${lang}/`, 302);
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
