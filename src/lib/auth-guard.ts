import "server-only";
import { createClient } from "@/lib/supabase/server";
import { OWNER_EMAIL } from "@/lib/owner";
import type { SupabaseClient } from "@supabase/supabase-js";

// Server Actions are publicly-invocable POST endpoints and are intentionally
// skipped by the /admin route middleware (it early-returns on POST/next-action
// to avoid breaking body streaming). Authorize every mutating action explicitly
// here rather than relying on RLS alone, so a single policy regression can't
// open a hole. Returns the authenticated Supabase client for convenience.
export async function assertOwner(): Promise<SupabaseClient> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || user.email !== OWNER_EMAIL) {
    throw new Error("Unauthorized");
  }
  return supabase;
}
