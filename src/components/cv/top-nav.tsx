"use client";

import {
  useCallback,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
} from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChatCircle,
  List,
  MagnifyingGlass,
  UserCircle,
  X,
} from "@phosphor-icons/react/dist/ssr";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { useLanguage } from "@/lib/i18n";
import { useFocusTrap } from "@/hooks/use-focus-trap";
import { useIndicator } from "@/hooks/use-indicator";
import { useScrollSpy } from "@/hooks/use-scroll-spy";

type NavLink = {
  href: string;
  label: string;
  /** Homepage section key. Route links omit it and always render. */
  section?: string;
};

// Streamlined to 4 core destinations to keep the header airy and spacious.
// Granular resume sections (education, skills, etc.) remain in page flow,
// printable CV (/cv), and instantly searchable via the Command Palette (⌘K).
const LINKS: NavLink[] = [
  { href: "/projects", label: "Projects" },
  { href: "/notes", label: "Notes" },
  { href: "/#experience", section: "experience", label: "Experience" },
  { href: "/#about", section: "about", label: "About" },
  { href: "/sandbox", label: "Sandbox" },
];

function subscribeEmpty() {
  return () => {};
}

function getIsMacSnapshot() {
  return (
    typeof navigator !== "undefined" &&
    /Mac|iPhone|iPad|iPod/.test(navigator.userAgent)
  );
}

function getIsMacServerSnapshot() {
  return true;
}

export function TopNav({
  visibleSections,
}: {
  /** Visible homepage section keys; links to hidden sections are omitted. */
  visibleSections?: string[];
}) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const sheetRef = useRef<HTMLDivElement>(null);
  const isMac = useSyncExternalStore(
    subscribeEmpty,
    getIsMacSnapshot,
    getIsMacServerSnapshot,
  );

  const getNavLabel = (link: NavLink) => {
    if (link.section === "about") return t.nav.about;
    if (link.section === "experience") return t.nav.experience;
    if (link.href === "/projects") return t.nav.projects;
    if (link.href === "/notes") return t.nav.notes;
    if (link.href === "/sandbox") return t.nav.sandbox;
    return link.label;
  };

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
      <nav className="relative mx-auto flex max-w-3xl xl:max-w-5xl 2xl:max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-6 sm:gap-7">
          <Link
            href="/"
            className="text-ink transition-opacity hover:opacity-80 shrink-0"
            aria-label={t.nav.home}
          >
            <UserCircle weight="duotone" size={24} className="text-accent" />
          </Link>

          <ul
            ref={containerRef}
            className="relative hidden items-center gap-5 md:gap-6 text-body-s text-ink/70 sm:flex"
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
                  className="whitespace-nowrap transition-colors duration-[var(--dur-2)] hover:text-ink"
                >
                  {getNavLabel(link)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={() =>
              window.dispatchEvent(new CustomEvent("open-command-palette"))
            }
            aria-label={`${t.nav.searchCommands} (⌘K)`}
            className="group flex items-center gap-1.5 border border-ink/10 bg-ink/[0.04] px-2.5 py-1.5 text-body-xs text-ink/65 transition-colors duration-[var(--dur-2)] hover:border-accent hover:text-ink whitespace-nowrap"
          >
            <MagnifyingGlass
              weight="bold"
              size={14}
              className="text-accent transition-transform duration-[var(--dur-2)] group-hover:scale-110"
            />
            <kbd className="hidden font-mono text-[10px] text-ink/40 sm:inline-block">
              {isMac ? "⌘K" : "Ctrl+K"}
            </kbd>
          </button>
          <LanguageToggle className="flex" />
          <ThemeToggle className="flex text-ink/60 transition-colors duration-[var(--dur-2)] hover:text-ink" />
          {showContact && (
            <Link
              href="/#connect"
              className="hidden items-center gap-2 bg-ink px-4 py-2 text-body-s font-medium text-cream whitespace-nowrap shrink-0 transition-colors duration-[var(--dur-2)] hover:bg-accent active:scale-[0.98] sm:flex"
            >
              <ChatCircle weight="duotone" size={16} />
              {t.nav.contactMe}
            </Link>
          )}

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="text-ink sm:hidden"
            aria-label={t.nav.toggleMenu}
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

      {/* Kept mounted so the exit animates, but positioned OUT OF FLOW.
          visibility:hidden stops painting, not layout — in flow the closed
          sheet still grew the sticky container, which then painted its
          bg-cream/90 backdrop-blur over the page beneath it.
          `inert` while closed is essential — otherwise the links stay
          tabbable behind a hidden panel. */}
      <div
        id="mobile-menu"
        ref={sheetRef}
        data-open={open}
        inert={!open}
        className="menu-sheet absolute inset-x-0 top-full border-t border-ink/10 bg-cream/95 px-6 py-6 backdrop-blur sm:hidden"
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
                className="whitespace-nowrap transition-colors duration-[var(--dur-2)] hover:text-ink"
              >
                {getNavLabel(link)}
              </Link>
            </li>
          ))}
          <li
            data-menu-item
            style={{ "--enter-i": links.length } as CSSProperties}
          >
            <Link
              href="/cv"
              onClick={close}
              className="whitespace-nowrap transition-colors duration-[var(--dur-2)] hover:text-ink"
            >
              {t.nav.cv}
            </Link>
          </li>
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
            {t.nav.contactMe}
          </Link>
        )}
        <button
          type="button"
          onClick={() => {
            close();
            window.dispatchEvent(new CustomEvent("open-command-palette"));
          }}
          data-menu-item
          style={{ "--enter-i": links.length + 1 } as CSSProperties}
          className="mt-2.5 flex w-full items-center justify-center gap-2 border border-ink/15 bg-ink/5 px-4 py-2.5 text-body-s font-medium text-ink/75 transition-colors duration-[var(--dur-2)] hover:border-accent hover:text-ink"
        >
          <MagnifyingGlass weight="bold" size={16} className="text-accent" />
          {t.nav.searchCommands} (⌘K)
        </button>
      </div>
    </div>
  );
}
