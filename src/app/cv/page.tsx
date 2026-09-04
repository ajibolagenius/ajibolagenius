import { Fragment } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Envelope,
  GithubLogo,
  LinkedinLogo,
  MapPin,
  Phone,
  XLogo,
} from "@phosphor-icons/react/dist/ssr";
import { getCvData } from "@/lib/cv-data";
import { createClient } from "@/lib/supabase/server";
import { CvDownloadButton } from "@/components/cv-download-button";
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

type ContactIcon = typeof MapPin;
type ContactItem = { icon: ContactIcon; label: string; href?: string };

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

/** Rule between sections — this is the only visual separator in an
 *  otherwise plain, single-column, ATS-parseable document. */
const divider = "border-t border-ink/10 pt-6";

const sectionHeading =
  "mb-3 border-b border-ink/15 pb-1 text-h3 font-normal uppercase tracking-wide";

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

  const projects = (projectRows ?? []) as CvProject[];

  // Derived, not hardcoded. Null means "omit the line" — never fall back to a
  // fixed number, which is exactly how the old "5+ years" went stale.
  const yearsLabel = experienceLabel(experience);

  // A photo, per-entry location glyph, and per-company iconography are all
  // ATS/print noise with no parseable value — this document is plain text
  // first, styled second.
  const contactItems: ContactItem[] = [
    info.location ? { icon: MapPin, label: info.location } : null,
    info.phone ? { icon: Phone, label: info.phone } : null,
    info.email ? { icon: Envelope, label: info.email, href: `mailto:${info.email}` } : null,
    info.social?.github
      ? {
          icon: GithubLogo,
          label: info.social.github.replace(/^https?:\/\//, ""),
          href: info.social.github,
        }
      : null,
    info.social?.linkedin
      ? {
          icon: LinkedinLogo,
          label: info.social.linkedin.replace(/^https?:\/\//, ""),
          href: info.social.linkedin,
        }
      : null,
    info.social?.twitter
      ? {
          icon: XLogo,
          label: info.social.twitter.replace(/^https?:\/\//, ""),
          href: info.social.twitter,
        }
      : null,
  ].filter((item): item is ContactItem => item !== null);

  const metaLine = [yearsLabel, info.availability].filter(Boolean).join("  ·  ");

  return (
    <div className="min-h-screen bg-panel py-10 print:bg-cream print:py-0">
      <CvDownloadButton />

      <div className="mx-auto mb-6 max-w-[760px] px-6 print:hidden">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-body-s text-ink/60 transition-colors hover:text-accent"
        >
          <ArrowLeft weight="duotone" size={16} />
          Back to site
        </Link>
      </div>

      <main
        id="main-content"
        tabIndex={-1}
        className="mx-auto max-w-[760px] bg-cream p-8 shadow-sm sm:p-12 print:max-w-none print:shadow-none focus:outline-none"
      >
        {/* Header */}
        <header className="mb-8 border-b border-ink/15 pb-5 text-center">
          <h1 className="text-h1 font-normal uppercase tracking-wide">{info.name}</h1>
          {info.role && <p className="mt-1 text-body-m text-ink/60">{info.role}</p>}

          {contactItems.length > 0 && (
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-body-s text-ink/60">
              {contactItems.map((item, i) => (
                <Fragment key={item.label}>
                  {i > 0 && (
                    <span aria-hidden className="text-ink/25">
                      &bull;
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1.5">
                    <item.icon weight="duotone" size={14} />
                    {item.href ? (
                      <a
                        href={item.href}
                        target={item.href.startsWith("mailto:") ? undefined : "_blank"}
                        rel="noopener noreferrer"
                        className="transition-colors hover:text-accent"
                      >
                        {item.label}
                      </a>
                    ) : (
                      item.label
                    )}
                  </span>
                </Fragment>
              ))}
            </div>
          )}

          {metaLine && <p className="mt-2 text-body-xs text-ink/45">{metaLine}</p>}
        </header>

        <div className="flex flex-col gap-6">
          {/* Profile */}
          <section className={keepTogether}>
            <h2 className={sectionHeading}>Profile</h2>
            <p className="text-body-s leading-relaxed text-ink/70">{info.description}</p>
          </section>

          {/* Skills */}
          {skills.length > 0 && (
            <section className={divider}>
              <h2 className={sectionHeading}>Core Skills</h2>
              <p className="font-mono text-body-s leading-relaxed text-ink/70">
                {skills.map((skill) => skill.name).join("   ·   ")}
              </p>
            </section>
          )}

          {/* Languages */}
          {languages.length > 0 && (
            <section className={divider}>
              <h2 className={sectionHeading}>Languages</h2>
              <p className="text-body-s leading-relaxed text-ink/70">
                {languages.map((lang) => `${lang.name} (${lang.proficiency})`).join("   ·   ")}
              </p>
            </section>
          )}

          {/* Experience */}
          {experience.length > 0 && (
            <section className={divider}>
              <h2 className={sectionHeading}>Professional Experience</h2>
              <div className="flex flex-col gap-5">
                {experience.map((entry) => (
                  <div key={entry.id} className={keepTogether}>
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                      <h3 className="text-body-l font-medium">{entry.company}</h3>
                      <span className="whitespace-nowrap text-body-s text-ink/55">
                        {entry.start_date} &ndash; {entry.end_date}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                      <span className="text-body-s italic text-ink/60">{entry.role_title}</span>
                      {entry.employment_type && (
                        <span className="whitespace-nowrap text-body-xs text-ink/45">
                          {entry.employment_type}
                        </span>
                      )}
                    </div>
                    {entry.body && (
                      <p className="mt-1.5 text-body-s text-ink/70">{entry.body}</p>
                    )}
                    {entry.bullets?.length > 0 && (
                      <ul className="mt-1.5 flex list-disc flex-col gap-1 pl-4 text-body-s text-ink/70">
                        {entry.bullets.map((bullet) => (
                          <li key={bullet}>{bullet}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Selected Projects */}
          {projects.length > 0 && (
            <section className={divider}>
              <h2 className={sectionHeading}>Selected Projects</h2>
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
                        <h3 className="text-body-l font-medium">{project.name}</h3>
                        {project.year && (
                          <span className="whitespace-nowrap text-body-s text-ink/55">
                            {project.year}
                          </span>
                        )}
                      </div>
                      {project.description && (
                        <p className="mt-1 text-body-s text-ink/70">{project.description}</p>
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
            </section>
          )}

          {/* Education */}
          {education.length > 0 && (
            <section className={divider}>
              <h2 className={sectionHeading}>Education</h2>
              <div className="flex flex-col gap-4">
                {education.map((entry) => (
                  <div key={entry.id} className={keepTogether}>
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                      <h3 className="text-body-l font-medium">{entry.school}</h3>
                      <span className="whitespace-nowrap text-body-s text-ink/55">
                        {entry.year}
                      </span>
                    </div>
                    <p className="text-body-s italic text-ink/60">{entry.degree}</p>
                    {entry.description && (
                      <p className="mt-1 text-body-s text-ink/70">{entry.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <section className={divider}>
              <h2 className={sectionHeading}>Certifications</h2>
              <ul className="flex flex-col gap-2">
                {certifications.map((cert) => {
                  // Both columns are `not null default ''`, and every row
                  // currently has an empty issued_date — join rather than
                  // interpolate so no stray separator survives.
                  const meta = [cert.issuer, cert.issued_date].filter(Boolean).join(" · ");

                  return (
                    <li key={cert.id} className={keepTogether}>
                      <span className="text-body-s font-medium">{cert.title}</span>
                      {meta && <span className="text-body-s text-ink/55"> &mdash; {meta}</span>}
                      {cert.link_url && (
                        <a
                          href={cert.link_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-2 break-all font-mono text-body-xs text-ink/50 transition-colors hover:text-accent"
                        >
                          {cert.link_url.replace(/^https?:\/\//, "")}
                        </a>
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
