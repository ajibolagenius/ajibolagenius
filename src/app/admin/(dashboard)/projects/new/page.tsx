import { createProject } from "@/app/admin/actions";
import { ProjectForm } from "@/app/admin/project-form";
import { getProjectFieldOptions } from "@/lib/project-options";

export default async function NewProjectPage() {
  const options = await getProjectFieldOptions();

  return (
    <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12">
      <h1 className="mb-8 text-2xl font-semibold">New project</h1>
      <ProjectForm
        action={createProject}
        options={options}
        draftKey="admin:new-project-draft"
      />
    </main>
  );
}
