"use client";

import { useLanguage } from "@/lib/i18n";

export function SectionHeading({
  id,
  children,
}: {
  id?: string;
  children: React.ReactNode;
}) {
  const { locale, t } = useLanguage();

  let text = children;
  if (locale === "yo" && id && id in t.headings) {
    text = t.headings[id as keyof typeof t.headings];
  }

  return (
    <h2 id={id} className="text-h2 scroll-mt-24 font-normal">
      {text}
    </h2>
  );
}
