"use client";

import { useLanguage } from "@/lib/i18n";

export function CompaniesLabel({ count }: { count: number }) {
  const { t } = useLanguage();
  return <>{t.sidebar.companies.replace("{count}", String(count))}</>;
}

export function ProjectsShippedLabel({ count }: { count: number }) {
  const { t } = useLanguage();
  return <>{t.sidebar.projectsShipped.replace("{count}", String(count))}</>;
}

export function OpenCvLabel() {
  const { t } = useLanguage();
  return <>{t.actions.openCv}</>;
}
