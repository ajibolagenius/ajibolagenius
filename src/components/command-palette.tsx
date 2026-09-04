"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowRight,
  ArrowUpRight,
  Briefcase,
  Certificate,
  ChatCircle,
  Copy,
  DownloadSimple,
  Flask,
  Folder,
  GithubLogo,
  House,
  LinkedinLogo,
  MagnifyingGlass,
  Moon,
  Sparkle,
  Stack,
  Sun,
  UserCircle,
  X,
} from "@phosphor-icons/react/dist/ssr";
import type { Icon } from "@phosphor-icons/react";
import { useFocusTrap } from "@/hooks/use-focus-trap";
import { useRouteTransition } from "@/hooks/use-route-transition";
import { toast } from "@/lib/toast";
import { kindMeta } from "@/lib/project-kind";

interface ProjectData {
  id: string;
  slug: string;
  name: string;
  category: string;
  kind: string;
  tags?: string[];
  year?: string;
  description?: string;
}

interface PaletteData {
  projects: ProjectData[];
  email: string | null;
  social: {
    github?: string;
    linkedin?: string;
    twitter?: string;
  };
}

export type PaletteGroup =
  | "Quick Actions"
  | "Pages & Sections"
  | "Projects"
  | "Sandbox";

export interface PaletteItem {
  id: string;
  title: string;
  subtitle?: string;
  group: PaletteGroup;
  icon: Icon;
  badge?: string;
  keywords: string[];
  external?: boolean;
  onSelect: () => void;
}

let cachedData: PaletteData | null = null;
let fetchPromise: Promise<PaletteData | null> | null = null;

async function loadPaletteData(): Promise<PaletteData | null> {
  if (cachedData) return cachedData;
  if (fetchPromise) return fetchPromise;

  fetchPromise = fetch("/api/palette")
    .then((res) => {
      if (!res.ok) throw new Error("Failed to load palette data");
      return res.json();
    })
    .then((data: PaletteData) => {
      cachedData = data;
      return data;
    })
    .catch((err) => {
      console.error("Palette fetch error:", err);
      return null;
    })
    .finally(() => {
      fetchPromise = null;
    });

  return fetchPromise;
}

function subscribeTheme(callback: () => void) {
  window.addEventListener("theme-change", callback);
  return () => window.removeEventListener("theme-change", callback);
}

function getThemeSnapshot() {
  return document.documentElement.classList.contains("dark");
}

function getThemeServerSnapshot() {
  return false;
}

function subscribePlatform() {
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

export function CommandPalette() {
  const router = useRouter();
  const pathname = usePathname();
  const routeNavigate = useRouteTransition();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [data, setData] = useState<PaletteData | null>(() => cachedData);

  const isDark = useSyncExternalStore(
    subscribeTheme,
    getThemeSnapshot,
    getThemeServerSnapshot,
  );
  const isMac = useSyncExternalStore(
    subscribePlatform,
    getIsMacSnapshot,
    getIsMacServerSnapshot,
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    setIsOpen(false);
    setQuery("");
    setActiveIndex(0);
  }, []);

  useFocusTrap(containerRef, isOpen, close);

  // Preload data on idle or first user interaction
  useEffect(() => {
    if (cachedData) return;
    const timer = setTimeout(() => {
      loadPaletteData().then((res) => {
        if (res) setData(res);
      });
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Global hotkeys and event listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((open) => {
          if (!open && !cachedData) {
            loadPaletteData().then((res) => {
              if (res) setData(res);
            });
          }
          return !open;
        });
        return;
      }

      if (
        e.key === "/" &&
        !isOpen &&
        !(
          document.activeElement instanceof HTMLInputElement ||
          document.activeElement instanceof HTMLTextAreaElement ||
          document.activeElement?.getAttribute("contenteditable") === "true"
        )
      ) {
        e.preventDefault();
        if (!cachedData) {
          loadPaletteData().then((res) => {
            if (res) setData(res);
          });
        }
        setIsOpen(true);
      }
    };

    const handleOpenEvent = () => {
      if (!cachedData) {
        loadPaletteData().then((res) => {
          if (res) setData(res);
        });
      }
      setIsOpen(true);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("open-command-palette", handleOpenEvent);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("open-command-palette", handleOpenEvent);
    };
  }, [isOpen]);

  // Autofocus input on open
  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      });
    }
  }, [isOpen]);

  // Actions
  const handleToggleTheme = useCallback(() => {
    close();
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
    window.dispatchEvent(new CustomEvent("theme-change"));
    toast.info(`Switched to ${next ? "dark" : "light"} mode`);
  }, [close]);

  const handleCopyEmail = useCallback(() => {
    close();
    const email = data?.email || "ajiboladolapogenius@gmail.com";
    if (navigator.clipboard) {
      navigator.clipboard.writeText(email);
      toast.success("Email copied to clipboard", { description: email });
    } else {
      window.location.href = `mailto:${email}`;
    }
  }, [close, data?.email]);

  const handleOpenAiAssistant = useCallback(() => {
    close();
    window.dispatchEvent(new CustomEvent("open-ai-assistant"));
  }, [close]);

  const handleNavigate = useCallback(
    (href: string) => {
      close();
      if (href.startsWith("/#")) {
        const hash = href.slice(2);
        if (pathname === "/") {
          const el = document.getElementById(hash);
          if (el) {
            el.scrollIntoView({ behavior: "smooth" });
            return;
          }
        }
        router.push(href);
        return;
      }
      routeNavigate(href);
    },
    [close, pathname, routeNavigate, router],
  );

  // Build items catalog
  const allItems = useMemo<PaletteItem[]>(() => {
    const items: PaletteItem[] = [
      // Quick Actions
      {
        id: "action-theme",
        title: isDark ? "Switch to Light Theme" : "Switch to Dark Theme",
        subtitle: "Toggle visual color mode",
        group: "Quick Actions",
        icon: isDark ? Sun : Moon,
        badge: "Action",
        keywords: [
          "theme",
          "mode",
          "dark",
          "light",
          "toggle",
          "colors",
          "appearance",
        ],
        onSelect: handleToggleTheme,
      },
      {
        id: "action-copy-email",
        title: "Copy Email Address",
        subtitle: data?.email || "ajiboladolapogenius@gmail.com",
        group: "Quick Actions",
        icon: Copy,
        badge: "Action",
        keywords: [
          "email",
          "copy",
          "contact",
          "mail",
          "address",
          "message",
          "reach out",
        ],
        onSelect: handleCopyEmail,
      },
      {
        id: "action-ai",
        title: "Ask AI Assistant",
        subtitle: "Chat with grounding on Ajibola's work and experience",
        group: "Quick Actions",
        icon: Sparkle,
        badge: "AI",
        keywords: [
          "ai",
          "assistant",
          "chat",
          "ask",
          "gpt",
          "llm",
          "questions",
          "agent",
        ],
        onSelect: handleOpenAiAssistant,
      },
      {
        id: "action-download-cv",
        title: "Open Printable CV",
        subtitle: "Standardized curriculum vitae ready for print or PDF",
        group: "Quick Actions",
        icon: DownloadSimple,
        badge: "CV",
        keywords: ["cv", "resume", "pdf", "download", "print", "curriculum"],
        onSelect: () => handleNavigate("/cv"),
      },
    ];

    if (data?.social?.github) {
      const githubUrl = data.social.github;
      items.push({
        id: "action-github",
        title: "GitHub Profile",
        subtitle: githubUrl.replace(/^https?:\/\//, ""),
        group: "Quick Actions",
        icon: GithubLogo,
        badge: "External",
        external: true,
        keywords: ["github", "code", "repo", "git", "repositories", "profile"],
        onSelect: () => {
          close();
          window.open(githubUrl, "_blank", "noopener,noreferrer");
        },
      });
    }

    if (data?.social?.linkedin) {
      const linkedinUrl = data.social.linkedin;
      items.push({
        id: "action-linkedin",
        title: "LinkedIn Profile",
        subtitle: linkedinUrl.replace(/^https?:\/\//, ""),
        group: "Quick Actions",
        icon: LinkedinLogo,
        badge: "External",
        external: true,
        keywords: ["linkedin", "network", "connect", "profile", "career"],
        onSelect: () => {
          close();
          window.open(linkedinUrl, "_blank", "noopener,noreferrer");
        },
      });
    }

    // Pages & Sections
    items.push(
      {
        id: "nav-home",
        title: "Home",
        subtitle: "Overview, hero, and bio",
        group: "Pages & Sections",
        icon: House,
        badge: "Page",
        keywords: ["home", "overview", "index", "landing", "main"],
        onSelect: () => handleNavigate("/"),
      },
      {
        id: "nav-projects",
        title: "All Projects",
        subtitle: "Client work, side projects, and open source",
        group: "Pages & Sections",
        icon: Folder,
        badge: "Page",
        keywords: ["projects", "work", "portfolio", "showcase", "client"],
        onSelect: () => handleNavigate("/projects"),
      },
      {
        id: "nav-sandbox",
        title: "Sandbox Experiments",
        subtitle: "Interactive web toys and creative code labs",
        group: "Pages & Sections",
        icon: Flask,
        badge: "Page",
        keywords: ["sandbox", "lab", "experiments", "toys", "playground"],
        onSelect: () => handleNavigate("/sandbox"),
      },
      {
        id: "nav-cv",
        title: "Curriculum Vitae",
        subtitle: "Standalone full-length CV",
        group: "Pages & Sections",
        icon: Briefcase,
        badge: "Page",
        keywords: ["cv", "resume", "career", "history"],
        onSelect: () => handleNavigate("/cv"),
      },
      {
        id: "nav-licenses",
        title: "Licenses & Certifications",
        subtitle: "Verified credentials and certifications",
        group: "Pages & Sections",
        icon: Certificate,
        badge: "Page",
        keywords: ["licenses", "certifications", "credentials", "badges"],
        onSelect: () => handleNavigate("/licenses"),
      },
      {
        id: "nav-about",
        title: "About Me",
        subtitle: "Background, values, and principles",
        group: "Pages & Sections",
        icon: UserCircle,
        badge: "Section",
        keywords: ["about", "bio", "background", "story"],
        onSelect: () => handleNavigate("/#about"),
      },
      {
        id: "nav-experience",
        title: "Experience",
        subtitle: "Engineering and instructor track record",
        group: "Pages & Sections",
        icon: Briefcase,
        badge: "Section",
        keywords: [
          "experience",
          "jobs",
          "companies",
          "instructor",
          "lagos data school",
          "aptech",
          "deejoft",
        ],
        onSelect: () => handleNavigate("/#experience"),
      },
      {
        id: "nav-education",
        title: "Education",
        subtitle: "Academic degree and background",
        group: "Pages & Sections",
        icon: Certificate,
        badge: "Section",
        keywords: ["education", "degree", "university", "academic"],
        onSelect: () => handleNavigate("/#education"),
      },
      {
        id: "nav-skills",
        title: "Skills & Tech Stack",
        subtitle: "Frontend, backend, databases, and tools",
        group: "Pages & Sections",
        icon: Stack,
        badge: "Section",
        keywords: [
          "skills",
          "stack",
          "tools",
          "technologies",
          "react",
          "nextjs",
          "typescript",
          "node",
          "tailwind",
        ],
        onSelect: () => handleNavigate("/#skills"),
      },
      {
        id: "nav-connect",
        title: "Contact & Connect",
        subtitle: "Direct message form and socials",
        group: "Pages & Sections",
        icon: ChatCircle,
        badge: "Section",
        keywords: ["contact", "hire", "message", "connect", "touch", "email"],
        onSelect: () => handleNavigate("/#connect"),
      },
    );

    // Projects from Supabase
    if (data?.projects) {
      for (const p of data.projects) {
        const isSandbox = p.kind === "sandbox";
        const meta = kindMeta(p.kind);
        const badge = [meta.label, p.year].filter(Boolean).join(" · ");
        const href = isSandbox ? `/sandbox/${p.slug}` : `/projects/${p.slug}`;

        items.push({
          id: `project-${p.id}`,
          title: p.name,
          subtitle: p.description || p.category,
          group: isSandbox ? "Sandbox" : "Projects",
          icon: isSandbox ? Flask : Folder,
          badge,
          keywords: [
            p.name,
            p.category,
            p.kind,
            ...(p.tags || []),
            p.year || "",
            p.description || "",
          ],
          onSelect: () => handleNavigate(href),
        });
      }
    }

    return items;
  }, [
    isDark,
    data,
    handleToggleTheme,
    handleCopyEmail,
    handleOpenAiAssistant,
    handleNavigate,
    close,
  ]);

  // Filter and score items
  const filteredResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      // Default empty query view: actions and navigation pages
      return allItems.filter(
        (item) =>
          item.group === "Quick Actions" ||
          (item.group === "Pages & Sections" && item.badge === "Page"),
      );
    }

    const terms = q.split(/\s+/).filter(Boolean);

    const scored = allItems
      .map((item) => {
        const titleLower = item.title.toLowerCase();
        const subtitleLower = (item.subtitle || "").toLowerCase();
        const badgeLower = (item.badge || "").toLowerCase();
        const keywordsLower = item.keywords.map((k) => k.toLowerCase());

        // Check if every term matches somewhere
        const matchesAll = terms.every(
          (term) =>
            titleLower.includes(term) ||
            subtitleLower.includes(term) ||
            badgeLower.includes(term) ||
            keywordsLower.some((kw) => kw.includes(term)),
        );

        if (!matchesAll) return null;

        let score = 0;
        if (titleLower === q) score += 150;
        else if (titleLower.startsWith(q)) score += 100;
        else if (titleLower.includes(q)) score += 60;

        for (const term of terms) {
          if (titleLower.includes(term)) score += 30;
          if (keywordsLower.some((kw) => kw === term)) score += 40;
          else if (keywordsLower.some((kw) => kw.includes(term))) score += 20;
          if (subtitleLower.includes(term)) score += 15;
          if (badgeLower.includes(term)) score += 10;
        }

        return { item, score };
      })
      .filter((entry): entry is { item: PaletteItem; score: number } => entry !== null)
      .sort((a, b) => b.score - a.score)
      .map((entry) => entry.item);

    return scored;
  }, [allItems, query]);

  // Group filtered results while preserving flat list order
  const groupedResults = useMemo(() => {
    const groupOrder: PaletteGroup[] = [
      "Projects",
      "Sandbox",
      "Quick Actions",
      "Pages & Sections",
    ];
    const groups: { group: PaletteGroup; items: PaletteItem[] }[] = [];

    for (const groupName of groupOrder) {
      const itemsInGroup = filteredResults.filter((i) => i.group === groupName);
      if (itemsInGroup.length > 0) {
        groups.push({ group: groupName, items: itemsInGroup });
      }
    }

    return groups;
  }, [filteredResults]);

  // Flattened items in display order for index tracking
  const flatDisplayItems = useMemo(() => {
    return groupedResults.flatMap((g) => g.items);
  }, [groupedResults]);

  // Scroll active item into view
  useEffect(() => {
    if (!isOpen || flatDisplayItems.length === 0) return;
    const activeEl = listRef.current?.querySelector(
      `[data-item-index="${activeIndex}"]`,
    );
    if (activeEl) {
      activeEl.scrollIntoView({ block: "nearest" });
    }
  }, [activeIndex, isOpen, flatDisplayItems.length]);

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) =>
        flatDisplayItems.length === 0
          ? 0
          : (prev + 1) % flatDisplayItems.length,
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) =>
        flatDisplayItems.length === 0
          ? 0
          : (prev - 1 + flatDisplayItems.length) % flatDisplayItems.length,
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      const current = flatDisplayItems[activeIndex];
      if (current) {
        current.onSelect();
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      close();
    }
  };

  if (pathname?.startsWith("/admin") || !isOpen) return null;

  let runningIndex = 0;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
      className="fixed inset-0 z-50 flex items-start justify-center bg-ink/50 px-4 pt-[10vh] backdrop-blur-xs sm:pt-[14vh] print:hidden"
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div
        ref={containerRef}
        className="flex max-h-[min(580px,78vh)] w-full max-w-xl flex-col border border-ink/15 bg-cream shadow-2xl transition-all duration-[var(--dur-2)] ease-out-quart"
      >
        {/* Search header */}
        <div className="flex items-center gap-3 border-b border-ink/10 px-4 py-3.5">
          <MagnifyingGlass
            weight="duotone"
            size={20}
            className="shrink-0 text-accent"
          />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
            onKeyDown={handleInputKeyDown}
            placeholder="Search projects, pages, or run a command…"
            aria-autocomplete="list"
            aria-controls="palette-results"
            className="w-full bg-transparent font-sans text-body-m text-ink placeholder:text-ink/40 outline-none"
          />
          {query ? (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              aria-label="Clear search"
              className="text-ink/40 transition-colors hover:text-ink"
            >
              <X size={16} weight="bold" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-block border border-ink/15 bg-ink/5 px-1.5 py-0.5 font-mono text-[10px] text-ink/50">
              ESC
            </kbd>
          )}
        </div>

        {/* Results area */}
        <div
          ref={listRef}
          id="palette-results"
          role="listbox"
          className="flex-1 overflow-y-auto p-2"
        >
          {flatDisplayItems.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-body-s font-medium text-ink/70">
                No matching results found for &ldquo;{query}&rdquo;
              </p>
              <p className="mt-1 text-body-xs text-ink/40">
                Try searching for a project name (e.g. Zora, AfroGraph), tech stack (Next.js, AI), or a page.
              </p>
            </div>
          ) : (
            groupedResults.map((group) => (
              <div key={group.group} className="mb-2 last:mb-0">
                <div className="px-3 pb-1 pt-2 font-mono text-[11px] uppercase tracking-wider text-ink/40">
                  {group.group} ({group.items.length})
                </div>
                {group.items.map((item) => {
                  const currentIndex = runningIndex++;
                  const isSelected = currentIndex === activeIndex;
                  const Icon = item.icon;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      data-item-index={currentIndex}
                      onClick={item.onSelect}
                      onMouseEnter={() => setActiveIndex(currentIndex)}
                      className={`flex w-full items-center justify-between gap-3 px-3 py-2 text-left transition-colors duration-[var(--dur-1)] ${
                        isSelected
                          ? "bg-ink/5 text-ink dark:bg-ink/10"
                          : "text-ink/75 hover:bg-ink/[0.03]"
                      }`}
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div
                          className={`flex h-6 w-6 shrink-0 items-center justify-center transition-colors ${
                            isSelected ? "text-accent" : "text-ink/50"
                          }`}
                        >
                          <Icon size={18} weight="duotone" />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-body-s font-medium text-ink">
                            {item.title}
                          </p>
                          {item.subtitle && (
                            <p className="truncate text-body-xs text-ink/50">
                              {item.subtitle}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-2">
                        {item.badge && (
                          <span className="border border-ink/10 px-1.5 py-0.5 font-mono text-[10px] text-ink/50">
                            {item.badge}
                          </span>
                        )}
                        {item.external ? (
                          <ArrowUpRight
                            size={12}
                            weight="bold"
                            className="text-ink/40"
                          />
                        ) : isSelected ? (
                          <span className="font-mono text-[11px] text-accent">
                            ↵
                          </span>
                        ) : (
                          <ArrowRight
                            size={12}
                            className="opacity-0 transition-opacity"
                          />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer command bar */}
        <div className="flex items-center justify-between border-t border-ink/10 bg-ink/[0.02] px-4 py-2 font-mono text-[11px] text-ink/45">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="mr-1 text-ink/60">↑</kbd>
              <kbd className="mr-1 text-ink/60">↓</kbd>
              Navigate
            </span>
            <span>
              <kbd className="mr-1 text-ink/60">↵</kbd>
              Select
            </span>
            <span>
              <kbd className="mr-1 text-ink/60">esc</kbd>
              Close
            </span>
          </div>
          <span className="hidden sm:inline">
            {isMac ? "⌘K" : "Ctrl+K"} anywhere
          </span>
        </div>
      </div>
    </div>
  );
}
