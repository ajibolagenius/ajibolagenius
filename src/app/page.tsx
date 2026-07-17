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
import type { Project } from "@/types/project";

export const revalidate = 60;

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
  ] = await Promise.all([
    getCvData(),
    supabase
      .from("projects")
      .select("*")
      .eq("kind", "client")
      .eq("featured", true)
      .order("created_at", { ascending: false })
      .limit(3),
  ]);

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000");

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
      <main className="flex-1 lg:ml-80">
        <div className="mx-auto w-full min-w-0 max-w-3xl px-6 py-10">
          <Hero info={personalInfo} experience={experience} />
          {visibleSections.map((key) => {
            switch (key) {
              case "featured-work":
                return (
                  <FeaturedWork
                    key={key}
                    projects={(featuredProjects as Project[] | null) ?? []}
                  />
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
