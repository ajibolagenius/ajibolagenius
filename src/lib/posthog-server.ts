import { PostHog } from "posthog-node";

// Same public project token the browser uses — it is write-only ingest
// credentials, not a secret. Reads the server-side copy of the vars so this
// keeps working if the NEXT_PUBLIC_ prefix is ever dropped from the client.
const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

// Module scope, so Fluid Compute's reused instances share one client and one
// connection pool rather than building a new one per request.
const client =
  key && host
    ? new PostHog(key, {
        host,
        // Every call site uses captureImmediate(), so the batching queue never
        // holds anything — these just stop it from waiting around on shutdown.
        flushAt: 1,
        flushInterval: 0,
      })
    : null;

/**
 * Fire-and-forget server event. Awaited so the request isn't torn down
 * mid-send, but never allowed to fail the caller: analytics must not be able
 * to break the contact form or the assistant.
 */
export async function trackServer(
  event: string,
  distinctId: string,
  properties: Record<string, unknown> = {},
) {
  if (!client) return;
  try {
    await client.captureImmediate({ distinctId, event, properties });
  } catch {
    // Ingest is down or slow — drop the event rather than the request.
  }
}

export async function trackServerException(
  error: unknown,
  distinctId: string,
  properties: Record<string, unknown> = {},
) {
  if (!client) return;
  try {
    await client.captureExceptionImmediate(error, distinctId, properties);
  } catch {
    // As above.
  }
}

/**
 * Anonymous visitors have no distinct ID to send, so the server falls back to
 * a stable per-IP hash. Keeps server events groupable without inventing a
 * person profile or storing the IP itself.
 */
export function fallbackDistinctId(ip: string): string {
  let hash = 0;
  for (let i = 0; i < ip.length; i++) {
    hash = (hash * 31 + ip.charCodeAt(i)) | 0;
  }
  return `anon_${(hash >>> 0).toString(36)}`;
}
