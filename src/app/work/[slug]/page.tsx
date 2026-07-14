import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowSquareOut,
  GithubLogo,
} from "@phosphor-icons/react/dist/ssr";
import { createClient } from "@/lib/supabase/server";
import { Nav } from "@/components/nav";
import type { Project } from "@/types/project";

export const revalidate = 60;

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!project) notFound();

  const p = project as Project;

  return (
    <>
      <Nav />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-10 px-6 py-16">
        <Link
          href="/work"
          className="inline-flex w-fit items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
        >
          <ArrowLeft weight="duotone" size={16} />
          Back to work
        </Link>

        <header className="flex flex-col gap-4">
          <p className="text-xs uppercase tracking-wide text-neutral-400">
            {p.category} · {p.year}
          </p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {p.name}
          </h1>
          <p className="text-lg text-neutral-500">{p.description}</p>

          <div className="flex flex-wrap gap-3 pt-2">
            {p.live_url && p.live_url !== "#" && (
              <a
                href={p.live_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white dark:bg-neutral-100 dark:text-neutral-900"
              >
                <ArrowSquareOut weight="duotone" size={16} />
                Live site
              </a>
            )}
            {p.github_url && p.github_url !== "#" && (
              <a
                href={p.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-neutral-300 px-4 py-2 text-sm font-medium dark:border-neutral-700"
              >
                <GithubLogo weight="duotone" size={16} />
                Source
              </a>
            )}
          </div>
        </header>

        <dl className="grid grid-cols-2 gap-4 border-y border-neutral-200 py-6 text-sm sm:grid-cols-4 dark:border-neutral-800">
          <div>
            <dt className="text-neutral-400">Role</dt>
            <dd className="font-medium">{p.role_title || "—"}</dd>
          </div>
          <div>
            <dt className="text-neutral-400">Duration</dt>
            <dd className="font-medium">{p.duration || "—"}</dd>
          </div>
          <div>
            <dt className="text-neutral-400">Year</dt>
            <dd className="font-medium">{p.year || "—"}</dd>
          </div>
          <div>
            <dt className="text-neutral-400">Type</dt>
            <dd className="font-medium">{p.type || "—"}</dd>
          </div>
        </dl>

        {p.problem && (
          <section className="flex flex-col gap-2">
            <h2 className="text-lg font-semibold">Problem</h2>
            <p className="text-neutral-600 dark:text-neutral-300">
              {p.problem}
            </p>
          </section>
        )}

        {p.solution && (
          <section className="flex flex-col gap-2">
            <h2 className="text-lg font-semibold">Solution</h2>
            <p className="text-neutral-600 dark:text-neutral-300">
              {p.solution}
            </p>
          </section>
        )}

        {p.tech_details?.length > 0 && (
          <section className="flex flex-col gap-3">
            <h2 className="text-lg font-semibold">Tech stack</h2>
            <div className="flex flex-wrap gap-2">
              {p.tech_details.map((t) => (
                <span
                  key={t.name}
                  className="rounded-full bg-neutral-100 px-3 py-1.5 text-sm text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300"
                >
                  {t.name}
                </span>
              ))}
            </div>
          </section>
        )}

        {p.screenshots?.length > 0 && (
          <section className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold">Screenshots</h2>
            <div className="flex flex-col gap-4">
              {p.screenshots.map((src) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={src}
                  src={src}
                  alt={`${p.name} screenshot`}
                  className="w-full rounded-lg border border-neutral-200 dark:border-neutral-800"
                />
              ))}
            </div>
          </section>
        )}
      </main>
    </>
  );
}
