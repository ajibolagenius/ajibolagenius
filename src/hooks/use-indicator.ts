"use client";

import { useEffect, useRef, useState } from "react";

export type IndicatorBox = { x: number; y: number; w: number; h: number };

/**
 * Measures the `[data-active="true"]` child of a container so a single sliding
 * block can be positioned over it. Shared by the nav underline and the filter
 * pills.
 *
 * The container must be `position: relative` — offsets are read relative to
 * the offsetParent. Uses offsetLeft/Top rather than getBoundingClientRect so
 * there is no forced layout flush and no dependency on scroll position.
 */
export function useIndicator<T extends HTMLElement>(activeKey: string | null) {
  const containerRef = useRef<T>(null);
  const [box, setBox] = useState<IndicatorBox | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const measure = () => {
      const el = container.querySelector<HTMLElement>('[data-active="true"]');
      if (!el) {
        setBox(null);
        return;
      }
      const next = {
        x: el.offsetLeft,
        y: el.offsetTop,
        w: el.offsetWidth,
        h: el.offsetHeight,
      };
      setBox((prev) =>
        prev &&
        prev.x === next.x &&
        prev.y === next.y &&
        prev.w === next.w &&
        prev.h === next.h
          ? prev
          : next,
      );
    };

    measure();
    if (typeof ResizeObserver === "undefined") return;
    // Catches pill wrapping and the font swap.
    const ro = new ResizeObserver(measure);
    ro.observe(container);
    return () => ro.disconnect();
  }, [activeKey]);

  return { containerRef, box };
}
