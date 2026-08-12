"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { FLASH_COOKIE, type FlashTone } from "@/lib/flash";
import { toast } from "@/lib/toast";

const TONES: FlashTone[] = ["success", "error", "info"];

function readFlash(): { tone: FlashTone; message: string } | null {
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${FLASH_COOKIE}=([^;]*)`),
  );
  if (!match) return null;

  const [tone, ...rest] = decodeURIComponent(match[1]).split(":");
  const message = rest.join(":").trim();
  if (!message || !TONES.includes(tone as FlashTone)) return null;

  return { tone: tone as FlashTone, message };
}

function clearFlash() {
  document.cookie = `${FLASH_COOKIE}=; path=/; max-age=0`;
}

/**
 * Drains the flash cookie set by redirecting server actions (see lib/flash.ts)
 * and shows it as a toast.
 *
 * Keyed on pathname because that is what changes when the redirect lands —
 * this component lives in the root layout and never remounts, so a mount-only
 * effect would fire once per full page load and miss every client navigation.
 */
export function FlashToaster() {
  const pathname = usePathname();

  useEffect(() => {
    const flash = readFlash();
    if (!flash) return;
    clearFlash();
    toast[flash.tone](flash.message);
  }, [pathname]);

  return null;
}
