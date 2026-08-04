import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getCvData } from "@/lib/cv-data";
import { TopNav } from "@/components/cv/top-nav";
import { Sidebar } from "@/components/cv/sidebar";
import { SiteFooter } from "@/components/cv/site-footer";
import { WorkGrid } from "@/components/work-grid";
import type { Project } from "@/types/project";

export const revalidate = 60;

const title = "Sandbox";
const description =
  "Mini projects and quick tests — small builds where I try out ideas.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    url: "/sandbox",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default async function SandboxPage() {
  const supabase = await createClient();
  const [{ data: projects }, { personalInfo, visibleSections }] =
    await Promise.all([
      supabase
        .from("projects")
        .select("*")
        .eq("kind", "sandbox")
        .order("featured", { ascending: false })
        .order("created_at", { ascending: false }),
      getCvData(),
    ]);

  return (
    <>
      <TopNav visibleSections={visibleSections} />
      <Sidebar info={personalInfo} />
      <main className="flex-1 lg:ml-80">
        <div className="mx-auto w-full min-w-0 max-w-3xl px-6 py-10">
          <div>
            <h1 className="text-h1 font-normal">Sandbox</h1>
            <p className="mt-2 text-body-m text-ink/60">
              Mini projects and quick tests — small builds where I try out
              ideas.
            </p>
          </div>
          {projects && projects.length > 0 ? (
            <WorkGrid projects={projects as Project[]} />
          ) : (
            <p className="mt-8 text-body-m text-ink/60">
              No sandbox projects yet.
            </p>
          )}
        </div>
      </main>
      <SiteFooter name={personalInfo?.name ?? ""} />
    </>
  );
}
