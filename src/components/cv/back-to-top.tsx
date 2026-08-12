"use client";

import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

export function BackToTop({ className }: { className?: string }) {
  const reduceMotion = usePrefersReducedMotion();

  return (
    <button
      type="button"
      onClick={() =>
        // CSS scroll-behavior does not govern scrollTo({behavior}) — opt out here.
        window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" })
      }
      className={className}
    >
      Back to Top
    </button>
  );
}
