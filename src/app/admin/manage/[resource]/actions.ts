"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getResourceConfig } from "@/lib/admin-resources";

function parseFieldsFromForm(
  resourceKey: string,
  formData: FormData,
): Record<string, unknown> {
  const config = getResourceConfig(resourceKey);
  if (!config) throw new Error("Unknown resource");

  const values: Record<string, unknown> = {};
  for (const field of config.fields) {
    const raw = formData.get(field.name);
    if (field.type === "number") {
      values[field.name] = raw ? Number(raw) : 0;
    } else if (field.type === "boolean") {
      values[field.name] = raw === "on";
    } else if (field.type === "list") {
      values[field.name] = formData
        .getAll(field.name)
        .map((v) => String(v).trim())
        .filter(Boolean);
    } else {
      values[field.name] = String(raw ?? "").trim();
    }
  }
  return values;
}

export async function createResourceRow(
  resourceKey: string,
  formData: FormData,
) {
  const config = getResourceConfig(resourceKey);
  if (!config) throw new Error("Unknown resource");

  const supabase = await createClient();
  const values = parseFieldsFromForm(resourceKey, formData);

  const { error } = await supabase.from(config.table).insert(values);
  if (error) throw new Error(error.message);

  revalidatePath(`/admin/manage/${resourceKey}`);
  revalidatePath("/");
}

export async function updateResourceRow(
  resourceKey: string,
  id: string | number,
  formData: FormData,
) {
  const config = getResourceConfig(resourceKey);
  if (!config) throw new Error("Unknown resource");

  const supabase = await createClient();
  const values = parseFieldsFromForm(resourceKey, formData);

  const idColumn = resourceKey === "personal-info" ? "id" : "id";
  const { error } = await supabase
    .from(config.table)
    .update(values)
    .eq(idColumn, id);
  if (error) throw new Error(error.message);

  revalidatePath(`/admin/manage/${resourceKey}`);
  revalidatePath("/");
}

export async function deleteResourceRow(resourceKey: string, id: string) {
  const config = getResourceConfig(resourceKey);
  if (!config) throw new Error("Unknown resource");

  const supabase = await createClient();
  const { error } = await supabase.from(config.table).delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath(`/admin/manage/${resourceKey}`);
  revalidatePath("/");
}
