import Link from "next/link";
import { ArrowUpRight, Sparkle } from "@phosphor-icons/react/dist/ssr";

export function SideProjectsPromoCard() {
  return (
    <Link
      href="/side-projects"
      className="group flex flex-col overflow-hidden border border-ink/10 transition hover:border-ink/30"
    >
      <div className="relative flex aspect-[16/10] w-full items-center justify-center overflow-hidden bg-ink/5">
        <Sparkle
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
              Explore
            </p>
            <h3 className="text-body-l font-medium">Side Projects</h3>
          </div>
          <ArrowUpRight
            size={20}
            weight="duotone"
            className="mt-1 shrink-0 text-ink/60 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-ink"
          />
        </div>
        <p className="line-clamp-2 text-body-s text-ink/60">
          Personal experiments and works in progress — things I build outside
          of client work.
        </p>
      </div>
    </Link>
  );
}
