"use client";

import { useMediaQuery } from "./use-media-query";

/**
 * Extracted verbatim (in behaviour) from featured-work.tsx, which built the
 * original on useSyncExternalStore with a `false` server snapshot — so SSR
 * renders the motion path and the client corrects on mount.
 */
export function usePrefersReducedMotion() {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

/** Mouse/trackpad only. Gate tilt, cursor accents and sheens on this. */
export function usePointerFine() {
  return useMediaQuery("(hover: hover) and (pointer: fine)");
}
