import { createProject } from "../../actions";
import { ProjectForm } from "../../project-form";
import { getProjectFieldOptions } from "@/lib/project-options";

export default async function NewProjectPage() {
  const options = await getProjectFieldOptions();

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="mb-8 text-2xl font-semibold">New project</h1>
      <ProjectForm action={createProject} options={options} />
    </main>
  );
}
