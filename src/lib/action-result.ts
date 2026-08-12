/**
 * What an admin server action hands back so the caller can toast it.
 *
 * These actions used to `throw new Error(error.message)` on a failed write,
 * which surfaces as the dev error overlay or a blank generic error in
 * production — the admin never learned which row failed or why. Returning a
 * result instead keeps the failure inside the UI.
 *
 * Plain module with no imports so both server actions and client components
 * can use the type.
 */
export type ActionResult = {
  ok: boolean;
  /** Shown verbatim in a toast, so write it for a reader, not a log. */
  message: string;
};

export const ok = (message: string): ActionResult => ({ ok: true, message });
export const failed = (message: string): ActionResult => ({
  ok: false,
  message,
});
