"use client";

import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { useRouteTransition } from "@/hooks/use-route-transition";

export function ProjectBackLink({
  href,
  label = "Back to projects",
}: {
  href: string;
  label?: string;
}) {
  const navigate = useRouteTransition();

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
      {label}
    </Link>
  );
}
