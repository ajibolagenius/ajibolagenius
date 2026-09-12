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
