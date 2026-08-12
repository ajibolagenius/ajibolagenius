import { cache } from "react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import {
  ArrowLeft,
  ArrowSquareOut,
  GithubLogo,
} from "@phosphor-icons/react/dist/ssr";
import { createClient } from "@/lib/supabase/server";
import { getCvData } from "@/lib/cv-data";
import { siteUrl } from "@/lib/site-url";
import { kindMeta, LISTED_KINDS } from "@/lib/project-kind";
import { JsonLd } from "@/components/json-ld";
import { TopNav } from "@/components/cv/top-nav";
import { Sidebar } from "@/components/cv/sidebar";
import { SiteFooter } from "@/components/cv/site-footer";
import { ScreenshotGallery } from "@/components/screenshot-gallery";
import { ShareButtons } from "@/components/cv/share-buttons";
import { ProjectNavigation } from "@/components/project-navigation";
import { ProjectShowcase } from "@/components/project-showcase";
import type { Project } from "@/types/project";

export const revalidate = 60;

const STATUS_LABELS: Record<string, string> = {
  "in-progress": "In Progress",
  archived: "Archived",
};

// Ordering must stay byte-identical to the listing page's, or prev/next won't
// match the sequence the visitor just scrolled through.
const getNavigationProjects = cache(async (slug: string) => {
  const supabase = await createClient();
  const { data: projects } = await supabase
    .from("projects")
    .select("slug, name")
    .in("kind", LISTED_KINDS)
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false });

  if (!projects) return { prev: null, next: null };
  const idx = projects.findIndex((p) => p.slug === slug);
  if (idx === -1) return { prev: null, next: null };

  return {
    prev: idx > 0 ? projects[idx - 1] : null,
    next: idx < projects.length - 1 ? projects[idx + 1] : null,
  };
});

// No kind filter: projects_slug_key makes slug globally unique, so this is
// unambiguous with one query. maybeSingle() rather than single() because the
// latter returns a PGRST116 error object on zero rows, which was being
// silently swallowed.
const getProject = cache(async (slug: string) => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  return data as Project | null;
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    return { title: "Project not found" };
  }

  const title = project.name;
  const description = project.description;
  const url = `${siteUrl}/projects/${slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "article" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [project, { personalInfo, visibleSections }, nav] = await Promise.all([
    getProject(slug),
    getCvData(),
    getNavigationProjects(slug),
  ]);

  if (!project) notFound();

  // A project re-kinded to sandbox in the admin would otherwise dead-end here
  // via the /work/:slug -> /projects/:slug redirect. Temporary (307), not
  // permanent, because kind is mutable.
  if (project.kind === "sandbox") redirect(`/sandbox/${slug}`);

  const p = project;
  const statusLabel = STATUS_LABELS[p.status];
  const canonical = `${siteUrl}/projects/${p.slug}`;
  const backHref = p.kind === "side" ? "/projects?type=side" : "/projects";
  // Gate on content, not kind: side projects without a role shouldn't render
  // a row of em-dashes, while client case studies keep their metadata table.
  const hasMeta = Boolean(p.role_title || p.duration || p.year || p.type);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CreativeWork",
          name: p.name,
          description: p.description,
          url: canonical,
          image: p.screenshots?.[0] || undefined,
          dateCreated: p.year || undefined,
          creator: personalInfo?.name
            ? { "@type": "Person", name: personalInfo.name }
            : undefined,
          keywords: p.tags?.length ? p.tags.join(", ") : undefined,
        }}
      />
      <TopNav visibleSections={visibleSections} />
      <Sidebar info={personalInfo} />
      <main className="page-enter flex-1 lg:ml-80">
        <div className="mx-auto flex w-full min-w-0 max-w-3xl flex-col gap-10 px-6 py-10">
          <Link
            href={backHref}
            className="group inline-flex w-fit items-center gap-2 text-body-s text-ink/60 transition-colors duration-[var(--dur-2)] hover:text-accent"
          >
            <ArrowLeft
              weight="duotone"
              size={16}
              className="transition-transform duration-[var(--dur-2)] ease-out-quart group-hover:-translate-x-0.5"
            />
            Back to projects
          </Link>

          <header className="flex flex-col gap-4">
            <div
              className="enter flex flex-wrap items-center gap-3 text-body-xs uppercase tracking-wide text-ink/60"
              style={{ "--enter-i": 0 } as React.CSSProperties}
            >
              <span className="font-mono normal-case tracking-normal text-accent">
                {kindMeta(p.kind).label}
              </span>
              {p.category && <span>{p.category}</span>}
              {p.year && <span>{p.year}</span>}
              {statusLabel && (
                <span
                  className={`inline-flex items-center px-2 py-0.5 font-mono normal-case tracking-normal ${
                    p.status === "in-progress"
                      ? "bg-accent text-cream"
                      : "bg-ink/10 text-ink/60"
                  }`}
                >
                  {statusLabel}
                </span>
              )}
            </div>
            <h1
              className="enter text-h1 font-normal"
              style={{ "--enter-i": 1 } as React.CSSProperties}
            >
              {p.name}
            </h1>
            <p
              className="enter text-body-l text-ink/60"
              style={{ "--enter-i": 2 } as React.CSSProperties}
            >
              {p.description}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2 sm:flex-nowrap sm:justify-between">
              <div className="flex flex-wrap items-center gap-3">
                {p.live_url && p.live_url !== "#" && (
                  <a
                    href={p.live_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-ink px-4 py-2 text-body-s font-medium text-cream transition-colors duration-[var(--dur-2)] hover:bg-accent active:scale-[0.98]"
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
                    className="inline-flex items-center gap-2 border border-ink/20 px-4 py-2 text-body-s font-medium transition-colors duration-[var(--dur-2)] hover:border-ink active:scale-[0.98]"
                  >
                    <GithubLogo weight="duotone" size={16} />
                    Source
                  </a>
                )}
              </div>

              <ShareButtons url={canonical} title={p.name} />
            </div>
          </header>

          {hasMeta && (
            <dl className="grid grid-cols-2 gap-4 border-y border-ink/10 py-6 text-body-s sm:grid-cols-4">
              <div>
                <dt className="text-ink/60">Role</dt>
                <dd className="font-medium">{p.role_title || "—"}</dd>
              </div>
              <div>
                <dt className="text-ink/60">Duration</dt>
                <dd className="font-medium">{p.duration || "—"}</dd>
              </div>
              <div>
                <dt className="text-ink/60">Year</dt>
                <dd className="font-medium">{p.year || "—"}</dd>
              </div>
              <div>
                <dt className="text-ink/60">Type</dt>
                <dd className="font-medium">{p.type || "—"}</dd>
              </div>
            </dl>
          )}

          {p.problem && (
            <section className="reveal flex flex-col gap-2">
              <h2 className="text-h3 font-normal">Problem</h2>
              <p className="text-body-m text-ink/70">{p.problem}</p>
            </section>
          )}

          {p.solution && (
            <section className="reveal flex flex-col gap-2">
              <h2 className="text-h3 font-normal">Solution</h2>
              <p className="text-body-m text-ink/70">{p.solution}</p>
            </section>
          )}

          {p.tech_details?.length > 0 && (
            <section className="reveal flex flex-col gap-3">
              <h2 className="text-h3 font-normal">Tech stack</h2>
              <div className="flex flex-wrap gap-2">
                {p.tech_details.map((t) => (
                  <span
                    key={t.name}
                    className="bg-ink/5 px-3 py-1.5 font-mono text-body-s text-ink/70"
                  >
                    {t.name}
                  </span>
                ))}
              </div>
            </section>
          )}

          <ProjectShowcase project={p} />

          {p.screenshots?.length > 0 && (
            <section className="reveal flex flex-col gap-4">
              <h2 className="text-h3 font-normal">Screenshots</h2>
              <ScreenshotGallery screenshots={p.screenshots} alt={p.name} />
            </section>
          )}

          <ProjectNavigation
            prev={nav.prev}
            next={nav.next}
            prefix="/projects"
          />
        </div>
      </main>
      <SiteFooter name={personalInfo?.name ?? ""} />
    </>
  );
}
