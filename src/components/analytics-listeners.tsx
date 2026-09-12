"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { sound } from "@/lib/sound";
import { track, registerProps } from "@/lib/analytics";

/**
 * Site-wide analytics that would otherwise mean editing every component.
 *
 * Outbound clicks are caught by one delegated listener rather than an onClick
 * on each anchor: it catches links in components nobody remembered to
 * instrument, including ones added later.
 *
 * Preferences are read from the same window events the toggles already
 * dispatch (`theme-change`, `language-change`, `portfolio-sound-change`), so
 * none of the three toggle components needed touching.
 */

// Long-form routes worth measuring read depth on. Everything else is either
// a listing page or short enough that scroll position says nothing.
function readableKind(pathname: string): string | null {
  if (/^\/notes\/[^/]+$/.test(pathname)) return "note";
  if (/^\/projects\/[^/]+$/.test(pathname)) return "case_study";
  return null;
}

function currentTheme() {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function currentLocale() {
  try {
    return localStorage.getItem("portfolio_locale") ?? "en";
  } catch {
    return "en";
  }
}

export function AnalyticsListeners() {
  const pathname = usePathname();

  // ---- Outbound links, mailto and tel -------------------------------------
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as Element | null)?.closest?.("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      if (href.startsWith("mailto:")) {
        track("contact_channel_clicked", { channel: "email" });
        return;
      }
      if (href.startsWith("tel:")) {
        track("contact_channel_clicked", { channel: "phone" });
        return;
      }

      // Relative hrefs never parse as a different origin, so bail early rather
      // than constructing a URL for every in-app link click.
      if (!/^https?:\/\//i.test(href)) return;

      let url: URL;
      try {
        url = new URL(href);
      } catch {
        return;
      }
      if (url.host === window.location.host) return;

      track("outbound_link_clicked", {
        destination_host: url.host,
        destination_url: url.href,
        link_text: anchor.textContent?.trim().slice(0, 80) || null,
        from_path: window.location.pathname,
      });
    };

    // Capture phase: several cards call preventDefault() and route themselves,
    // and WhatsApp/social links stop propagation on the way up.
    document.addEventListener("click", onClick, { capture: true });
    return () =>
      document.removeEventListener("click", onClick, { capture: true });
  }, []);

  // ---- Preferences as super properties ------------------------------------
  useEffect(() => {
    const sync = () =>
      registerProps({
        theme: currentTheme(),
        locale: currentLocale(),
        sound_enabled: sound.isEnabled(),
        reduced_motion: window.matchMedia("(prefers-reduced-motion: reduce)")
          .matches,
      });

    sync();

    const onTheme = () => {
      sync();
      track("preference_changed", { preference: "theme", value: currentTheme() });
    };
    const onLanguage = () => {
      sync();
      track("preference_changed", {
        preference: "locale",
        value: currentLocale(),
      });
    };
    const onSound = () => {
      sync();
      track("preference_changed", {
        preference: "sound",
        value: sound.isEnabled(),
      });
    };

    window.addEventListener("theme-change", onTheme);
    window.addEventListener("language-change", onLanguage);
    window.addEventListener("portfolio-sound-change", onSound);
    return () => {
      window.removeEventListener("theme-change", onTheme);
      window.removeEventListener("language-change", onLanguage);
      window.removeEventListener("portfolio-sound-change", onSound);
    };
  }, []);

  // ---- Read depth on long-form pages --------------------------------------
  useEffect(() => {
    const kind = pathname ? readableKind(pathname) : null;
    if (!kind) return;

    const slug = pathname!.split("/").pop()!;
    const reached = new Set<number>();
    const startedAt = Date.now();
    let frame = 0;

    const measure = () => {
      frame = 0;
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;
      // Short page: nothing to scroll, so depth can't distinguish a read from
      // a bounce. The dwell time on the 100% event still does.
      const percent =
        scrollable <= 0
          ? 100
          : Math.round((window.scrollY / scrollable) * 100);

      for (const milestone of [50, 90]) {
        if (percent >= milestone && !reached.has(milestone)) {
          reached.add(milestone);
          track("content_read_progress", {
            content_kind: kind,
            slug,
            percent: milestone,
            seconds_on_page: Math.round((Date.now() - startedAt) / 1000),
          });
        }
      }
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [pathname]);

  return null;
}
