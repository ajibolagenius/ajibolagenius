"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { assertOwner } from "@/lib/auth-guard";
import {
  getResourceConfig,
  nestFieldValues,
  type ResourceConfig,
} from "@/lib/admin-resources";
import sharp from "sharp";

const MAX_IMAGE_SIZE = 1024;
const IMAGE_QUALITY = 85;

type Supabase = Awaited<ReturnType<typeof createClient>>;

async function uploadImage(
  supabase: Supabase,
  bucket: string,
  file: File,
): Promise<string> {
  const inputBuffer = Buffer.from(await file.arrayBuffer());
  const optimized = await sharp(inputBuffer)
    .rotate()
    .resize({
      width: MAX_IMAGE_SIZE,
      height: MAX_IMAGE_SIZE,
      fit: "cover",
      withoutEnlargement: true,
    })
    .webp({ quality: IMAGE_QUALITY })
    .toBuffer();

  const path = `${crypto.randomUUID()}.webp`;
  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, optimized, { contentType: "image/webp" });
  if (error) throw new Error(error.message);

  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}

async function parseFieldsFromForm(
  supabase: Supabase,
  config: ResourceConfig,
  formData: FormData,
): Promise<Record<string, unknown>> {
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
    } else if (field.type === "image") {
      const file = formData.get(`${field.name}__file`);
      if (
        file instanceof File &&
        file.size > 0 &&
        file.type.startsWith("image/")
      ) {
        values[field.name] = await uploadImage(
          supabase,
          config.imageBucket ?? "avatars",
          file,
        );
      } else {
        values[field.name] = String(raw ?? "").trim() || null;
      }
    } else {
      values[field.name] = String(raw ?? "").trim();
    }
  }
  // Folds dotted field names (`social.github`) into nested objects for jsonb
  // columns; a no-op for resources whose fields are all plain columns.
  return nestFieldValues(values);
}

/**
 * Every surface that renders this content.
 *
 * `/licenses` and the project detail pages are included because the sidebar
 * appears there too, and it now renders personal info alongside figures
 * derived from experience rows — so a CV edit is visible on all of them.
 */
function revalidateSite(resourceKey: string) {
  revalidatePath(`/admin/manage/${resourceKey}`);
  revalidatePath("/");
  revalidatePath("/cv");
  revalidatePath("/projects");
  revalidatePath("/licenses");
  // Page-level purge: the sidebar is on every detail page, so purging one slug
  // would leave the rest serving the old copy.
  revalidatePath("/projects/[slug]", "page");
  revalidatePath("/sandbox/[slug]", "page");
}

export async function createResourceRow(
  resourceKey: string,
  formData: FormData,
) {
  const config = getResourceConfig(resourceKey);
  if (!config) throw new Error("Unknown resource");

  const supabase = await assertOwner();
  const values = await parseFieldsFromForm(supabase, config, formData);

  const { error } = await supabase.from(config.table).insert(values);
  if (error) throw new Error(error.message);

  revalidateSite(resourceKey);
}

export async function updateResourceRow(
  resourceKey: string,
  id: string | number,
  formData: FormData,
) {
  const config = getResourceConfig(resourceKey);
  if (!config) throw new Error("Unknown resource");

  const supabase = await assertOwner();
  const values = await parseFieldsFromForm(supabase, config, formData);

  const { error } = await supabase
    .from(config.table)
    .update(values)
    .eq(config.idColumn ?? "id", id);
  if (error) throw new Error(error.message);

  revalidateSite(resourceKey);
}

export async function deleteResourceRow(resourceKey: string, id: string) {
  const config = getResourceConfig(resourceKey);
  if (!config) throw new Error("Unknown resource");

  const supabase = await assertOwner();
  const { error } = await supabase
    .from(config.table)
    .delete()
    .eq(config.idColumn ?? "id", id);
  if (error) throw new Error(error.message);

  revalidateSite(resourceKey);
}
