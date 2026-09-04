"use client";

import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { useLanguage } from "@/lib/i18n";

export function BackToTop({ className }: { className?: string }) {
  const reduceMotion = usePrefersReducedMotion();
  const { t } = useLanguage();

  return (
    <button
      type="button"
      onClick={() =>
        // CSS scroll-behavior does not govern scrollTo({behavior}) — opt out here.
        window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" })
      }
      className={className}
    >
      {t.actions.backToTop}
    </button>
  );
}
