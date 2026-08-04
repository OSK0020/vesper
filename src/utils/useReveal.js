import { useEffect, useRef } from 'react';

/**
 * useReveal — adds the `.is-visible` class once the element scrolls
 * into view, so the CSS `cardReveal` keyframe can run. Delay lets
 * callers stagger a grid of cards by index.
 */
export function useReveal(delay = 0) {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const timer = setTimeout(() => {
              node.classList.add('is-visible');
            }, delay);
            observer.unobserve(node);
            return () => clearTimeout(timer);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [delay]);

  return ref;
}
