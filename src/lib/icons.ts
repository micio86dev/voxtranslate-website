// Inline stroke icons — the exact path data used by the VoxTranslate app
// (client/src/scripts/icons.ts), Lucide/Feather style, drawn in `currentColor`.
// Kept in sync manually so the marketing site matches the product UI.

const PATHS: Record<string, string> = {
  mic: '<path d="M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/><path d="M19 10v1a7 7 0 0 1-14 0v-1"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="8" y1="22" x2="16" y2="22"/>',
  video: '<path d="m22 8-6 4 6 4V8z"/><rect x="2" y="6" width="14" height="12" rx="2"/>',
  // Screen share — the app's "monitor" glyph.
  monitor:
    '<rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>',
  chat: '<path d="M21 14a2 2 0 0 1-2 2H8l-4 4V6a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2z"/>',
  leave:
    '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>',
  // Public rooms — meeting new people.
  users:
    '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  // Recording (red-dot circle).
  recording:
    '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3" fill="currentColor" stroke="none"/>',
  // Transcript / subtitles.
  subtitle:
    '<rect x="2" y="5" width="20" height="14" rx="2"/><line x1="6" y1="11" x2="18" y2="11"/><line x1="6" y1="15" x2="14" y2="15"/>',
  // AI insight (sentiment).
  sparkles:
    '<path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/><path d="M5 4l.6 1.6L7 6l-1.4.4L5 8l-.6-1.6L3 6l1.4-.4z"/>',
  // Email recap.
  mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-9.5 6.5a1.7 1.7 0 0 1-1 .3 1.7 1.7 0 0 1-1-.3L2 7"/>',
};

/** Inline SVG markup for `name`, drawn in `currentColor`. */
export function icon(name: keyof typeof PATHS | string, size = 22): string {
  return (
    `<svg class="ico" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" ` +
    `stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ` +
    `aria-hidden="true" focusable="false">${PATHS[name] ?? ''}</svg>`
  );
}
