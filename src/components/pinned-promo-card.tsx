import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import type { Icon } from "@phosphor-icons/react";

export function PinnedPromoCard({
  href,
  icon: IconComponent,
  eyebrow,
  title,
  description,
}: {
  href: string;
  icon: Icon;
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col overflow-hidden border border-ink/10 transition hover:border-ink/30"
    >
      <div className="relative flex aspect-16/10 w-full items-center justify-center overflow-hidden bg-ink/5">
        <IconComponent
          size={40}
          weight="duotone"
          className="text-ink/20 transition-transform duration-300 group-hover:scale-110"
        />
        <span className="absolute left-3 top-3 inline-flex items-center bg-ink px-2 py-1 font-mono text-body-xs font-medium text-cream">
          Pinned
        </span>
      </div>

      <div className="flex flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-body-xs uppercase tracking-wide text-ink/60">
              {eyebrow}
            </p>
            <h3 className="text-body-l font-medium">{title}</h3>
          </div>
          <ArrowUpRight
            size={20}
            weight="duotone"
            className="mt-1 shrink-0 text-ink/60 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-ink"
          />
        </div>
        <p className="line-clamp-2 text-body-s text-ink/60">{description}</p>
      </div>
    </Link>
  );
}
