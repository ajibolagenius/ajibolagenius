"use client";

import {
  useCallback,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { List, MagnifyingGlass, X } from "@phosphor-icons/react/dist/ssr";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { SoundToggle } from "@/components/sound-toggle";
import { useLanguage } from "@/lib/i18n";
import { useFocusTrap } from "@/hooks/use-focus-trap";

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

/**
 * Three destinations and the CV. The CV is the one filled button: it is the
 * thing a recruiter came for. Everything else (sandbox, sections, the radio)
 * is a ⌘K away.
 */
export function TopNav({
  visibleSections,
}: {
  /** Visible homepage section keys; the contact link follows "connect". */
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

  const close = useCallback(() => setOpen(false), []);
  useFocusTrap(sheetRef, open, close);

  const showContact = visibleSections ? visibleSections.includes("connect") : true;
  const links = [
    { href: "/projects", label: t.nav.work },
    { href: "/notes", label: t.nav.writing },
    ...(showContact ? [{ href: "/#connect", label: t.nav.contact }] : []),
  ];
  const isActive = (href: string) => !href.includes("#") && pathname.startsWith(href);

  const openPalette = () =>
    window.dispatchEvent(new CustomEvent("open-command-palette"));

  const cvButton =
    "flex items-center bg-ink px-3 py-1.5 font-mono text-body-xs text-cream whitespace-nowrap transition-colors duration-[var(--dur-2)] hover:bg-accent active:scale-[0.98]";

  return (
    <div className="sticky top-0 z-40 bg-cream/90 backdrop-blur">
      <nav className="relative mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4">
        <Link
          href="/"
          aria-label={t.nav.home}
          className="flex shrink-0 items-center gap-2.5 font-display text-[1.25rem] text-ink"
        >
          <Image
            src="/avatar_3d.png"
            alt=""
            width={34}
            height={34}
            priority
            className="size-[34px]"
          />
          <span>
            ajibola<span className="text-accent">.</span>
          </span>
        </Link>

        <div className="flex items-center gap-4 sm:gap-5">
          <ul className="hidden items-center gap-5 font-mono text-body-xs sm:flex">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  className="whitespace-nowrap lowercase text-ink/60 transition-colors duration-[var(--dur-2)] hover:text-ink aria-[current=page]:text-ink aria-[current=page]:underline aria-[current=page]:decoration-accent aria-[current=page]:underline-offset-4"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <Link href="/cv" className={cvButton}>
            {t.nav.cv} ↗
          </Link>

          <div className="flex items-center gap-2.5 sm:border-l sm:border-ink/10 sm:pl-4">
            <button
              type="button"
              onClick={openPalette}
              aria-label={`${t.nav.searchCommands} (⌘K)`}
              className="group hidden items-center gap-1.5 text-ink/60 transition-colors duration-[var(--dur-2)] hover:text-ink sm:flex"
            >
              <MagnifyingGlass weight="bold" size={14} className="text-accent" />
              <kbd className="font-mono text-[10px] text-ink/40">
                {isMac ? "⌘K" : "Ctrl+K"}
              </kbd>
            </button>
            <LanguageToggle className="flex" />
            <ThemeToggle className="flex text-ink/60 transition-colors duration-[var(--dur-2)] hover:text-ink" />
            <SoundToggle className="hidden text-ink/60 transition-colors duration-[var(--dur-2)] hover:text-ink sm:flex" />
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
        </div>

        <span
          aria-hidden
          className="scroll-progress absolute inset-x-0 bottom-0 h-px bg-accent"
        />
      </nav>

      {/* Kept mounted so the exit animates, but out of flow and `inert` while
          closed — in flow, the closed sheet grew the sticky bar's backdrop over
          the page, and without inert its links stayed tabbable. */}
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
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <div
          data-menu-item
          style={{ "--enter-i": links.length } as CSSProperties}
          className="mt-6 flex items-center justify-center gap-5"
        >
          <SoundToggle className="flex text-ink/60 transition-colors duration-[var(--dur-2)] hover:text-ink" />
        </div>
        <button
          type="button"
          onClick={() => {
            close();
            openPalette();
          }}
          data-menu-item
          style={{ "--enter-i": links.length + 1 } as CSSProperties}
          className="mt-4 flex w-full items-center justify-center gap-2 border border-ink/15 bg-ink/5 px-4 py-2.5 text-body-s font-medium text-ink/75 transition-colors duration-[var(--dur-2)] hover:border-accent hover:text-ink"
        >
          <MagnifyingGlass weight="bold" size={16} className="text-accent" />
          {t.nav.searchCommands} (⌘K)
        </button>
      </div>
    </div>
  );
}
