"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChatCircle,
  List,
  UserCircle,
  X,
} from "@phosphor-icons/react/dist/ssr";
import { ThemeToggle } from "@/components/theme-toggle";

const LINKS = [
  { href: "#about", label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#education", label: "Education" },
  { href: "#skills", label: "Skills" },
];

export function TopNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="sticky top-0 z-40 bg-cream/90 backdrop-blur">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-ink" aria-label="Home">
            <UserCircle weight="duotone" size={24} className="text-accent" />
          </Link>

          <ul className="hidden items-center gap-6 text-body-s text-ink/70 sm:flex">
            {LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="transition-colors hover:text-ink"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <Link href="/work" className="transition-colors hover:text-ink">
                Work
              </Link>
            </li>
          </ul>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle className="hidden text-ink/50 transition-colors hover:text-ink sm:flex" />
          <a
            href="#connect"
            className="hidden items-center gap-2 bg-ink px-4 py-2 text-body-s font-medium text-cream transition-colors hover:bg-accent sm:flex"
          >
            <ChatCircle weight="duotone" size={16} />
            Contact Me
          </a>

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
            {LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="transition-colors hover:text-ink"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <Link
                href="/work"
                onClick={() => setOpen(false)}
                className="transition-colors hover:text-ink"
              >
                Work
              </Link>
            </li>
          </ul>
          <div className="mt-6 flex items-center justify-center">
            <ThemeToggle className="flex items-center gap-2 text-body-s text-ink/60" />
          </div>
          <a
            href="#connect"
            onClick={() => setOpen(false)}
            className="mt-4 flex items-center justify-center gap-2 bg-ink px-4 py-2.5 text-body-s font-medium text-cream transition-colors hover:bg-accent"
          >
            <ChatCircle weight="duotone" size={16} />
            Contact Me
          </a>
        </div>
      )}
    </div>
  );
}
