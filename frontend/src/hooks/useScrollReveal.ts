import { useEffect, useRef } from "react";

/**
 * Attaches an IntersectionObserver to the returned ref.
 * When the element enters the viewport:
 *  - `reveal-visible` is added to the element itself
 *  - `reveal-visible` is also added to any direct children that carry a
 *    `reveal`, `reveal-left`, `reveal-right`, or `reveal-scale` class,
 *    so that staggered grid cards animate in when their parent container
 *    is observed.
 *
 * @param threshold  – 0-1, how much of the element must be visible (default 0.1)
 * @param rootMargin – optional margin around the root (default "0px")
 */
export function useScrollReveal<T extends HTMLElement = HTMLElement>(
  threshold = 0.1,
  rootMargin = "0px"
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const REVEAL_CLASSES = ["reveal", "reveal-left", "reveal-right", "reveal-scale"];

    const revealEl = (target: HTMLElement) => {
      target.classList.add("reveal-visible");
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Reveal the container itself (if it has a reveal class)
          revealEl(el);

          // Reveal all direct children that carry a reveal class
          Array.from(el.children).forEach((child) => {
            if (REVEAL_CLASSES.some((cls) => child.classList.contains(cls))) {
              revealEl(child as HTMLElement);
            }
          });

          observer.unobserve(el); // animate once
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return ref;
}
