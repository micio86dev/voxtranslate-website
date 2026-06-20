// Cloudflare Pages Function — geo-based language redirect for the bare root.
// Runs before static asset serving. Honors an explicit cookie preference and
// only ever touches "/" so localized pages are never intercepted.
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

  // Only redirect the bare root.
  if (url.pathname !== '/') return next();

  // Respect an existing cookie preference.
  const cookie = request.headers.get('Cookie') || '';
  if (cookie.includes('vox-lang=')) return next();

  // Use Cloudflare's geo header.
  const country = request.headers.get('CF-IPCountry') || 'US';
  const lang = COUNTRY_TO_LANG[country] || 'en';

  return Response.redirect(`${url.origin}/${lang}/`, 302);
}
