import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { createClient } from "@/lib/supabase/server";
import { Nav } from "@/components/nav";
import { ProjectCard } from "@/components/project-card";
import type { Project } from "@/types/project";

export default async function HomePage() {
  const supabase = await createClient();
  const { data: featured } = await supabase
    .from("projects")
    .select("*")
    .eq("featured", true)
    .order("created_at", { ascending: false })
    .limit(3);

  return (
    <>
      <Nav />
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-20 px-6 py-16">
        <section className="flex flex-col gap-6">
          <h1 className="max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
            I build software that's fast, thoughtful, and built to last.
          </h1>
          <p className="max-w-xl text-lg text-neutral-500">
            Software engineer focused on product engineering, design systems,
            and developer tooling.
          </p>
          <Link
            href="/work"
            className="inline-flex w-fit items-center gap-2 rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white transition hover:gap-3 dark:bg-neutral-100 dark:text-neutral-900"
          >
            View my work
            <ArrowRight weight="duotone" size={18} />
          </Link>
        </section>

        {featured && featured.length > 0 && (
          <section className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Featured work</h2>
              <Link
                href="/work"
                className="text-sm text-neutral-500 underline"
              >
                View all
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {(featured as Project[]).map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </section>
        )}
      </main>
    </>
  );
}
