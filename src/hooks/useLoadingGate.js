import { useEffect, useRef, useState } from 'react';

export const LOADING_DELAY = 150;
export const LOADING_MIN_DURATION = 350;

// Smooths out a loading flag. `visible` turns on only after `delay` ms of
// continuous loading, then stays on for at least `minDuration` ms once shown.
// `busy` is true while loading or while the indicator is still being held.
export function useLoadingGate(
  isLoading,
  { delay = LOADING_DELAY, minDuration = LOADING_MIN_DURATION } = {},
) {
  const [shown, setShown] = useState(false);
  const shownAt = useRef(0);

  useEffect(() => {
    if (isLoading) {
      if (shown) return undefined;
      const timer = setTimeout(() => {
        shownAt.current = Date.now();
        setShown(true);
      }, delay);
      return () => clearTimeout(timer);
    }

    if (!shown) return undefined;
    const remaining = Math.max(0, minDuration - (Date.now() - shownAt.current));
    const timer = setTimeout(() => setShown(false), remaining);
    return () => clearTimeout(timer);
  }, [isLoading, shown, delay, minDuration]);

  // With no minimum the indicator drops on the same render the flag goes false.
  const visible = shown && (isLoading || minDuration > 0);
  return { visible, busy: isLoading || visible };
}
