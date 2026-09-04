"use client";

import { useLanguage } from "@/lib/i18n";

export function LicensesHeading() {
  const { t } = useLanguage();
  return <h1 className="text-h1 font-normal">{t.headings.licenses}</h1>;
}
