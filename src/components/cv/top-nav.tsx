"use client";

import { useCallback, useRef, useState, type CSSProperties } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowUpRight,
  ChatCircle,
  List,
  UserCircle,
  X,
} from "@phosphor-icons/react/dist/ssr";
import { ThemeToggle } from "@/components/theme-toggle";
import { useFocusTrap } from "@/hooks/use-focus-trap";
import { useIndicator } from "@/hooks/use-indicator";
import { useScrollSpy } from "@/hooks/use-scroll-spy";

type NavLink = {
  href: string;
  label: string;
  /** Homepage section key. Route links omit it and always render. */
  section?: string;
  /** Renders in the accent-bordered pill treatment. */
  emphasis?: boolean;
};

// Single source of truth. Both the desktop list and the mobile sheet render
// from this — previously /work and /side-projects were hardcoded JSX in four
// separate places.
const LINKS: NavLink[] = [
  { href: "/#about", section: "about", label: "About" },
  { href: "/#experience", section: "experience", label: "Experience" },
  { href: "/#education", section: "education", label: "Education" },
  { href: "/#skills", section: "skills", label: "Skills" },
  { href: "/sandbox", label: "Sandbox" },
  { href: "/projects", label: "Projects", emphasis: true },
];

const EMPHASIS_DESKTOP =
  "inline-flex items-center gap-1 border border-accent/50 px-2.5 py-1 font-medium text-accent transition-colors duration-[var(--dur-2)] hover:bg-accent hover:text-cream";
const EMPHASIS_MOBILE =
  "inline-flex items-center gap-1 border border-accent/50 px-3 py-1.5 font-medium text-accent transition-colors duration-[var(--dur-2)] hover:bg-accent hover:text-cream";

export function TopNav({
  visibleSections,
}: {
  /** Visible homepage section keys; links to hidden sections are omitted. */
  visibleSections?: string[];
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const sheetRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setOpen(false), []);
  useFocusTrap(sheetRef, open, close);

  const links = visibleSections
    ? LINKS.filter((link) => !link.section || visibleSections.includes(link.section))
    : LINKS;
  const showContact = visibleSections
    ? visibleSections.includes("connect")
    : true;

  // Hash links only resolve on the homepage, so only spy there.
  const onHome = pathname === "/";
  const spySections = onHome
    ? links.flatMap((link) => (link.section ? [link.section] : []))
    : [];
  const activeSection = useScrollSpy(spySections);

  const activeKey = onHome
    ? (activeSection ?? null)
    : (links.find((l) => !l.section && pathname.startsWith(l.href))?.href ??
      null);

  const isActive = (link: NavLink) =>
    link.section ? onHome && activeSection === link.section : activeKey === link.href;

  const { containerRef, box } = useIndicator<HTMLUListElement>(activeKey);

  return (
    <div className="sticky top-0 z-40 bg-cream/90 backdrop-blur lg:ml-80">
      <nav className="relative mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-ink" aria-label="Home">
            <UserCircle weight="duotone" size={24} className="text-accent" />
          </Link>

          <ul
            ref={containerRef}
            className="relative hidden items-center gap-6 text-body-s text-ink/70 sm:flex"
          >
            <span
              aria-hidden
              data-ready={box ? "true" : undefined}
              className="indicator -bottom-1 top-auto bg-accent"
              style={
                box
                  ? ({
                      "--ix": `${box.x}px`,
                      "--iy": `${box.y + box.h + 4}px`,
                      "--iw": `${box.w}px`,
                      "--ih": "1px",
                    } as CSSProperties)
                  : undefined
              }
            />
            {links.map((link) => (
              <li key={link.href} data-active={isActive(link)}>
                <Link
                  href={link.href}
                  aria-current={isActive(link) ? "page" : undefined}
                  className={
                    link.emphasis
                      ? EMPHASIS_DESKTOP
                      : "transition-colors duration-[var(--dur-2)] hover:text-ink"
                  }
                >
                  {link.label}
                  {link.emphasis && <ArrowUpRight weight="bold" size={12} />}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle className="flex text-ink/60 transition-colors duration-[var(--dur-2)] hover:text-ink" />
          {showContact && (
            <Link
              href="/#connect"
              className="hidden items-center gap-2 bg-ink px-4 py-2 text-body-s font-medium text-cream transition-colors duration-[var(--dur-2)] hover:bg-accent active:scale-[0.98] sm:flex"
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
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            {open ? <X size={22} /> : <List size={22} />}
          </button>
        </div>

        <span
          aria-hidden
          className="scroll-progress absolute inset-x-0 bottom-0 h-px bg-accent"
        />
      </nav>

      {/* Kept mounted so the exit animates. `inert` while closed is essential —
          otherwise the links stay tabbable behind a hidden panel. */}
      <div
        id="mobile-menu"
        ref={sheetRef}
        data-open={open}
        inert={!open}
        className="menu-sheet border-t border-ink/10 px-6 py-6 sm:hidden"
      >
        <ul className="flex flex-col items-center gap-6 text-body-m text-ink/70">
          {links.map((link, i) => (
            <li
              key={link.href}
              data-menu-item
              style={{ "--enter-i": i } as CSSProperties}
            >
              <Link
                href={link.href}
                onClick={close}
                className={
                  link.emphasis
                    ? EMPHASIS_MOBILE
                    : "transition-colors duration-[var(--dur-2)] hover:text-ink"
                }
              >
                {link.label}
                {link.emphasis && <ArrowUpRight weight="bold" size={14} />}
              </Link>
            </li>
          ))}
        </ul>
        {showContact && (
          <Link
            href="/#connect"
            onClick={close}
            data-menu-item
            style={{ "--enter-i": links.length } as CSSProperties}
            className="mt-4 flex items-center justify-center gap-2 bg-ink px-4 py-2.5 text-body-s font-medium text-cream transition-colors duration-[var(--dur-2)] hover:bg-accent"
          >
            <ChatCircle weight="duotone" size={16} />
            Contact Me
          </Link>
        )}
      </div>
    </div>
  );
}
