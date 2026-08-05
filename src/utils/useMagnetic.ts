import { useRef, useCallback } from 'react';

/**
 * useMagnetic — subtle magnetic pull toward the cursor for buttons.
 * Returns a ref + handlers to spread onto the target element.
 * Respects prefers-reduced-motion and skips on touch devices.
 */
export function useMagnetic(strength = 0.35) {
  const ref = useRef<HTMLButtonElement | null>(null);

  const reduceMotion =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (reduceMotion || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);
      ref.current.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
    },
    [strength, reduceMotion]
  );

  const onMouseLeave = useCallback(() => {
    if (!ref.current) return;
    ref.current.style.transform = 'translate(0px, 0px)';
  }, []);

  return { ref, onMouseMove, onMouseLeave };
}
