"use client";

import { useLanguage } from "@/lib/i18n";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { sound } from "@/lib/sound";
import { flushSync } from "react-dom";
import clsx from "clsx";

export function LanguageToggle({ className }: { className?: string }) {
  const { locale, toggleLocale } = useLanguage();
  const reduceMotion = usePrefersReducedMotion();

  function handleToggle() {
    sound.playTap();
    if (reduceMotion || !document.startViewTransition) {
      toggleLocale();
      return;
    }

    document.startViewTransition(() => {
      flushSync(() => {
        toggleLocale();
      });
    });
  }

  const isYoruba = locale === "yo";

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={
        isYoruba
          ? "Yí èdè padà sí Gẹ̀ẹ́sì (Switch language to English)"
          : "Switch language to Yorùbá"
      }
      title={isYoruba ? "Yí èdè padà sí Gẹ̀ẹ́sì" : "Switch language to Yorùbá"}
      className={clsx(
        "group flex h-8 items-center gap-1 border border-ink/10 bg-ink/[0.04] px-2 font-mono text-[11px] font-medium tracking-wider transition-colors duration-[var(--dur-2)] hover:border-accent hover:text-ink cursor-pointer select-none",
        className,
      )}
    >
      <span
        className={clsx(
          "transition-colors duration-[var(--dur-2)]",
          !isYoruba ? "font-bold text-accent" : "text-ink/40 group-hover:text-ink/70",
        )}
      >
        EN
      </span>
      <span className="text-ink/20" aria-hidden>/</span>
      <span
        className={clsx(
          "transition-colors duration-[var(--dur-2)]",
          isYoruba ? "font-bold text-accent" : "text-ink/40 group-hover:text-ink/70",
        )}
      >
        YÓ
      </span>
    </button>
  );
}
