"use client";

import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { useRouteTransition } from "@/hooks/use-route-transition";
import { useLanguage } from "@/lib/i18n";

function defaultLabel(href: string, t: ReturnType<typeof useLanguage>["t"]) {
  if (href.startsWith("/notes")) return t.actions.allNotes;
  if (href.startsWith("/sandbox")) return t.actions.backToLab;
  return t.actions.backToProjects;
}

export function ProjectBackLink({
  href,
  label,
}: {
  href: string;
  label?: string;
}) {
  const navigate = useRouteTransition();
  const { t } = useLanguage();
  const resolvedLabel = label ?? defaultLabel(href, t);

  return (
    <Link
      href={href}
      onClick={(e) => {
        if (
          e.metaKey ||
          e.ctrlKey ||
          e.shiftKey ||
          e.altKey ||
          e.button !== 0
        ) {
          return;
        }
        e.preventDefault();
        navigate(href);
      }}
      className="group inline-flex w-fit items-center gap-2 text-body-s text-ink/60 transition-colors duration-[var(--dur-2)] hover:text-accent"
    >
      <ArrowLeft
        weight="duotone"
        size={16}
        className="transition-transform duration-[var(--dur-2)] ease-out-quart group-hover:-translate-x-0.5"
      />
      {resolvedLabel}
    </Link>
  );
}
