import { createClient } from "@/lib/supabase/server";
import { TopNav } from "@/components/cv/top-nav";
import { SiteFooter } from "@/components/cv/site-footer";
import { ProjectCard } from "@/components/project-card";
import type { Project } from "@/types/project";

export const revalidate = 60;

export default async function WorkPage() {
  const supabase = await createClient();
  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <>
      <TopNav />
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-6 py-16">
        <div>
          <h1 className="text-h1 font-normal">Work</h1>
          <p className="mt-2 text-body-m text-ink/60">
            A collection of projects I&apos;ve designed, built, and shipped.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {(projects as Project[] | null)?.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
        {projects?.length === 0 && (
          <p className="text-body-m text-ink/50">No projects yet.</p>
        )}
      </main>
      <SiteFooter name="Ajibola Akelebe" />
    </>
  );
}
