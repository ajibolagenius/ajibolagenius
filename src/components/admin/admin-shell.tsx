"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import {
  ArrowSquareOut,
  Briefcase,
  Certificate,
  ChatCircleText,
  EnvelopeSimple,
  GraduationCap,
  IdentificationBadge,
  Lightning,
  List,
  Password,
  Plus,
  Quotes,
  SignOut,
  SquaresFour,
  Translate,
  X,
} from "@phosphor-icons/react/dist/ssr";
import type { Icon } from "@phosphor-icons/react";
import { ADMIN_RESOURCES } from "@/lib/admin-resources";
import { signOut } from "@/app/admin/actions";
import { ThemeToggle } from "@/components/theme-toggle";

const RESOURCE_ICONS: Record<string, Icon> = {
  "personal-info": IdentificationBadge,
  skills: Lightning,
  experience: Briefcase,
  education: GraduationCap,
  certifications: Certificate,
  languages: Translate,
  sections: SquaresFour,
  recommendations: Quotes,
};

function NavLink({
  href,
  label,
  icon: IconComponent,
  active,
  badge,
}: {
  href: string;
  label: string;
  icon: Icon;
  active: boolean;
  badge?: number;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={clsx(
        "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors",
        active
          ? "bg-accent/10 font-medium text-accent"
          : "text-ink/70 hover:bg-ink/5 hover:text-ink",
      )}
    >
      <IconComponent size={17} weight={active ? "fill" : "duotone"} />
      <span className="flex-1 truncate">{label}</span>
      {!!badge && (
        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1.5 text-xs font-medium text-white">
          {badge > 99 ? "99+" : badge}
        </span>
      )}
    </Link>
  );
}

export function AdminShell({
  unreadCount,
  children,
}: {
  unreadCount: number;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close the mobile drawer whenever navigation happens.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Prevent background scroll while the drawer is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-ink/10 px-4 py-4">
        <Link href="/admin" className="text-sm font-semibold tracking-wide">
          Admin Console
        </Link>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="flex h-8 w-8 items-center justify-center text-ink/60 transition-colors hover:text-ink lg:hidden"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div className="flex flex-col gap-0.5">
          <NavLink
            href="/admin"
            label="Dashboard"
            icon={SquaresFour}
            active={
              isActive("/admin") ||
              (pathname.startsWith("/admin/projects/") &&
                pathname !== "/admin/projects/new")
            }
          />
          <NavLink
            href="/admin/projects/new"
            label="New project"
            icon={Plus}
            active={pathname === "/admin/projects/new"}
          />
          <NavLink
            href="/admin/messages"
            label="Messages"
            icon={EnvelopeSimple}
            active={isActive("/admin/messages")}
            badge={unreadCount}
          />
        </div>

        <p className="mt-6 mb-1.5 px-3 text-xs font-medium uppercase tracking-wider text-ink/40">
          CV content
        </p>
        <div className="flex flex-col gap-0.5">
          {Object.entries(ADMIN_RESOURCES).map(([key, config]) => (
            <NavLink
              key={key}
              href={`/admin/manage/${key}`}
              label={config.label}
              icon={RESOURCE_ICONS[key] ?? ChatCircleText}
              active={isActive(`/admin/manage/${key}`)}
            />
          ))}
        </div>
      </nav>

      <div className="border-t border-ink/10 px-3 py-3">
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm text-ink/70 transition-colors hover:bg-ink/5 hover:text-ink"
        >
          <ArrowSquareOut size={17} weight="duotone" />
          View site
        </a>
        <NavLink
          href="/admin/reset-password"
          label="Change password"
          icon={Password}
          active={isActive("/admin/reset-password")}
        />
        <form action={signOut}>
          <button
            type="submit"
            className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm text-ink/70 transition-colors hover:bg-red-500/10 hover:text-red-600"
          >
            <SignOut size={17} weight="duotone" />
            Sign out
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-ink/10 bg-cream/90 px-4 py-3 backdrop-blur lg:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="flex h-8 w-8 items-center justify-center text-ink/70 transition-colors hover:text-ink"
        >
          <List size={20} />
        </button>
        <Link href="/admin" className="text-sm font-semibold tracking-wide">
          Admin Console
        </Link>
        <ThemeToggle />
      </header>

      {/* Drawer overlay (mobile) */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-ink/40 lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}

      {/* Sidebar: drawer on mobile, fixed on desktop */}
      <aside
        className={clsx(
          "fixed inset-y-0 left-0 z-50 w-64 border-r border-ink/10 bg-panel transition-transform duration-200 lg:z-20 lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {sidebar}
      </aside>

      <div className="lg:pl-64">{children}</div>
    </div>
  );
}
