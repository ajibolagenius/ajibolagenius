import type { Metadata } from "next";
import { getCvData } from "@/lib/cv-data";
import { getNotes } from "@/lib/notes";
import { TopNav } from "@/components/cv/top-nav";
import { Sidebar } from "@/components/cv/sidebar";
import { SiteFooter } from "@/components/cv/site-footer";
import { NotesList } from "@/components/notes-list";

export const revalidate = 60;

const title = "Notes & Writing";
const description =
  "Technical case studies, reflections on craft, and engineering notes on building and shipping software.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/notes" },
  openGraph: {
    title,
    description,
    url: "/notes",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default async function NotesPage() {
  const [notes, { personalInfo, visibleSections }] = await Promise.all([
    getNotes(),
    getCvData(),
  ]);

  return (
    <>
      <TopNav visibleSections={visibleSections} />
      <Sidebar info={personalInfo} />
      <main className="page-enter flex-1 lg:ml-80">
        <div className="mx-auto w-full min-w-0 max-w-3xl xl:max-w-5xl 2xl:max-w-6xl px-6 py-10">
          <header className="mb-8">
            <h1 className="text-h1 font-normal">Notes & Writing</h1>
            <p className="mt-2 text-body-m text-ink/60">{description}</p>
          </header>

          <NotesList initialNotes={notes} />
        </div>
      </main>
      <SiteFooter name={personalInfo?.name ?? ""} />
    </>
  );
}
