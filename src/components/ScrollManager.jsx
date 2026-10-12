import { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

const MAX_HASH_ATTEMPTS = 10;

/**
 * Site-wide scroll handling on route change:
 * - URL with a #hash: scroll to that element. The browser's own hash jump
 *   fails on first load (the SPA hasn't rendered yet), so this retries for a
 *   few frames until the element exists.
 * - Otherwise, on PUSH/REPLACE navigations: jump to the top.
 * - Back/forward (POP): leave the browser's scroll restoration alone.
 *
 * Uses behavior 'instant' because index.css sets `scroll-behavior: smooth`.
 * Only pathname/hash changes trigger it, so the Apply wizard's in-page step
 * changes (component state, not the URL) are unaffected.
 */
export function ScrollManager() {
  const { pathname, hash } = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    if (hash) {
      const id = decodeURIComponent(hash.slice(1));
      let attempts = 0;
      let frame;
      const tryScroll = () => {
        const target = document.getElementById(id);
        if (target) {
          target.scrollIntoView({ behavior: 'instant', block: 'start' });
        } else if (++attempts < MAX_HASH_ATTEMPTS) {
          frame = requestAnimationFrame(tryScroll);
        }
      };
      tryScroll();
      return () => cancelAnimationFrame(frame);
    }

    if (navigationType !== 'POP') {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [pathname, hash, navigationType]);

  return null;
}
