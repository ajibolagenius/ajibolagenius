import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Briefcase,
  Envelope,
  GithubLogo,
  Globe,
  LinkedinLogo,
  MapPin,
  Phone,
  XLogo,
} from "@phosphor-icons/react/dist/ssr";
import { getCvData } from "@/lib/cv-data";
import { createClient } from "@/lib/supabase/server";
import { CvDownloadButton } from "@/components/cv-download-button";
import { CompanyIcon } from "@/components/company-icon";
import { assignCompanyIcons } from "@/lib/company-icon";
import { experienceLabel } from "@/lib/experience-span";
import { LISTED_KINDS } from "@/lib/project-kind";
import { siteUrl } from "@/lib/site-url";
import type { Metadata } from "next";

/** The columns the CV's project block actually renders. */
type CvProject = {
  id: string;
  slug: string;
  name: string;
  description: string;
  live_url: string;
  year: string;
};

export async function generateMetadata(): Promise<Metadata> {
  const { personalInfo: info } = await getCvData();

  const title = "CV";
  const description = info?.description ?? "Software engineer CV and work history.";

  return {
    title,
    description,
    alternates: { canonical: "/cv" },
    openGraph: {
      title: info ? `CV — ${info.name}` : title,
      description,
      url: "/cv",
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      title: info ? `CV — ${info.name}` : title,
      description,
    },
  };
}

const divider = "border-t border-ink/10 pt-6";

/**
 * Entries must not tear across a page break — a role whose bullets land on the
 * next sheet reads as two half-jobs. `break-inside` only has meaning in paged
 * media, so this is safe to apply unconditionally.
 */
const keepTogether = "break-inside-avoid";

export default async function CvPage() {
  const supabase = await createClient();

  const [
    { personalInfo: info, skills, experience, education, languages, certifications },
    { data: projectRows },
  ] = await Promise.all([
    getCvData(),
    supabase
      .from("projects")
      // Narrow select: this page renders a one-line summary per project, and
      // the long-form columns (problem/solution/tech_details/screenshots)
      // would be fetched and discarded.
      .select("id, slug, name, description, live_url, year")
      .in("kind", LISTED_KINDS)
      .eq("featured", true)
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  if (!info) return null;

  const iconStyles = assignCompanyIcons(experience.map((e) => e.company));
  const projects = (projectRows ?? []) as CvProject[];

  // Derived, not hardcoded. Null means "omit the line" — never fall back to a
  // fixed number, which is exactly how the old "5+ years" went stale.
  const yearsLabel = experienceLabel(experience);

  return (
    <div className="min-h-screen bg-panel py-10 print:bg-cream print:py-0">
      <CvDownloadButton />

      <div className="mx-auto mb-6 max-w-[860px] px-6 print:hidden">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-body-s text-ink/60 transition-colors hover:text-accent"
        >
          <ArrowLeft weight="duotone" size={16} />
          Back to site
        </Link>
      </div>

      <div className="mx-auto grid max-w-[860px] grid-cols-1 gap-x-10 gap-y-10 bg-cream p-8 shadow-sm sm:grid-cols-[240px_1fr] sm:p-12 print:max-w-none print:shadow-none">
        {/* Left column */}
        <div className="flex flex-col gap-6">
          <div className="h-20 w-20 overflow-hidden">
            <Image
              src={info.avatar_url || "/avatar_3d.png"}
              alt={info.name}
              width={160}
              height={160}
              className="h-full w-full object-cover"
            />
          </div>

          {/* `description` deliberately does not appear here. It is the
              Profile prose in the right-hand column, and printing the same
              paragraph twice on one page was the single most visible defect
              on this document. */}
          <div>
            <h1 className="text-h3 font-normal">{info.name}</h1>
            <p className="text-body-s text-ink/60">{info.role}</p>
          </div>

          <div className={`flex flex-col gap-2 text-body-s text-ink/70 ${divider}`}>
            {info.location && (
              <div className="flex items-center gap-2">
                <MapPin weight="duotone" size={16} />
                {info.location}
              </div>
            )}
            {yearsLabel && (
              <div className="flex items-center gap-2">
                <Briefcase weight="duotone" size={16} />
                {yearsLabel}
              </div>
            )}
            {info.availability && (
              <div className="flex items-center gap-2">
                <Globe weight="duotone" size={16} />
                {info.availability}
              </div>
            )}
          </div>

          <div className={divider}>
            <h2 className="text-h3 mb-3 font-normal">Contact</h2>
            <div className="flex flex-col gap-2 text-body-s text-ink/70">
              {info.email && (
                <div className="flex items-center gap-2">
                  <Envelope weight="duotone" size={16} />
                  <span className="break-all">{info.email}</span>
                </div>
              )}
              {info.phone && (
                <div className="flex items-center gap-2">
                  <Phone weight="duotone" size={16} />
                  {info.phone}
                </div>
              )}
              {info.social?.github && (
                <div className="flex items-center gap-2">
                  <GithubLogo weight="duotone" size={16} />
                  <span className="break-all">
                    {info.social.github.replace(/^https?:\/\//, "")}
                  </span>
                </div>
              )}
              {info.social?.linkedin && (
                <div className="flex items-center gap-2">
                  <LinkedinLogo weight="duotone" size={16} />
                  <span className="break-all">
                    {info.social.linkedin.replace(/^https?:\/\//, "")}
                  </span>
                </div>
              )}
              {info.social?.twitter && (
                <div className="flex items-center gap-2">
                  <XLogo weight="duotone" size={16} />
                  <span className="break-all">
                    {info.social.twitter.replace(/^https?:\/\//, "")}
                  </span>
                </div>
              )}
            </div>
          </div>

          {skills.length > 0 && (
            <div className={divider}>
              <h2 className="text-h3 mb-3 font-normal">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill.id}
                    className="bg-ink/5 px-2.5 py-1 font-mono text-body-xs text-ink/70"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {languages.length > 0 && (
            <div className={divider}>
              <h2 className="text-h3 mb-3 font-normal">Languages</h2>
              <div className="flex flex-col gap-3">
                {languages.map((lang) => (
                  <div key={lang.id} className="flex items-center gap-2">
                    <Image
                      src={`/flag-${lang.flag_code}.svg`}
                      alt=""
                      width={20}
                      height={20}
                      className="object-cover"
                    />
                    <div>
                      <p className="text-body-s font-medium">{lang.name}</p>
                      <p className="text-body-xs text-ink/60">
                        {lang.proficiency}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-8">
          <div className={keepTogether}>
            <h2 className="text-h2 mb-3 font-normal">Profile</h2>
            <p className="text-body-m text-ink/70">{info.description}</p>
          </div>

          {experience.length > 0 && (
            <div className={divider}>
              <h2 className="text-h2 mb-5 font-normal">Experience</h2>
              <div className="flex flex-col gap-6">
                {experience.map((entry) => (
                  <div key={entry.id} className={`flex gap-4 ${keepTogether}`}>
                    <CompanyIcon
                      seed={entry.company}
                      style={iconStyles.get(entry.company)}
                    />
                    <div className="flex flex-1 flex-col gap-1">
                      <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                        <h3 className="text-body-l font-medium">
                          {entry.role_title}
                        </h3>
                        <span className="text-body-s text-ink/60">
                          {entry.start_date} &ndash; {entry.end_date}
                        </span>
                      </div>
                      <p className="text-body-s text-ink/60">
                        {entry.company} &middot; {entry.employment_type}
                      </p>
                      {entry.body && (
                        <p className="mt-1 text-body-s text-ink/70">
                          {entry.body}
                        </p>
                      )}
                      {entry.bullets?.length > 0 && (
                        <ul className="mt-1 flex list-disc flex-col gap-1 pl-4 text-body-s text-ink/70">
                          {entry.bullets.map((bullet) => (
                            <li key={bullet}>{bullet}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {projects.length > 0 && (
            <div className={divider}>
              <h2 className="text-h2 mb-5 font-normal">Selected Projects</h2>
              <div className="flex flex-col gap-5">
                {projects.map((project) => {
                  // Prefer the live site; fall back to the portfolio entry so
                  // every project carries a URL a reader can actually type.
                  // '#' is the table's placeholder for "no live URL".
                  const url =
                    project.live_url && project.live_url !== "#"
                      ? project.live_url
                      : `${siteUrl}/projects/${project.slug}`;

                  return (
                    <div key={project.id} className={keepTogether}>
                      <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                        <h3 className="text-body-l font-medium">
                          {project.name}
                        </h3>
                        {project.year && (
                          <span className="text-body-s text-ink/60">
                            {project.year}
                          </span>
                        )}
                      </div>
                      {project.description && (
                        <p className="mt-1 text-body-s text-ink/70">
                          {project.description}
                        </p>
                      )}
                      {/* Rendered as visible text rather than a bare link:
                          on paper a hyperlink with no URL is unusable, and
                          this avoids needing ::after content injection. */}
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 inline-block break-all font-mono text-body-xs text-ink/50 transition-colors hover:text-accent"
                      >
                        {url.replace(/^https?:\/\//, "")}
                      </a>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {education.length > 0 && (
            <div className={divider}>
              <h2 className="text-h2 mb-5 font-normal">Education</h2>
              <div className="flex flex-col gap-5">
                {education.map((entry) => (
                  <div key={entry.id} className={keepTogether}>
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                      <h3 className="text-body-l font-medium">
                        {entry.degree}
                      </h3>
                      <span className="text-body-s text-ink/60">
                        {entry.year}
                      </span>
                    </div>
                    <p className="text-body-s text-ink/60">{entry.school}</p>
                    {entry.description && (
                      <p className="mt-1 text-body-s text-ink/70">
                        {entry.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {certifications.length > 0 && (
            <div className={divider}>
              <h2 className="text-h2 mb-5 font-normal">Certifications</h2>
              <div className="flex flex-col gap-4">
                {certifications.map((cert) => {
                  // Both columns are `not null default ''`, and every row
                  // currently has an empty issued_date — join rather than
                  // interpolate so no stray separator survives.
                  const meta = [cert.issuer, cert.issued_date]
                    .filter(Boolean)
                    .join(" · ");

                  return (
                    <div key={cert.id} className={keepTogether}>
                      <h3 className="text-body-l font-medium">{cert.title}</h3>
                      {meta && (
                        <p className="text-body-s text-ink/60">{meta}</p>
                      )}
                      {cert.link_url && (
                        <a
                          href={cert.link_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1 inline-block break-all font-mono text-body-xs text-ink/50 transition-colors hover:text-accent"
                        >
                          {cert.link_url.replace(/^https?:\/\//, "")}
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
