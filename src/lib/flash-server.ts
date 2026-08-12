import { cookies } from "next/headers";
import { FLASH_COOKIE, type FlashTone } from "./flash";

/** Call from a server action, before `redirect()`. */
export async function setFlash(tone: FlashTone, message: string) {
  const store = await cookies();
  store.set(FLASH_COOKIE, `${tone}:${message}`, {
    path: "/",
    httpOnly: false,
    sameSite: "lax",
    // Short: this is meant to be consumed by the very next page render. If
    // something goes wrong and it is not, it expires rather than greeting the
    // user with a stale success message on their next visit.
    maxAge: 30,
  });
}
