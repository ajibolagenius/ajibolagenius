"use client";

import { useLanguage } from "@/lib/i18n";

export function SkipLink() {
  const { t } = useLanguage();

  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:border focus:border-ink/20 focus:bg-panel focus:px-4 focus:py-2 focus:font-mono focus:text-body-s focus:text-ink focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-accent"
    >
      {t.nav.skipToContent}
    </a>
  );
}
