# Give the PWA a real offline story

**Status:** open. Filed out of the simplification review (2026-09-19), which
proposed deleting the service worker; the decision was to keep the PWA and
fix it properly instead.

## The problem

The app installs — `src/app/manifest.ts` is complete, with icons, colours and
`display: standalone` — and it registers a service worker. But the worker
cannot serve a single page offline.

`src/app/sw.js/route.ts:38-61` early-returns on everything except
`/_next/static/`:

```js
if (request.method !== "GET") return;
const url = new URL(request.url);
if (url.origin !== self.location.origin) return;
if (!url.pathname.startsWith("/_next/static/")) return;
```

Two consequences:

1. **The one thing it caches is already cached.** Vercel serves
   `/_next/static/` with `Cache-Control: public, max-age=31536000, immutable`.
   Those files are content-hashed and the browser HTTP cache never revalidates
   them. The worker is a second cache in front of a cache that already works.
2. **No document is ever cached**, so opening the installed app without a
   network gives the browser's offline error page. Installing it is a worse
   experience than a bookmark, because the standalone window has no URL bar to
   retry from.

So the ~220 lines across `sw.js/route.ts`,
`components/pwa/service-worker-registration.tsx` and
`components/pwa/update-modal.tsx` currently buy exactly one feature: the
"new version available" modal.

## What to build

Aim for the smallest thing that makes "installed and offline" not broken.

### 1. An offline fallback document

Add `src/app/offline/page.tsx` — a static route, no Supabase calls, that says
the app is offline and offers a retry. Precache it in the worker's `install`
handler along with the icons, then serve it as the fallback for failed
navigations:

```js
self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(() => caches.match("/offline")),
    );
    return;
  }
  // …existing /_next/static/ branch…
});
```

Network-first for navigations, not cache-first: this site's pages are
Supabase-backed and change whenever the admin edits a row, so a stale cached
page is worse than a slow one.

### 2. Decide whether real pages are worth caching

Optional, and only if §1 proves insufficient. A stale-while-revalidate cache
over `/`, `/projects`, `/notes` and `/cv` would make the installed app usable
on a plane. The cost is a staleness window on content the owner edits live —
weigh it then, not now.

### 3. Then reconsider the `/_next/static/` branch

Once navigations are handled, re-measure whether that branch earns its place.
It very likely does not, for the reason in §1 above. Deleting it is ~20 lines
and loses nothing.

## Verification

The part that is easy to get wrong is that a service worker's behaviour is
invisible until the network is gone. Check all four:

1. `pnpm build && pnpm start`, load the site, then DevTools → Application →
   Service Workers → **Offline**, and reload. Expect the offline page, not the
   browser error.
2. Install the app (Chrome address bar → Install), kill the network, launch it
   from the OS. Same expectation, in the standalone window that has no URL bar.
3. Deploy twice and confirm the update modal still appears — `CACHE_NAME` is
   keyed on `VERCEL_GIT_COMMIT_SHA`, and a precache list is a new way for the
   `install` step to fail and strand the old worker.
4. Confirm `/admin` still works offline-degraded rather than serving a cached
   shell over a logged-out session.

## Not in scope

Background sync, push notifications, offline mutation queues. This is a
portfolio; the bar is "does not show a browser error when installed".

## Related

- `docs/simplification-plan.md` §5.1 — the review that raised this.
