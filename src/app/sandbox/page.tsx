import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { SandboxNav } from "@/components/sandbox-nav";
import { SandboxGrid } from "@/components/sandbox-grid";
import type { Project } from "@/types/project";

export const revalidate = 60;

const title = "Sandbox";
const description =
  "A lab of small interactive experiments — toys, tests, and half-finished ideas you can poke at.";

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
  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .eq("kind", "sandbox")
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false });

  return (
    <>
      <SandboxNav />
      <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
        <div>
          <p className="font-mono text-body-xs uppercase tracking-wide text-accent">
            Lab · playground · no roadmap
          </p>
          <h1 className="mt-2 text-h1 font-normal">Sandbox</h1>
          <p className="mt-2 max-w-xl text-body-m text-ink/60">
            Small experiments you can open and play with. Some are finished
            toys; others are still on the bench. Click around.
          </p>
        </div>

        {projects && projects.length > 0 ? (
          <SandboxGrid projects={projects as Project[]} />
        ) : (
          <p className="mt-8 text-body-m text-ink/60">
            Nothing on the bench yet — check back soon.
          </p>
        )}
      </main>
      <footer className="mx-auto max-w-5xl px-4 py-8 text-center font-mono text-body-xs text-ink/40 sm:px-6">
        built while learning · no warranty expressed or implied
      </footer>
    </>
  );
}
