"use client";

import Link from "next/link";
import { House } from "@phosphor-icons/react/dist/ssr";
import { useLanguage } from "@/lib/i18n";

export function NotFoundCopy() {
  const { t } = useLanguage();

  return (
    <>
      <h1 className="text-h1 font-normal">{t.notFound.title}</h1>
      <p className="max-w-sm text-body-m text-ink/60">
        {t.notFound.description}
      </p>
      <Link
        href="/"
        className="mt-2 inline-flex items-center gap-2 bg-ink px-4 py-2.5 text-body-s font-medium text-cream"
      >
        <House weight="duotone" size={16} />
        {t.actions.returnHome}
      </Link>
    </>
  );
}
