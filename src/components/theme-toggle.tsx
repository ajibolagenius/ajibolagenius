"use client";

import { useEffect, useState, type MouseEvent } from "react";
import { flushSync } from "react-dom";
import { Moon, Sun } from "@phosphor-icons/react/dist/ssr";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

export function ThemeToggle({ className }: { className?: string }) {
  const [isDark, setIsDark] = useState(false);
  const reduceMotion = usePrefersReducedMotion();

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle(event: MouseEvent<HTMLButtonElement>) {
    const next = !isDark;
    const apply = () => {
      setIsDark(next);
      document.documentElement.classList.toggle("dark", next);
      localStorage.setItem("theme", next ? "dark" : "light");
    };

    if (reduceMotion || !document.startViewTransition) {
      apply();
      return;
    }

    // Circular reveal originating at the button. Same-document, so this needs
    // no React view-transition support — see hooks/use-view-transition.ts.
    const root = document.documentElement;
    const rect = event.currentTarget.getBoundingClientRect();
    root.style.setProperty("--vt-x", `${rect.left + rect.width / 2}px`);
    root.style.setProperty("--vt-y", `${rect.top + rect.height / 2}px`);
    root.dataset.vt = "theme";

    const transition = document.startViewTransition(() => flushSync(apply));
    transition.finished.finally(() => {
      if (root.dataset.vt === "theme") delete root.dataset.vt;
    });
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle theme"
      className={
        className ??
        "flex h-8 w-8 items-center justify-center text-ink/60 transition-colors duration-[var(--dur-2)] hover:text-ink"
      }
    >
      {/* Both icons stay mounted and cross-rotate, so the swap has continuity
          instead of popping between two glyphs. */}
      <span className="relative grid h-[18px] w-[18px] place-items-center">
        <Sun
          weight="duotone"
          size={18}
          data-on={isDark}
          className="col-start-1 row-start-1 rotate-90 scale-0 opacity-0 transition duration-[var(--dur-3)] ease-out-quart data-[on=true]:rotate-0 data-[on=true]:scale-100 data-[on=true]:opacity-100"
        />
        <Moon
          weight="duotone"
          size={18}
          data-on={!isDark}
          className="col-start-1 row-start-1 -rotate-90 scale-0 opacity-0 transition duration-[var(--dur-3)] ease-out-quart data-[on=true]:rotate-0 data-[on=true]:scale-100 data-[on=true]:opacity-100"
        />
      </span>
    </button>
  );
}
