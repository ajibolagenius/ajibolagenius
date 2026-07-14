import { createProject } from "../../actions";
import { ProjectForm } from "../../project-form";

export default function NewProjectPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="mb-8 text-2xl font-semibold">New project</h1>
      <ProjectForm action={createProject} />
    </main>
  );
}
