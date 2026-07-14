import { createClient } from "@/lib/supabase/server";
import { getCvData } from "@/lib/cv-data";
import { TopNav } from "@/components/cv/top-nav";
import { Sidebar } from "@/components/cv/sidebar";
import { SiteFooter } from "@/components/cv/site-footer";
import { ProjectCard } from "@/components/project-card";
import type { Project } from "@/types/project";

export const revalidate = 60;

export default async function WorkPage() {
  const supabase = await createClient();
  const [{ data: projects }, { personalInfo }] = await Promise.all([
    supabase.from("projects").select("*").order("created_at", {
      ascending: false,
    }),
    getCvData(),
  ]);

  return (
    <>
      <TopNav />
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-10 px-6 py-10 lg:flex-row lg:gap-16">
        <Sidebar info={personalInfo} />

        <div className="min-w-0 flex-1 py-8">
          <div>
            <h1 className="text-h1 font-normal">Work</h1>
            <p className="mt-2 text-body-m text-ink/60">
              A collection of projects I&apos;ve designed, built, and
              shipped.
            </p>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {(projects as Project[] | null)?.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
          {projects?.length === 0 && (
            <p className="mt-8 text-body-m text-ink/50">No projects yet.</p>
          )}
        </div>
      </main>
      <SiteFooter name={personalInfo?.name ?? ""} />
    </>
  );
}
