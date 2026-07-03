// Analytics tracking utilities for the marketing website

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

/** Track a GA4 event. No-op if gtag isn't loaded. */
export function track(event: string, params: Record<string, unknown> = {}): void {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', event, params);
  }
}

/** Track a Meta/Facebook event. No-op if pixel isn't loaded. */
export function trackFB(event: string, params: Record<string, unknown> = {}): void {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', event, params);
  }
}
