// Cloudflare Pages Function — runs before static asset serving.
//   1. Canonical-host enforcement: any request to the *.pages.dev subdomain
//      (the permanent project domain + per-deploy <hash> aliases, which can't be
//      deleted) is 301'd to the custom domain, so the site is only reachable —
//      and only indexed — at CANONICAL_HOST.
//   2. Geo-based language redirect for the bare root, honoring a cookie pref.
const CANONICAL_HOST = 'website.voxtranslate.app';

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

export async function onRequest({ request, next }: EventContext<unknown, string, unknown>) {
  const url = new URL(request.url);

  // 1. Force the canonical host: bounce any *.pages.dev hostname to the custom
  //    domain (permanent 301), preserving path + query. Makes pages.dev
  //    effectively unreachable and untracked.
  if (url.hostname.endsWith('.pages.dev')) {
    return Response.redirect(`https://${CANONICAL_HOST}${url.pathname}${url.search}`, 301);
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
