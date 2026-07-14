import { createClient } from "@/lib/supabase/server";

export interface TechLogoOption {
  name: string;
  url: string;
}

export async function listTechLogos(): Promise<TechLogoOption[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.storage
    .from("tech-logos")
    .list("", { sortBy: { column: "name", order: "asc" } });

  if (error || !data) return [];

  return data
    .filter((file) => file.name && !file.name.startsWith("."))
    .map((file) => {
      const {
        data: { publicUrl },
      } = supabase.storage.from("tech-logos").getPublicUrl(file.name);
      return { name: file.name, url: publicUrl };
    });
}
