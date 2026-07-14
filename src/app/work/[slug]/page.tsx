import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowSquareOut,
  GithubLogo,
} from "@phosphor-icons/react/dist/ssr";
import { createClient } from "@/lib/supabase/server";
import { TopNav } from "@/components/cv/top-nav";
import { SiteFooter } from "@/components/cv/site-footer";
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
      <TopNav />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-10 px-6 py-16">
        <Link
          href="/work"
          className="inline-flex w-fit items-center gap-2 text-body-s text-ink/60 hover:text-ink"
        >
          <ArrowLeft weight="duotone" size={16} />
          Back to work
        </Link>

        <header className="flex flex-col gap-4">
          <p className="text-body-xs uppercase tracking-wide text-ink/40">
            {p.category} · {p.year}
          </p>
          <h1 className="text-h1 font-normal">{p.name}</h1>
          <p className="text-body-l text-ink/60">{p.description}</p>

          <div className="flex flex-wrap gap-3 pt-2">
            {p.live_url && p.live_url !== "#" && (
              <a
                href={p.live_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-body-s font-medium text-cream"
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
                className="inline-flex items-center gap-2 rounded-full border border-ink/20 px-4 py-2 text-body-s font-medium"
              >
                <GithubLogo weight="duotone" size={16} />
                Source
              </a>
            )}
          </div>
        </header>

        <dl className="grid grid-cols-2 gap-4 border-y border-ink/10 py-6 text-body-s sm:grid-cols-4">
          <div>
            <dt className="text-ink/40">Role</dt>
            <dd className="font-medium">{p.role_title || "—"}</dd>
          </div>
          <div>
            <dt className="text-ink/40">Duration</dt>
            <dd className="font-medium">{p.duration || "—"}</dd>
          </div>
          <div>
            <dt className="text-ink/40">Year</dt>
            <dd className="font-medium">{p.year || "—"}</dd>
          </div>
          <div>
            <dt className="text-ink/40">Type</dt>
            <dd className="font-medium">{p.type || "—"}</dd>
          </div>
        </dl>

        {p.problem && (
          <section className="flex flex-col gap-2">
            <h2 className="text-h3 font-normal">Problem</h2>
            <p className="text-body-m text-ink/70">{p.problem}</p>
          </section>
        )}

        {p.solution && (
          <section className="flex flex-col gap-2">
            <h2 className="text-h3 font-normal">Solution</h2>
            <p className="text-body-m text-ink/70">{p.solution}</p>
          </section>
        )}

        {p.tech_details?.length > 0 && (
          <section className="flex flex-col gap-3">
            <h2 className="text-h3 font-normal">Tech stack</h2>
            <div className="flex flex-wrap gap-2">
              {p.tech_details.map((t) => (
                <span
                  key={t.name}
                  className="rounded-full bg-ink/5 px-3 py-1.5 text-body-s text-ink/70"
                >
                  {t.name}
                </span>
              ))}
            </div>
          </section>
        )}

        {p.screenshots?.length > 0 && (
          <section className="flex flex-col gap-4">
            <h2 className="text-h3 font-normal">Screenshots</h2>
            <div className="flex flex-col gap-4">
              {p.screenshots.map((src) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={src}
                  src={src}
                  alt={`${p.name} screenshot`}
                  className="w-full rounded-lg border border-ink/10"
                />
              ))}
            </div>
          </section>
        )}
      </main>
      <SiteFooter name="Ajibola Akelebe" />
    </>
  );
}
