"use client";

import { useCallback, useRef } from "react";

/**
 * Pointer-driven card tilt, written straight to CSS custom properties.
 *
 * The performance contract, which the CSS in globals.css depends on:
 *  - exactly one getBoundingClientRect() per hover, not per move
 *  - pointer moves coalesced into a single rAF write
 *  - the write targets a ref'd node, so React never re-renders
 *  - only `transform` changes, which is compositor-only
 *  - will-change is scoped to the hover lifetime, so at most one card in a
 *    grid is layer-promoted at a time
 *
 * Mouse only — touch and pen bail out before any property is written, and the
 * consuming `.tilt` rule is additionally gated on (hover: hover).
 */
export function useTilt({ max = 5, lift = -2 } = {}) {
  const rect = useRef<DOMRect | null>(null);
  const node = useRef<HTMLElement | null>(null);
  const point = useRef({ x: 0, y: 0 });
  const raf = useRef(0);

  const flush = useCallback(() => {
    raf.current = 0;
    const el = node.current;
    if (!el) return;
    const { x, y } = point.current;
    el.style.setProperty("--rx", `${(-y * max).toFixed(2)}deg`);
    el.style.setProperty("--ry", `${(x * max).toFixed(2)}deg`);
    el.style.setProperty("--mx", `${((x + 0.5) * 100).toFixed(1)}%`);
    el.style.setProperty("--my", `${((y + 0.5) * 100).toFixed(1)}%`);
  }, [max]);

  const onPointerEnter = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (event.pointerType !== "mouse") return;
      node.current = event.currentTarget;
      rect.current = event.currentTarget.getBoundingClientRect();
      event.currentTarget.style.setProperty("--lift-y", `${lift}px`);
      event.currentTarget.style.willChange = "transform";
    },
    [lift],
  );

  const onPointerMove = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      const r = rect.current;
      if (!r || event.pointerType !== "mouse") return;
      point.current = {
        x: (event.clientX - r.left) / r.width - 0.5,
        y: (event.clientY - r.top) / r.height - 0.5,
      };
      if (!raf.current) raf.current = requestAnimationFrame(flush);
    },
    [flush],
  );

  const onPointerLeave = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (raf.current) {
        cancelAnimationFrame(raf.current);
        raf.current = 0;
      }
      rect.current = null;
      node.current = null;
      const style = event.currentTarget.style;
      style.removeProperty("--rx");
      style.removeProperty("--ry");
      style.removeProperty("--lift-y");
      style.willChange = "";
    },
    [],
  );

  return { onPointerEnter, onPointerMove, onPointerLeave };
}
