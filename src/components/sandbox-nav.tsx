import Link from "next/link";
import { ArrowLeft, Flask } from "@phosphor-icons/react/dist/ssr";
import { ThemeToggle } from "@/components/theme-toggle";

export function SandboxNav() {
  return (
    <div className="sticky top-0 z-40 border-b border-ink/10 bg-cream/90 backdrop-blur">
      <nav className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link
          href="/sandbox"
          className="inline-flex items-center gap-2 transition-colors hover:text-accent"
        >
          <Flask weight="duotone" size={22} className="shrink-0 text-accent" />
          <span className="text-display">Sandbox</span>
        </Link>

        <div className="flex items-center gap-4 sm:gap-5">
          <Link
            href="/side-projects"
            className="inline-flex items-center gap-1.5 text-body-s text-ink/60 transition-colors hover:text-ink"
          >
            <ArrowLeft weight="bold" size={14} />
            <span className="hidden sm:inline">Side Projects</span>
          </Link>
          <ThemeToggle className="flex text-ink/60 transition-colors hover:text-ink" />
        </div>
      </nav>
    </div>
  );
}
