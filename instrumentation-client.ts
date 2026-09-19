import posthog from "posthog-js";

const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;

if (!posthogKey || !posthogHost) {
  // Loud in development only: without both, posthog-js is never initialised
  // and every capture() is silently dropped, which is the kind of thing you
  // discover a month later with no data. Production stays quiet.
  if (process.env.NODE_ENV === "development") {
    const missing = !posthogKey
      ? "NEXT_PUBLIC_POSTHOG_KEY"
      : "NEXT_PUBLIC_POSTHOG_HOST";
    throw new Error(
      `${missing} is missing or un-configured, so PostHog events are silently dropped. This error stops appearing once ${missing} is set.`,
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
    capture_exceptions: true,
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
