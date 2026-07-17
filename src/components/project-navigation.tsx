import Link from "next/link";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react/dist/ssr";

interface NavProject {
  slug: string;
  name: string;
}

export function ProjectNavigation({
  prev,
  next,
  prefix,
}: {
  prev: NavProject | null;
  next: NavProject | null;
  prefix: string;
}) {
  if (!prev && !next) return null;

  return (
    <nav className="flex items-center justify-between gap-4 border-t border-ink/10 pt-8 mt-4 print:hidden">
      {prev ? (
        <Link
          href={`${prefix}/${prev.slug}`}
          className="group flex flex-col gap-1 text-left max-w-[45%] min-w-0"
        >
          <span className="flex items-center gap-1 text-body-xs uppercase tracking-wider text-ink/40 transition-colors group-hover:text-accent">
            <ArrowLeft size={12} className="transition-transform group-hover:-translate-x-0.5" />
            Previous
          </span>
          <span className="text-body-s font-medium text-ink/80 transition-colors group-hover:text-ink truncate">
            {prev.name}
          </span>
        </Link>
      ) : (
        <div />
      )}

      {next ? (
        <Link
          href={`${prefix}/${next.slug}`}
          className="group flex flex-col gap-1 text-right max-w-[45%] min-w-0"
        >
          <span className="flex items-center justify-end gap-1 text-body-xs uppercase tracking-wider text-ink/40 transition-colors group-hover:text-accent">
            Next
            <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
          </span>
          <span className="text-body-s font-medium text-ink/80 transition-colors group-hover:text-ink truncate">
            {next.name}
          </span>
        </Link>
      ) : (
        <div />
      )}
    </nav>
  );
}
