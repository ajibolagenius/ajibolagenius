"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  ChatCircle,
  List,
  UserCircle,
  X,
} from "@phosphor-icons/react/dist/ssr";
import { ThemeToggle } from "@/components/theme-toggle";

const LINKS = [
  { href: "/#about", section: "about", label: "About" },
  { href: "/#experience", section: "experience", label: "Experience" },
  { href: "/#education", section: "education", label: "Education" },
  { href: "/#skills", section: "skills", label: "Skills" },
];

export function TopNav({
  visibleSections,
}: {
  /** Visible homepage section keys; links to hidden sections are omitted. */
  visibleSections?: string[];
}) {
  const [open, setOpen] = useState(false);

  const links = visibleSections
    ? LINKS.filter((link) => visibleSections.includes(link.section))
    : LINKS;
  const showContact = visibleSections
    ? visibleSections.includes("connect")
    : true;

  return (
    <div className="sticky top-0 z-40 bg-cream/90 backdrop-blur lg:ml-80">
      <nav className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-ink" aria-label="Home">
            <UserCircle weight="duotone" size={24} className="text-accent" />
          </Link>

          <ul className="hidden items-center gap-6 text-body-s text-ink/70 sm:flex">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="transition-colors hover:text-ink"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/work"
                className="inline-flex items-center gap-1 border border-accent/50 px-2.5 py-1 font-medium text-accent transition-colors hover:bg-accent hover:text-cream"
              >
                Work
                <ArrowUpRight weight="bold" size={12} />
              </Link>
            </li>
          </ul>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle className="flex text-ink/60 transition-colors hover:text-ink" />
          {showContact && (
            <Link
              href="/#connect"
              className="hidden items-center gap-2 bg-ink px-4 py-2 text-body-s font-medium text-cream transition-colors hover:bg-accent sm:flex"
            >
              <ChatCircle weight="duotone" size={16} />
              Contact Me
            </Link>
          )}

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="text-ink sm:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X size={22} /> : <List size={22} />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-ink/10 px-6 py-6 sm:hidden">
          <ul className="flex flex-col items-center gap-6 text-body-m text-ink/70">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="transition-colors hover:text-ink"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/work"
                onClick={() => setOpen(false)}
                className="inline-flex items-center gap-1 border border-accent/50 px-3 py-1.5 font-medium text-accent transition-colors hover:bg-accent hover:text-cream"
              >
                Work
                <ArrowUpRight weight="bold" size={14} />
              </Link>
            </li>
          </ul>
          {showContact && (
            <Link
              href="/#connect"
              onClick={() => setOpen(false)}
              className="mt-4 flex items-center justify-center gap-2 bg-ink px-4 py-2.5 text-body-s font-medium text-cream transition-colors hover:bg-accent"
            >
              <ChatCircle weight="duotone" size={16} />
              Contact Me
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
