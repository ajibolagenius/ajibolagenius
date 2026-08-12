import { Suspense } from "react";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getCvData } from "@/lib/cv-data";
import { TopNav } from "@/components/cv/top-nav";
import { Sidebar } from "@/components/cv/sidebar";
import { SiteFooter } from "@/components/cv/site-footer";
import { ProjectsGrid, ProjectsGridFallback } from "@/components/projects-grid";
import { SandboxPromoCard } from "@/components/sandbox-promo-card";
import { LISTED_KINDS } from "@/lib/project-kind";
import type { ProjectCardData } from "@/types/project";

export const revalidate = 60;

const title = "Projects";
const description =
  "Everything I've designed, built, and shipped — client work and side projects in one place.";

export const metadata: Metadata = {
  title,
  description,
  // Filtering is client-side, so /projects and /projects?type=side return
  // identical HTML. Without this they'd read as duplicate content.
  alternates: { canonical: "/projects" },
  openGraph: {
    title,
    description,
    url: "/projects",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default async function ProjectsPage() {
  const supabase = await createClient();
  const [{ data }, { personalInfo, visibleSections }] = await Promise.all([
    supabase
      .from("projects")
      // Narrow select: this payload is serialized into the Flight response for
      // the client grid as well as rendered, so the unused long-form columns
      // (problem, solution, tech_details, …) would roughly double it.
      .select(
        "id, slug, name, kind, category, description, tags, screenshots, featured, status",
      )
      .in("kind", LISTED_KINDS)
      .order("featured", { ascending: false })
      .order("created_at", { ascending: false }),
    getCvData(),
  ]);

  const projects = (data ?? []) as ProjectCardData[];

  return (
    <>
      <TopNav visibleSections={visibleSections} />
      <Sidebar info={personalInfo} />
      <main className="page-enter flex-1 lg:ml-80">
        <div className="mx-auto w-full min-w-0 max-w-3xl px-6 py-10">
          <div>
            <h1 className="text-h1 font-normal">Projects</h1>
            <p className="mt-2 text-body-m text-ink/60">{description}</p>
          </div>

          {projects.length > 0 ? (
            // useSearchParams triggers a CSR bailout during *prerender*, which
            // the boundary catches. This route can never prerender anyway —
            // createClient() reads cookies, so it is always dynamic — but the
            // boundary stays as a guard in case that changes.
            //
            // The fallback deliberately reserves the pill row's height and
            // nothing more. Rendering a full duplicate grid here would double
            // the page HTML (~100kB raw) for no SEO gain: the resolved grid is
            // streamed into the same response, so crawlers see every card.
            <Suspense fallback={<ProjectsGridFallback />}>
              <ProjectsGrid
                projects={projects}
                pinnedCard={<SandboxPromoCard />}
              />
            </Suspense>
          ) : (
            <p className="mt-8 text-body-m text-ink/60">No projects yet.</p>
          )}
        </div>
      </main>
      <SiteFooter name={personalInfo?.name ?? ""} />
    </>
  );
}
