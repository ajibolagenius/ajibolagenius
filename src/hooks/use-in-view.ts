"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Discrete in-view state for things that need JS: scrollspy, back-to-top
 * visibility, pausing off-screen timers. Scroll *reveals* deliberately do not
 * use this — they are CSS `animation-timeline: view()` so they can never hide
 * content behind a dead observer, and never delay LCP. See globals.css.
 */
export function useInView<T extends Element>(
  options?: IntersectionObserverInit & { once?: boolean },
) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  const { root, rootMargin, threshold, once } = options ?? {};

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      // Fail open — never leave content gated behind a missing observer.
      setInView(true);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (entry.isIntersecting && once) io.disconnect();
      },
      { root, rootMargin, threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [root, rootMargin, threshold, once]);

  return { ref, inView };
}
