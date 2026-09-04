"use client";

import Link from "next/link";
import { ArrowLeft, Flask, MagnifyingGlass } from "@phosphor-icons/react/dist/ssr";
import { ThemeToggle } from "@/components/theme-toggle";

export function SandboxNav() {
  return (
    <div className="sticky top-0 z-40 border-b border-ink/10 bg-cream/90 backdrop-blur">
      <nav className="relative mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link
          href="/sandbox"
          className="inline-flex items-center gap-2 transition-colors hover:text-accent"
        >
          <Flask weight="duotone" size={22} className="shrink-0 text-accent" />
          <span className="text-display">Sandbox</span>
        </Link>

        <div className="flex items-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={() =>
              window.dispatchEvent(new CustomEvent("open-command-palette"))
            }
            aria-label="Search and command palette (⌘K)"
            className="flex items-center gap-1.5 border border-ink/10 bg-ink/5 px-2 py-1 text-body-xs text-ink/65 transition-colors duration-[var(--dur-2)] hover:border-accent hover:text-ink sm:px-2.5"
          >
            <MagnifyingGlass weight="bold" size={14} className="text-accent" />
            <span className="hidden md:inline font-sans">Search</span>
            <kbd className="hidden font-mono text-[10px] text-ink/40 border border-ink/15 px-1 py-0.5 sm:inline-block">
              ⌘K
            </kbd>
          </button>
          <Link
            href="/projects"
            className="group inline-flex items-center gap-1.5 text-body-s text-ink/60 transition-colors duration-[var(--dur-2)] hover:text-ink"
          >
            <ArrowLeft
              weight="bold"
              size={14}
              className="transition-transform duration-[var(--dur-2)] ease-out-quart group-hover:-translate-x-0.5"
            />
            <span className="hidden sm:inline">Projects</span>
          </Link>
          <ThemeToggle className="flex text-ink/60 transition-colors hover:text-ink" />
        </div>
        <span
          aria-hidden
          className="scroll-progress absolute inset-x-0 bottom-0 h-px bg-accent"
        />
      </nav>
    </div>
  );
}
