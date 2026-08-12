import { createClient } from "@/lib/supabase/server";
import type { Project } from "@/types/project";
import { deleteProject, toggleFeatured } from "@/app/admin/actions";
import { ActionButton } from "@/components/admin/action-button";
import Link from "next/link";

export default async function AdminPage() {
  const supabase = await createClient();
  const [{ data: projects, error }, { count: unreadCount }] =
    await Promise.all([
      supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false }),
      supabase
        .from("contact_messages")
        .select("*", { count: "exact", head: true })
        .eq("read", false),
    ]);

  const projectList = (projects as Project[] | null) ?? [];
  const featuredCount = projectList.filter((p) => p.featured).length;

  const stats = [
    { label: "Projects", value: projectList.length },
    { label: "Featured", value: featuredCount },
    {
      label: "Unread messages",
      value: unreadCount ?? 0,
      href: "/admin/messages",
    },
  ];

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
      <h1 className="mb-6 text-2xl font-semibold">Dashboard</h1>

      <section className="mb-10 grid grid-cols-3 gap-3">
        {stats.map((stat) => {
          const body = (
            <>
              <p className="text-2xl font-semibold sm:text-3xl">
                {stat.value}
              </p>
              <p className="mt-1 text-xs text-ink/60 sm:text-sm">
                {stat.label}
              </p>
            </>
          );
          return stat.href ? (
            <Link
              key={stat.label}
              href={stat.href}
              className="rounded-md border border-ink/10 bg-panel px-4 py-3 transition-colors hover:border-accent/50"
            >
              {body}
            </Link>
          ) : (
            <div
              key={stat.label}
              className="rounded-md border border-ink/10 bg-panel px-4 py-3"
            >
              {body}
            </div>
          );
        })}
      </section>

      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">Projects</h2>
        <Link
          href="/admin/projects/new"
          className="rounded-md bg-ink px-3 py-2 text-sm font-medium text-cream"
        >
          New project
        </Link>
      </div>

      {error && <p className="text-sm text-red-600">{error.message}</p>}

      <ul className="flex flex-col gap-3">
        {projectList.map((project) => (
          <li
            key={project.id}
            className="flex flex-col gap-3 rounded-md border border-ink/10 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0">
              <p className="truncate font-medium">
                {project.name}
                <span className="ml-2 rounded-sm bg-ink/10 px-1.5 py-0.5 align-middle text-xs font-normal text-ink/60">
                  {project.kind === "side"
                    ? "Side"
                    : project.kind === "sandbox"
                      ? "Sandbox"
                      : "Client"}
                </span>
              </p>
              <p className="truncate text-sm text-ink/60">
                /{project.slug} · {project.category}
                {project.status && project.status !== "live"
                  ? ` · ${project.status}`
                  : ""}
                {project.featured ? " · Featured" : ""}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <ActionButton
                action={async () => {
                  "use server";
                  return toggleFeatured(project.id, !project.featured);
                }}
                className={`rounded-md border px-2 py-1 text-sm ${
                  project.featured
                    ? "border-amber-400 bg-amber-50 text-amber-700 dark:border-amber-600 dark:bg-amber-950 dark:text-amber-400"
                    : "border-ink/15 text-ink/60"
                }`}
                title={project.featured ? "Unmark featured" : "Mark featured"}
              >
                {project.featured ? "★ Featured" : "☆ Feature"}
              </ActionButton>
              <Link
                href={`/admin/projects/${project.id}`}
                className="text-sm underline"
              >
                Edit
              </Link>
              <ActionButton
                action={async () => {
                  "use server";
                  return deleteProject(project.id);
                }}
                confirm={`Delete “${project.name}”? This cannot be undone.`}
                pendingLabel="Deleting…"
                className="text-sm text-red-600 underline"
              >
                Delete
              </ActionButton>
            </div>
          </li>
        ))}
        {projectList.length === 0 && !error && (
          <p className="text-sm text-ink/60">No projects yet.</p>
        )}
      </ul>
    </main>
  );
}
