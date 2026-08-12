"use client";

import { useCallback } from "react";
import { flushSync } from "react-dom";
import { usePrefersReducedMotion } from "./use-prefers-reduced-motion";

/**
 * Same-document view transitions via the plain DOM API.
 *
 * Note this is unrelated to React's <ViewTransition> component, which ships in
 * neither react@19.2.4 nor Next 16's vendored experimental build — cross-page
 * shared elements are therefore off the table. Everything here (filter
 * refilter, theme toggle, lightbox zoom) is a change *within* one document, so
 * it works on the stable channel today.
 *
 * `kind` is written to `documentElement.dataset.vt` so each use case can scope
 * its own ::view-transition-* rules without colliding with the others.
 */
export function useViewTransition(kind: string, enabled = true) {
  const reduceMotion = usePrefersReducedMotion();

  return useCallback(
    (update: () => void) => {
      if (
        !enabled ||
        reduceMotion ||
        typeof document === "undefined" ||
        !document.startViewTransition
      ) {
        update();
        return;
      }

      const root = document.documentElement;
      root.dataset.vt = kind;
      const transition = document.startViewTransition(() =>
        flushSync(update),
      );
      transition.finished.finally(() => {
        if (root.dataset.vt === kind) delete root.dataset.vt;
      });
    },
    [enabled, kind, reduceMotion],
  );
}
