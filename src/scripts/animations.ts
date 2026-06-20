/**
 * Entry/scroll animations via the native Web Animations API (no dependency —
 * keeps the bundle tiny for Lighthouse).
 * - Hero: staggered fade + translateY on load.
 * - [data-reveal] (non-hero): fade + slight scale-in when entering the viewport.
 *
 * Gated on `prefers-reduced-motion` (the `reduce-motion` class is set by the
 * inline head script). Elements are hidden in CSS only when JS is present and
 * motion is allowed; on any error we force-reveal so content is never stuck.
 */
const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';

function revealAll() {
  document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
    el.style.opacity = '1';
    el.style.transform = 'none';
  });
}

function run() {
  if (document.documentElement.classList.contains('reduce-motion')) {
    revealAll();
    return;
  }

  try {
    // Hero — animate immediately with a stagger.
    const heroItems = document.querySelectorAll<HTMLElement>('[data-hero] [data-reveal]');
    heroItems.forEach((el, i) => {
      el.animate(
        [
          { opacity: 0, transform: 'translateY(20px)' },
          { opacity: 1, transform: 'translateY(0)' },
        ],
        { duration: 500, delay: i * 100, easing: EASE, fill: 'both' },
      );
    });

    // Scroll reveals — everything else.
    const reveals = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]')).filter(
      (el) => !el.closest('[data-hero]'),
    );
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          el.animate(
            [
              { opacity: 0, transform: 'translateY(16px) scale(0.97)' },
              { opacity: 1, transform: 'translateY(0) scale(1)' },
            ],
            { duration: 500, easing: EASE, fill: 'both' },
          );
          io.unobserve(el);
        });
      },
      { threshold: 0.2 },
    );
    reveals.forEach((el) => io.observe(el));
  } catch {
    revealAll();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', run, { once: true });
} else {
  run();
}
