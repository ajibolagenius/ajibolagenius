import { createClient } from "@/lib/supabase/server";
import { getCvData } from "@/lib/cv-data";
import { JsonLd } from "@/components/json-ld";
import { TopNav } from "@/components/cv/top-nav";
import { Sidebar } from "@/components/cv/sidebar";
import { Hero } from "@/components/cv/hero";
import { FeaturedWork } from "@/components/cv/featured-work";
import { About } from "@/components/cv/about";
import { Experience } from "@/components/cv/experience";
import { Education } from "@/components/cv/education";
import { Certifications } from "@/components/cv/certifications";
import { Skills } from "@/components/cv/skills";
import { Languages } from "@/components/cv/languages";
import { Recommendations } from "@/components/cv/recommendations";
import { Connect } from "@/components/cv/connect";
import { SiteFooter } from "@/components/cv/site-footer";
import { FeaturedNotes } from "@/components/cv/featured-notes";
import { getFeaturedNotes } from "@/lib/notes";
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

export default async function HomePage() {
  const supabase = await createClient();
  const [
    {
      personalInfo,
      skills,
      experience,
      education,
      certifications,
      languages,
      recommendations,
      visibleSections,
    },
    { data: featuredProjects },
    { data: featuredSideProjects },
    featuredNotes,
  ] = await Promise.all([
    getCvData(),
    supabase
      .from("projects")
      .select("*")
      .eq("kind", "client")
      .eq("featured", true)
      .order("created_at", { ascending: false }),
    supabase
      .from("projects")
      .select("*")
      .eq("kind", "side")
      .eq("featured", true)
      .order("created_at", { ascending: false }),
    getFeaturedNotes(2),
  ]);

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
      <Sidebar info={personalInfo} />
      <main className="page-enter flex-1 lg:ml-80">
        <div className="mx-auto w-full min-w-0 max-w-3xl xl:max-w-5xl 2xl:max-w-6xl px-6 py-10">
          <Hero
            info={personalInfo}
            currentExperience={
              experience.find((e) => e.end_date.toLowerCase() === "present") ||
              experience[0] ||
              null
            }
          />
          {visibleSections.map((key) => {
            switch (key) {
              case "featured-work":
                return (
                  <div key={key} className="flex flex-col gap-6">
                    <FeaturedWork
                      projects={(featuredProjects as Project[] | null) ?? []}
                      sideProjects={
                        (featuredSideProjects as Project[] | null) ?? []
                      }
                    />
                    <FeaturedNotes notes={featuredNotes} />
                  </div>
                );
              case "about":
                return <About key={key} info={personalInfo} skills={skills} />;
              case "experience":
                return <Experience key={key} entries={experience} />;
              case "education":
                return <Education key={key} entries={education} />;
              case "certifications":
                return <Certifications key={key} entries={certifications} />;
              case "skills":
                return <Skills key={key} skills={skills} />;
              case "languages":
                return <Languages key={key} languages={languages} />;
              case "recommendations":
                return <Recommendations key={key} items={recommendations} />;
              case "connect":
                return <Connect key={key} info={personalInfo} />;
              default:
                return null;
            }
          })}
        </div>
      </main>
      <SiteFooter name={personalInfo?.name ?? ""} />
    </>
  );
}
