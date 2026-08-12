/**
 * One-shot notice that survives a redirect — the shared half.
 *
 * Needed because a server action that ends in `redirect()` — creating or
 * updating a project — has no return value the client can toast: the response
 * IS the navigation. So the action leaves a note in a cookie and the client
 * picks it up on the other side.
 *
 * The writer lives in `flash-server.ts` and this file holds only the contract,
 * because <FlashToaster> is a client component: anything it imports must not
 * pull in `next/headers`, which is server-only.
 *
 * The cookie is deliberately NOT httpOnly — the client reads it and clears it,
 * since cookies can only be mutated in an action or route handler, never during
 * render. Nothing sensitive goes in it: treat the value as public, because it
 * is.
 */

export const FLASH_COOKIE = "flash";

export type FlashTone = "success" | "error" | "info";

