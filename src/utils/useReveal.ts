import { useEffect, useRef } from 'react';

/**
 * useReveal — adds the `.is-visible` class once the element scrolls
 * into view, so the CSS `cardReveal` keyframe can run. Delay lets
 * callers stagger a grid of cards by index.
 */
export function useReveal(delay = 0) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    let timer: number | undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            timer = window.setTimeout(() => {
              node.classList.add('is-visible');
            }, delay);
            observer.unobserve(node);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      if (timer) window.clearTimeout(timer);
    };
  }, [delay]);

  return ref;
}
