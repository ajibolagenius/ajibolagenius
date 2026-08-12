"use server";

import { revalidatePath } from "next/cache";
import { assertOwner } from "@/lib/auth-guard";
import { failed, ok, type ActionResult } from "@/lib/action-result";

export async function markMessageRead(
  id: string,
  read: boolean,
): Promise<ActionResult> {
  const supabase = await assertOwner();
  const { error } = await supabase
    .from("contact_messages")
    .update({ read })
    .eq("id", id);
  if (error) return failed(error.message);

  revalidatePath("/admin/messages");
  // The unread badge lives on the dashboard nav, so it goes stale too.
  revalidatePath("/admin");
  return ok(read ? "Marked as read" : "Marked as unread");
}

export async function deleteMessage(id: string): Promise<ActionResult> {
  const supabase = await assertOwner();
  const { error } = await supabase
    .from("contact_messages")
    .delete()
    .eq("id", id);
  if (error) return failed(error.message);

  revalidatePath("/admin/messages");
  revalidatePath("/admin");
  return ok("Message deleted");
}
