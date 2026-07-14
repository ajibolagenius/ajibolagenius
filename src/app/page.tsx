import { getCvData } from "@/lib/cv-data";
import { TopNav } from "@/components/cv/top-nav";
import { Sidebar } from "@/components/cv/sidebar";
import { Hero } from "@/components/cv/hero";
import { About } from "@/components/cv/about";
import { Experience } from "@/components/cv/experience";
import { Education } from "@/components/cv/education";
import { Certifications } from "@/components/cv/certifications";
import { Skills } from "@/components/cv/skills";
import { Languages } from "@/components/cv/languages";
import { Recommendations } from "@/components/cv/recommendations";
import { Connect } from "@/components/cv/connect";
import { SiteFooter } from "@/components/cv/site-footer";

export default async function HomePage() {
  const {
    personalInfo,
    skills,
    experience,
    education,
    certifications,
    languages,
    recommendations,
  } = await getCvData();

  return (
    <>
      <TopNav />
      <main
        id="top"
        className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-10 px-6 py-10 lg:flex-row lg:gap-16"
      >
        <Sidebar info={personalInfo} />

        <div className="min-w-0 flex-1">
          <Hero info={personalInfo} experience={experience} />
          <About info={personalInfo} skills={skills} />
          <Experience entries={experience} />
          <Education entries={education} />
          <Certifications entries={certifications} />
          <Skills skills={skills} />
          <Languages languages={languages} />
          <Recommendations items={recommendations} />
          <Connect info={personalInfo} />
        </div>
      </main>
      <SiteFooter name={personalInfo?.name ?? ""} />
    </>
  );
}
