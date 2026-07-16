import { createClient } from "@/lib/supabase/server";
import type { Project } from "@/types/project";
import { updateProject } from "@/app/admin/actions";
import { ProjectForm } from "@/app/admin/project-form";
import { getProjectFieldOptions } from "@/lib/project-options";
import { notFound } from "next/navigation";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const [{ data: project }, options] = await Promise.all([
    supabase.from("projects").select("*").eq("id", id).single(),
    getProjectFieldOptions(),
  ]);

  if (!project) notFound();

  const updateWithId = updateProject.bind(null, id);

  return (
    <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12">
      <h1 className="mb-8 text-2xl font-semibold">Edit project</h1>
      <ProjectForm
        project={project as Project}
        action={updateWithId}
        options={options}
      />
    </main>
  );
}
