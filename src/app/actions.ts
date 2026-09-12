"use server";

import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { trackServer, fallbackDistinctId } from "@/lib/posthog-server";

// Lightweight in-process rate limiter. On Fluid Compute instances are reused
// across requests, so this throttles bursts from a single IP without external
// infrastructure. For stronger guarantees (and cross-instance limits), add a
// captcha (Cloudflare Turnstile) and a shared store (Vercel KV / Upstash).
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 3;
const hits = new Map<string, number[]>();

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter(
    (t) => now - t < RATE_LIMIT_WINDOW_MS,
  );
  if (recent.length >= RATE_LIMIT_MAX) {
    hits.set(key, recent);
    return true;
  }
  recent.push(now);
  hits.set(key, recent);
  // Opportunistic cleanup so the map can't grow unbounded.
  if (hits.size > 5000) {
    for (const [k, v] of hits) {
      if (v.every((t) => now - t >= RATE_LIMIT_WINDOW_MS)) hits.delete(k);
    }
  }
  return false;
}

export async function submitContactMessage(
  formData: FormData,
): Promise<{ success: true } | { error: string }> {
  // Honeypot: a hidden field real users never fill. Bots that auto-complete
  // every input trip it. Silently accept to avoid signalling the check.
  const trap = String(formData.get("company") ?? "").trim();
  if (trap) {
    // Counted, not stored. Bot volume is the only way to tell a quiet week
    // apart from a broken form.
    await trackServer("contact_message_rejected", "anon_bot", {
      reason: "honeypot",
    });
    return { success: true };
  }

  const headerStore = await headers();
  const ip =
    headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headerStore.get("x-real-ip") ||
    "unknown";
  if (isRateLimited(ip)) {
    await trackServer("contact_message_rejected", fallbackDistinctId(ip), {
      reason: "rate_limited",
    });
    return { error: "Too many messages. Please try again in a minute." };
  }

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name || !email || !message) {
    return { error: "Please fill in all fields." };
  }
  if (name.length > 200) {
    return { error: "Name is too long." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 320) {
    return { error: "Please enter a valid email address." };
  }
  if (message.length > 5000) {
    return { error: "Message is too long." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("contact_messages")
    .insert({ name, email, message });

  if (error) {
    // The one failure the visitor can do nothing about, and the one the
    // client-side `contact_message_failed` event cannot distinguish from a
    // validation error. Worth its own server-side event.
    await trackServer("contact_message_rejected", fallbackDistinctId(ip), {
      reason: "database_insert_failed",
      code: error.code ?? null,
    });
    return { error: "Something went wrong. Please try again." };
  }

  return { success: true };
}
