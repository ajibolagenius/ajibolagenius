import posthog from "posthog-js";

const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;

if (!posthogKey) {
  if (process.env.NODE_ENV === "development") {
    throw new Error(
      "NEXT_PUBLIC_POSTHOG_KEY variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NEXT_PUBLIC_POSTHOG_KEY is configured",
    );
  }
} else if (!posthogHost) {
  if (process.env.NODE_ENV === "development") {
    throw new Error(
      "NEXT_PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NEXT_PUBLIC_POSTHOG_HOST is configured",
    );
  }
} else {
  posthog.init(posthogKey, {
    // Same-origin, rewritten to PostHog in next.config.ts. A portfolio's
    // audience is developers and recruiters, who block third-party analytics
    // domains at a far higher rate than average — hitting eu.i.posthog.com
    // directly silently loses those visitors entirely.
    api_host: "/ingest",
    // The proxy above hides the real host, so the toolbar and "view in app"
    // links need it spelled out.
    ui_host: posthogHost,
    defaults: "2026-01-30",
    // Autocapture exceptions only in production. A developer's local errors,
    // such as a Next.js dev-server hot-reload chunk failure at localhost, must
    // not open issues in error tracking next to real user exceptions.
    capture_exceptions: process.env.NODE_ENV === "production",
    // Anonymous visitors stay profile-less: a portfolio is almost all one-off
    // traffic, and a person row per drive-by visit is cost with no payoff.
    // Preferences ride along as super properties instead (lib/analytics.ts).
    person_profiles: "identified_only",
    session_recording: {
      // The contact form collects a name, email and free-text message. None of
      // it should end up in a replay.
      maskAllInputs: true,
      maskTextSelector: "[data-ph-mask]",
    },
    debug: process.env.NODE_ENV === "development",
  });
}
