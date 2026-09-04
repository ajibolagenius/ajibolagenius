"use client";

import Link from "next/link";
import { BackToTop } from "@/components/cv/back-to-top";
import { useLanguage } from "@/lib/i18n";

export function SiteFooter({ name }: { name: string }) {
  const { t } = useLanguage();

  return (
    <div className="lg:ml-80">
      <div className="mx-auto flex max-w-3xl xl:max-w-5xl 2xl:max-w-6xl items-center justify-between border-t border-ink/10 px-6 py-6 text-body-s text-ink/60">
        <p>© {new Date().getFullYear()} {name}</p>
        <div className="flex items-center gap-5">
          <Link href="/licenses" className="hover:text-ink">
            {t.footer.licenses}
          </Link>
          <BackToTop className="hover:text-ink" />
        </div>
      </div>
    </div>
  );
}
