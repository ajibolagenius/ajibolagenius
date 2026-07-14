"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "@phosphor-icons/react/dist/ssr";

export function ThemeToggle({ className }: { className?: string }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle theme"
      className={
        className ??
        "flex h-8 w-8 items-center justify-center text-ink/60 transition-colors hover:text-ink"
      }
    >
      {isDark ? (
        <Sun weight="duotone" size={18} />
      ) : (
        <Moon weight="duotone" size={18} />
      )}
    </button>
  );
}
