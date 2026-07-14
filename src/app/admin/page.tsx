import { createClient } from "@/lib/supabase/server";
import type { Project } from "@/types/project";
import { deleteProject, signOut } from "./actions";
import Link from "next/link";

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: projects, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Projects</h1>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/projects/new"
            className="rounded-md bg-neutral-900 px-3 py-2 text-sm font-medium text-white dark:bg-neutral-100 dark:text-neutral-900"
          >
            New project
          </Link>
          <form action={signOut}>
            <button
              type="submit"
              className="rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error.message}</p>}

      <ul className="flex flex-col gap-3">
        {(projects as Project[] | null)?.map((project) => (
          <li
            key={project.id}
            className="flex items-center justify-between rounded-md border border-neutral-200 px-4 py-3 dark:border-neutral-800"
          >
            <div>
              <p className="font-medium">{project.name}</p>
              <p className="text-sm text-neutral-500">
                /{project.slug} · {project.category}
                {project.featured ? " · Featured" : ""}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href={`/admin/projects/${project.id}`}
                className="text-sm underline"
              >
                Edit
              </Link>
              <form
                action={async () => {
                  "use server";
                  await deleteProject(project.id);
                }}
              >
                <button
                  type="submit"
                  className="text-sm text-red-600 underline"
                >
                  Delete
                </button>
              </form>
            </div>
          </li>
        ))}
        {projects?.length === 0 && (
          <p className="text-sm text-neutral-500">No projects yet.</p>
        )}
      </ul>
    </main>
  );
}
