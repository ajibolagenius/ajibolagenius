import { cache } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  ArrowLeft,
  ArrowSquareOut,
  GithubLogo,
} from "@phosphor-icons/react/dist/ssr";
import { createClient } from "@/lib/supabase/server";
import { getCvData } from "@/lib/cv-data";
import { getSandboxExperiment } from "@/lib/sandbox-experiments";
import { JsonLd } from "@/components/json-ld";
import { SandboxNav } from "@/components/sandbox-nav";
import { ScreenshotGallery } from "@/components/screenshot-gallery";
import { ShareButtons } from "@/components/cv/share-buttons";
import { ProjectNavigation } from "@/components/project-navigation";
import type { Project } from "@/types/project";

export const revalidate = 60;

const getNavigationProjects = cache(async (slug: string) => {
  const supabase = await createClient();
  const { data: projects } = await supabase
    .from("projects")
    .select("slug, name")
    .eq("kind", "sandbox")
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false });

  if (!projects) return { prev: null, next: null };
  const idx = projects.findIndex((p) => p.slug === slug);
  if (idx === -1) return { prev: null, next: null };

  const prev = idx > 0 ? projects[idx - 1] : null;
  const next = idx < projects.length - 1 ? projects[idx + 1] : null;
  return { prev, next };
});

const STATUS_LABELS: Record<string, string> = {
  "in-progress": "In Progress",
  archived: "Archived",
};

const getProject = cache(async (slug: string) => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .eq("kind", "sandbox")
    .single();
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

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000");

  const title = project.name;
  const description = project.description;
  const url = `${siteUrl}/sandbox/${slug}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      type: "website",
      images: project.screenshots?.[0] ? [project.screenshots[0]] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function SandboxDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [project, { personalInfo }, nav] = await Promise.all([
    getProject(slug),
    getCvData(),
    getNavigationProjects(slug),
  ]);

  if (!project) notFound();

  const p = project;
  const statusLabel = STATUS_LABELS[p.status];
  const experiment = getSandboxExperiment(p.slug);
  const Experiment = experiment?.component;

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000");

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CreativeWork",
          name: p.name,
          description: p.description,
          url: `${siteUrl}/sandbox/${p.slug}`,
          image: p.screenshots?.[0] || undefined,
          dateCreated: p.year || undefined,
          creator: personalInfo?.name
            ? { "@type": "Person", name: personalInfo.name }
            : undefined,
          keywords: p.tags?.length ? p.tags.join(", ") : undefined,
        }}
      />
      <SandboxNav />
      <main className="page-enter mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-10 sm:px-6">
        <Link
          href="/sandbox"
          className="inline-flex w-fit items-center gap-2 text-body-s text-ink/60 transition-colors hover:text-accent"
        >
          <ArrowLeft weight="duotone" size={16} />
          Back to lab
        </Link>

        <header className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-3 text-body-xs uppercase tracking-wide text-ink/60">
            {experiment && (
              <span className="inline-flex items-center bg-accent px-2 py-0.5 font-mono normal-case tracking-normal text-cream">
                Playable
              </span>
            )}
            {p.category && <span>{p.category}</span>}
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
          <h1 className="text-h1 font-normal">{p.name}</h1>
          {p.description && (
            <p className="max-w-xl text-body-l text-ink/60">{p.description}</p>
          )}

          <div className="flex flex-wrap items-center gap-3 pt-1 sm:flex-nowrap sm:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              {p.live_url && p.live_url !== "#" && (
                <a
                  href={p.live_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-ink px-4 py-2 text-body-s font-medium text-cream transition-colors hover:bg-accent"
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
                  className="inline-flex items-center gap-2 border border-ink/20 px-4 py-2 text-body-s font-medium transition-colors hover:border-ink"
                >
                  <GithubLogo weight="duotone" size={16} />
                  Source
                </a>
              )}
            </div>

            <ShareButtons
              url={`${siteUrl}/sandbox/${p.slug}`}
              title={p.name}
            />
          </div>
        </header>

        {Experiment ? (
          <section className="flex flex-col gap-3">
            {/* Lab frame: hairline border, mono caption bar and accent corner
                crosshairs. Makes a single experiment read as one of a series. */}
            <div className="lab-frame">
              <div className="flex items-center justify-between gap-3 border-b border-ink/10 px-3 py-1.5 font-mono text-body-xs uppercase tracking-[0.25em] text-ink/35">
                <span>experiment</span>
                <span className="truncate normal-case tracking-normal">
                  {p.slug}
                </span>
              </div>
              <div className="p-3">
                <Experiment />
              </div>
            </div>
          </section>
        ) : (
          <>
            {p.screenshots?.length > 0 && (
              <section className="flex flex-col gap-4">
                <h2 className="text-h3 font-normal">Snapshots</h2>
                <ScreenshotGallery screenshots={p.screenshots} alt={p.name} />
              </section>
            )}
            {!p.screenshots?.length &&
              (!p.live_url || p.live_url === "#") &&
              (!p.github_url || p.github_url === "#") && (
                <p className="border border-dashed border-ink/15 px-4 py-8 text-center text-body-m text-ink/50">
                  Lab note — more soon.
                </p>
              )}
          </>
        )}

        <ProjectNavigation prev={nav.prev} next={nav.next} prefix="/sandbox" />
      </main>
      <footer className="mx-auto max-w-3xl px-4 py-8 text-center font-mono text-body-xs text-ink/40 sm:px-6">
        built while learning · no warranty expressed or implied
      </footer>
    </>
  );
}
