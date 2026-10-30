import { createClient } from "@/lib/supabase/server";
import { getCvData } from "@/lib/cv-data";
import { JsonLd } from "@/components/json-ld";
import { TopNav } from "@/components/cv/top-nav";
import { Hero } from "@/components/cv/hero";
import { FeaturedWork } from "@/components/cv/featured-work";
import { Experience } from "@/components/cv/experience";
import { Recommendations } from "@/components/cv/recommendations";
import { Connect } from "@/components/cv/connect";
import { Owe } from "@/components/cv/owe";
import { SiteFooter } from "@/components/cv/site-footer";
import { FeaturedNotes } from "@/components/cv/featured-notes";
import { getFeaturedNotes } from "@/lib/notes";
import { getSidebarStats } from "@/lib/sidebar-stats";
import { siteUrl } from "@/lib/site-url";
import type { Metadata } from "next";
import type { Project } from "@/types/project";

export const revalidate = 60;

/**
 * Twitter's `creator` wants a handle, but the DB stores a profile URL (it has
 * to — the sidebar and footer render it as a link). Returns undefined rather
 * than a guess if the URL isn't shaped like a profile.
 */
function twitterHandle(url?: string | null): string | undefined {
  if (!url) return undefined;
  const match = url.match(/(?:twitter|x)\.com\/@?([A-Za-z0-9_]{1,15})\/?$/i);
  return match ? `@${match[1]}` : undefined;
}

/**
 * The homepage previously had no metadata of its own, so it inherited the
 * layout's static "Software engineer portfolio and case studies." — a string
 * that named neither the person nor what he does, on the one page most likely
 * to be shared. Everything here comes from `personal_info`, which is now fully
 * editable in the admin console, so the description follows the site instead of
 * drifting from it.
 *
 * `getCvData` is cached per request, so this costs no extra queries.
 */
export async function generateMetadata(): Promise<Metadata> {
  const { personalInfo: info } = await getCvData();
  if (!info) return {};

  // `absolute` because the layout's "%s — Ajibola" template would otherwise
  // append his name to a title that already leads with it.
  const title = info.role ? `${info.name} — ${info.role}` : info.name;
  const description =
    info.description ||
    [info.tagline, info.tagline_suffix].filter(Boolean).join(" ");

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: "/" },
    openGraph: {
      title,
      description,
      url: "/",
      // A personal homepage, not a generic site — this is what tells a crawler
      // the page is about a person.
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: twitterHandle(info.social?.twitter),
    },
  };
}

/**
 * One editorial column: who, what he has built, who vouches for it, where he
 * has worked, what he writes, how to reach him. Education, certifications,
 * skills and languages live on /cv — the homepage is the argument, the CV is
 * the record.
 *
 * Section order is fixed by the design; `site_sections.visible` still decides
 * whether each one renders (and whether the nav offers Contact).
 */
export default async function HomePage() {
  const supabase = await createClient();
  const [
    { personalInfo, experience, recommendations, visibleSections },
    { data: featured },
    featuredNotes,
    stats,
  ] = await Promise.all([
    getCvData(),
    // Client work leads, side projects follow — the order the old reel used.
    supabase
      .from("projects")
      .select("*")
      .in("kind", ["client", "side"])
      .eq("featured", true)
      .order("kind", { ascending: true })
      .order("created_at", { ascending: false }),
    getFeaturedNotes(2),
    getSidebarStats(),
  ]);

  const show = (key: string) => visibleSections.includes(key);
  const current = experience.filter(
    (e) => e.end_date.toLowerCase() === "present",
  );

  return (
    <>
      {personalInfo && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Person",
            name: personalInfo.name,
            jobTitle: personalInfo.role,
            description: personalInfo.description,
            email: personalInfo.email || undefined,
            url: siteUrl,
            address: personalInfo.location || undefined,
            sameAs: Object.values(personalInfo.social ?? {}).filter(Boolean),
          }}
        />
      )}
      <TopNav visibleSections={visibleSections} />
      <main
        id="main-content"
        tabIndex={-1}
        className="page-enter flex-1 focus:outline-none"
      >
        <div className="mx-auto w-full min-w-0 max-w-5xl px-6">
          <Hero info={personalInfo} current={current} stats={stats} />
          {show("featured-work") && (
            <FeaturedWork
              projects={(featured as Project[] | null) ?? []}
              total={stats.projectCount}
            />
          )}
          {show("recommendations") && (
            <Recommendations items={recommendations} />
          )}
          {show("experience") && <Experience entries={experience} />}
          {show("featured-work") && <FeaturedNotes notes={featuredNotes} />}
          {show("connect") && <Connect info={personalInfo} />}
          <Owe />
        </div>
      </main>
      <SiteFooter
        name={personalInfo?.name ?? ""}
        availability={personalInfo?.availability}
      />
    </>
  );
}
