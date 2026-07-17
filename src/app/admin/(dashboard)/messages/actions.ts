"use server";

import { revalidatePath } from "next/cache";
import { assertOwner } from "@/lib/auth-guard";

export async function markMessageRead(id: string, read: boolean) {
  const supabase = await assertOwner();
  const { error } = await supabase
    .from("contact_messages")
    .update({ read })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/messages");
}

export async function deleteMessage(id: string) {
  const supabase = await assertOwner();
  const { error } = await supabase
    .from("contact_messages")
    .delete()
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/messages");
}
