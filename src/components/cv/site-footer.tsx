"use client";

import Link from "next/link";
import { BackToTop } from "@/components/cv/back-to-top";
import { useLanguage } from "@/lib/i18n";

export function SiteFooter({
  name,
  availability,
}: {
  name: string;
  /** personal_info.availability; the line is omitted when blank. */
  availability?: string | null;
}) {
  const { t } = useLanguage();

  return (
    <footer className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-ink/10 px-6 py-7 font-mono text-body-xs text-ink/55">
      {availability && (
        <p className="inline-flex items-center gap-2 text-ink">
          <span aria-hidden className="size-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
          {availability}
        </p>
      )}
      <p>
        © {new Date().getFullYear()} {name} · Lagos
      </p>
      <div className="flex items-center gap-5">
        <Link href="/licenses" className="hover:text-ink">
          {t.footer.licenses}
        </Link>
        <BackToTop className="hover:text-ink" />
      </div>
    </footer>
  );
}
