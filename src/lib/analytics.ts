import posthog from "posthog-js";

// Single guard for the whole app. Without both variables posthog-js is never
// initialised (see instrumentation-client.ts), and calling capture() on an
// uninitialised client silently queues events that never send.
const enabled = Boolean(
  process.env.NEXT_PUBLIC_POSTHOG_KEY && process.env.NEXT_PUBLIC_POSTHOG_HOST,
);

export function track(event: string, properties?: Record<string, unknown>) {
  if (enabled) posthog.capture(event, properties);
}

export function trackException(error: unknown) {
  if (enabled) posthog.captureException(error);
}

/**
 * Super properties — merged into every subsequent event this session.
 *
 * Used instead of person properties on purpose: `person_profiles` is set to
 * `identified_only`, so anonymous visitors have no profile to write to and
 * setPersonProperties() would create one for every drive-by visit.
 */
export function registerProps(properties: Record<string, unknown>) {
  if (enabled) posthog.register(properties);
}

/**
 * Identifiers the server needs so its events land on the same person and the
 * same replay as the client's. Sent in the body of /api/assistant requests.
 */
export function analyticsIds(): {
  distinctId?: string;
  sessionId?: string;
} {
  if (!enabled) return {};
  return {
    distinctId: posthog.get_distinct_id(),
    sessionId: posthog.get_session_id(),
  };
}

// ---------------------------------------------------------------------------
// Owner exclusion
// ---------------------------------------------------------------------------

const OWNER_KEY = "portfolio_is_owner";

/**
 * Marks this browser as the owner's, so his own visits can be dropped from
 * every insight via PostHog's "Filter test accounts" toggle.
 *
 * A super property rather than `opt_out_capturing()`: events still record, so
 * session replay and error tracking keep working while he browses his own
 * site — they are just excluded from the numbers.
 *
 * posthog-js already drops localhost and 127.0.0.1 on its own (the
 * `defaults: "2026-01-30"` behaviour), so this only has to cover the owner
 * browsing the deployed site.
 */
export function setOwnerFlag(isOwner: boolean) {
  try {
    if (isOwner) localStorage.setItem(OWNER_KEY, "1");
    else localStorage.removeItem(OWNER_KEY);
  } catch {
    // Private mode or blocked storage — fall through and register anyway, so
    // the flag at least holds for this page load.
  }
  if (enabled) {
    if (isOwner) posthog.register({ is_owner: true });
    else posthog.unregister("is_owner");
  }
}

/**
 * Applies the sticky owner flag on load, and lets `?ph_owner=1` set it (or
 * `?ph_owner=0` clear it) on any device without needing to log in.
 */
export function syncOwnerFlag() {
  let stored = false;
  try {
    stored = localStorage.getItem(OWNER_KEY) === "1";
  } catch {
    // Unreadable storage — treat as not the owner.
  }

  const param = new URLSearchParams(window.location.search).get("ph_owner");
  if (param === "1" || param === "0") {
    setOwnerFlag(param === "1");
    return;
  }
  if (stored) setOwnerFlag(true);
}
