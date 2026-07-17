"use server";

import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";

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
    return { success: true };
  }

  const headerStore = await headers();
  const ip =
    headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headerStore.get("x-real-ip") ||
    "unknown";
  if (isRateLimited(ip)) {
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

  if (error) return { error: "Something went wrong. Please try again." };

  return { success: true };
}
