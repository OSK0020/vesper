import { useRef, useCallback } from 'react';

/**
 * useTilt — tracks pointer position within an element and writes it to
 * --mx/--my CSS custom properties, which the .board::before "light-catch"
 * gradient reads from. Also applies a very subtle 3D tilt for depth.
 */
export function useTilt() {
  const ref = useRef(null);

  const reduceMotion =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const onMouseMove = useCallback(
    (e) => {
      const node = ref.current;
      if (!node || reduceMotion) return;
      const rect = node.getBoundingClientRect();
      const px = ((e.clientX - rect.left) / rect.width) * 100;
      const py = ((e.clientY - rect.top) / rect.height) * 100;
      node.style.setProperty('--mx', `${px}%`);
      node.style.setProperty('--my', `${py}%`);

      const rx = ((py - 50) / 50) * -2.5;
      const ry = ((px - 50) / 50) * 2.5;
      node.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-2px)`;
    },
    [reduceMotion]
  );

  const onMouseLeave = useCallback(() => {
    const node = ref.current;
    if (!node) return;
    node.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0px)';
  }, []);

  return { ref, onMouseMove, onMouseLeave };
}
