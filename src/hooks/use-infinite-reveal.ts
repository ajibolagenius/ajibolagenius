"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Reveals a long, already-loaded list one page at a time as the user scrolls.
 *
 * This is windowing, not fetching. /projects loads every listed project in a
 * single narrow-column query because the filter facets are derived from the
 * whole set — a server-paginated grid could not offer accurate category counts
 * without a second aggregate query. So the cost this removes is rendering:
 * cards, their images, and their tilt handlers, not bytes over the wire.
 *
 * Returns the number of items to render plus a ref for the sentinel element,
 * which should be the "load more" control so the same node is both the
 * observer target and the manual fallback.
 */
export function useInfiniteReveal<T extends HTMLElement = HTMLElement>({
  total,
  step,
  resetKey,
}: {
  total: number;
  /** Items revealed initially and per page. */
  step: number;
  /** Changing this re-slices from the top — pass the active filter state. */
  resetKey: string;
}) {
  const [visible, setVisible] = useState(step);
  const sentinelRef = useRef<T | null>(null);

  // A filter change replaces the underlying set, so a deep offset into the old
  // one is meaningless: it would drop the user into cards they never scrolled
  // past and hide the new matches at the top.
  //
  // Adjusted during render rather than in an effect — React's documented
  // pattern for derived resets. An effect would commit one render with the
  // stale offset first, so the wrong slice would paint before the correct one.
  const [lastResetKey, setLastResetKey] = useState(resetKey);
  if (resetKey !== lastResetKey) {
    setLastResetKey(resetKey);
    setVisible(step);
  }

  const hasMore = visible < total;

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible((current) => current + step);
        }
      },
      // Reveal the next page before the sentinel is actually on screen, so the
      // grid grows ahead of the scroll instead of after a visible stop.
      { rootMargin: "600px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
    // `visible` is a dependency on purpose. IntersectionObserver only reports
    // *changes* in intersection, so after a page is revealed a sentinel that is
    // still inside the root margin would never fire again and the list would
    // stall. Re-creating the observer re-reports the current state, which also
    // gives the desired "keep revealing until the viewport is satisfied".
  }, [hasMore, step, visible]);

  return {
    /** Slice length to render. */
    visible: Math.min(visible, total),
    hasMore,
    sentinelRef,
    revealMore: () => setVisible((current) => current + step),
  };
}
