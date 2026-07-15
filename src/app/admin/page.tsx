import { createClient } from "@/lib/supabase/server";
import type { Project } from "@/types/project";
import { ADMIN_RESOURCES } from "@/lib/admin-resources";
import { deleteProject, signOut, toggleFeatured } from "./actions";
import Link from "next/link";

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: projects, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });
  const { count: unreadCount } = await supabase
    .from("contact_messages")
    .select("*", { count: "exact", head: true })
    .eq("read", false);

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Admin</h1>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/messages"
            className="relative rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700"
          >
            Messages
            {!!unreadCount && (
              <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-xs font-medium text-white">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </Link>
          <Link
            href="/admin/reset-password"
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700"
          >
            Change password
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

      <section className="mb-10">
        <h2 className="mb-3 text-sm font-medium text-neutral-500">
          CV content
        </h2>
        <div className="flex flex-wrap gap-2">
          {Object.entries(ADMIN_RESOURCES).map(([key, config]) => (
            <Link
              key={key}
              href={`/admin/manage/${key}`}
              className="rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700"
            >
              {config.label}
            </Link>
          ))}
        </div>
      </section>

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Projects</h2>
        <Link
          href="/admin/projects/new"
          className="rounded-md bg-neutral-900 px-3 py-2 text-sm font-medium text-white dark:bg-neutral-100 dark:text-neutral-900"
        >
          New project
        </Link>
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
              <form
                action={async () => {
                  "use server";
                  await toggleFeatured(project.id, !project.featured);
                }}
              >
                <button
                  type="submit"
                  className={`rounded-md border px-2 py-1 text-sm ${
                    project.featured
                      ? "border-amber-400 bg-amber-50 text-amber-700 dark:border-amber-600 dark:bg-amber-950 dark:text-amber-400"
                      : "border-neutral-300 text-neutral-500 dark:border-neutral-700"
                  }`}
                  title={
                    project.featured ? "Unmark featured" : "Mark featured"
                  }
                >
                  {project.featured ? "★ Featured" : "☆ Feature"}
                </button>
              </form>
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
