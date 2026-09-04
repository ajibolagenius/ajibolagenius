import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCvData } from "@/lib/cv-data";
import {
  getNote,
  getNavigationNotes,
  formatNoteBody,
  resolveNoteCoverImage,
} from "@/lib/notes";
import { siteUrl } from "@/lib/site-url";
import { TopNav } from "@/components/cv/top-nav";
import { Sidebar } from "@/components/cv/sidebar";
import { SiteFooter } from "@/components/cv/site-footer";
import { ProjectBackLink } from "@/components/project-back-link";
import { ProjectNavigation } from "@/components/project-navigation";
import { ShareButtons } from "@/components/cv/share-buttons";
import { JsonLd } from "@/components/json-ld";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const note = await getNote(slug);

  if (!note) {
    return { title: "Note not found" };
  }

  const title = note.title;
  const description = note.meta_description || note.excerpt;
  const url = `${siteUrl}/notes/${slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "article",
      publishedTime: note.published_at || note.date,
      authors: ["Ajibola Akelebe"],
      images: note.og_image ? [{ url: note.og_image }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: note.og_image ? [note.og_image] : undefined,
    },
  };
}

export default async function NoteDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [note, { personalInfo, visibleSections }, nav] = await Promise.all([
    getNote(slug),
    getCvData(),
    getNavigationNotes(slug),
  ]);

  if (!note) {
    notFound();
  }

  const coverImage = resolveNoteCoverImage(note.og_image);
  const canonical = `${siteUrl}/notes/${slug}`;

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: note.title,
          description: note.meta_description || note.excerpt,
          datePublished: note.published_at || note.date,
          dateModified: note.created_at,
          image: note.og_image || undefined,
          url: canonical,
          author: {
            "@type": "Person",
            name: personalInfo?.name || "Ajibola Akelebe",
            url: siteUrl,
          },
          publisher: {
            "@type": "Person",
            name: personalInfo?.name || "Ajibola Akelebe",
          },
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": canonical,
          },
        }}
      />
      <TopNav visibleSections={visibleSections} />
      <Sidebar info={personalInfo} />
      <main className="page-enter flex-1 lg:ml-80">
        <article className="mx-auto w-full min-w-0 max-w-3xl xl:max-w-4xl 2xl:max-w-5xl px-6 py-10">
          <ProjectBackLink href="/notes" label="All notes" />

          {/* Article Header */}
          <header
            style={{ viewTransitionName: `note-${note.slug}` }}
            className="flex flex-col gap-4 border-b border-ink/10 pb-8 pt-4"
          >
            {/* Meta row */}
            <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-body-xs text-ink/60">
              <div className="flex items-center gap-2">
                {note.category && (
                  <span className="rounded-sm bg-accent/10 px-2 py-0.5 font-medium text-accent">
                    {note.category}
                  </span>
                )}
                {note.date && <span>{note.date}</span>}
              </div>
              {note.read_time && <span>{note.read_time}</span>}
            </div>

            {/* Title */}
            <h1 className="font-display text-h1 font-normal leading-tight text-ink sm:text-display">
              {note.title}
            </h1>

            {/* Excerpt / Lead */}
            {note.excerpt && (
              <p className="border-l-2 border-accent/40 pl-4 text-body-l text-ink/70 italic">
                {note.excerpt}
              </p>
            )}

            {/* Share and author info */}
            <div className="mt-2 flex flex-wrap items-center justify-between gap-4 pt-2">
              <div className="flex items-center gap-2 text-body-xs text-ink/50">
                <span>By {personalInfo?.name || "Ajibola Akelebe"}</span>
              </div>
              <ShareButtons url={canonical} title={note.title} />
            </div>
          </header>

          {/* Optional cover hero image */}
          {coverImage && (
            <div className="relative my-8 aspect-16/9 w-full overflow-hidden rounded-md border border-ink/10 bg-ink/5">
              <Image
                src={coverImage}
                alt=""
                fill
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover"
                priority
                unoptimized={
                  !coverImage.includes("supabase.co") &&
                  !coverImage.includes("images.unsplash.com")
                }
              />
            </div>
          )}

          {/* Article Body */}
          <section className="mt-8 w-full min-w-0 max-w-full break-words [overflow-wrap:anywhere]">
            <div
              className="prose-editorial text-body-m leading-relaxed text-ink/85"
              dangerouslySetInnerHTML={{ __html: formatNoteBody(note.body) }}
            />
          </section>

          {/* Tags */}
          {note.tags && note.tags.length > 0 && (
            <div className="mt-12 flex flex-wrap items-center gap-2 border-t border-ink/10 pt-6">
              <span className="font-mono text-body-xs text-ink/50">Tags:</span>
              {note.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-sm border border-ink/10 bg-panel/40 px-2 py-0.5 font-mono text-body-xs text-ink/70"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Navigation to previous / next notes */}
          <div className="mt-8">
            <ProjectNavigation
              prefix="/notes"
              prev={
                nav.prev
                  ? { slug: nav.prev.slug, name: nav.prev.title }
                  : null
              }
              next={
                nav.next
                  ? { slug: nav.next.slug, name: nav.next.title }
                  : null
              }
            />
          </div>
        </article>
      </main>
      <SiteFooter name={personalInfo?.name ?? ""} />
    </>
  );
}
