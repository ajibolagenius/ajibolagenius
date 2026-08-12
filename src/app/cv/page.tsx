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

/**
 * The printable CV.
 *
 * AUTHORING RULES — this page is also an A4 document, and paged media is
 * unforgiving in two ways that dictate how the markup below is written:
 *
 *  1. NO FLEX OR GRID AROUND ANYTHING THAT MIGHT BREAK. Chrome honours
 *     `break-inside: avoid` only when the box and its ancestors are block
 *     boxes; inside a flex or grid container it slices items mid-paragraph
 *     instead. Every vertical stack here is therefore a block with margin
 *     spacing (`space-y-*`, `mt-*`), never `flex flex-col gap-*`. Flex is used
 *     only for single-line leaf rows — a title beside its dates, the contact
 *     rail — which never need to fragment.
 *
 *  2. STRUCTURE IS SHARED, DENSITY IS NOT. The screen sheet and the A4
 *     document are one DOM. The `cv-*` class names are the hooks the print
 *     block in globals.css reflows: it drops to a single column (a CSS sidebar
 *     cannot repeat onto later sheets, so keeping two would leave every page
 *     after the first with a blank gutter) and switches to a pt type scale.
 *     Read that block before changing any layout here.
 *
 * Content order is print order: identity, contact, profile, then skills and
 * languages, then history. The screen's two columns are a grid placement of
 * that same order, not a different one.
 */

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

/** Section shell: hairline rule, heading, then block-flow content. */
function Section({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`cv-section border-t border-ink/10 pt-5 ${className}`}>
      <h2 className="cv-h2 text-h3 mb-3 font-normal">{title}</h2>
      {children}
    </section>
  );
}

/** A URL printed as readable text — a hyperlink with no visible URL is
 *  unusable on paper, and this avoids ::after content injection. */
function UrlLine({ href }: { href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="cv-url mt-1 inline-block break-all font-mono text-body-xs text-ink/50 transition-colors hover:text-accent"
    >
      {href.replace(/^https?:\/\//, "")}
    </a>
  );
}

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

  // One rail instead of the old stacked sidebar list: eight facts down a 240px
  // column ran to eight lines, the same eight across 186mm run to two.
  const railItems = [
    info.location && { key: "location", Icon: MapPin, text: info.location },
    yearsLabel && { key: "years", Icon: Briefcase, text: yearsLabel },
    info.availability && {
      key: "availability",
      Icon: Globe,
      text: info.availability,
    },
    info.email && { key: "email", Icon: Envelope, text: info.email },
    info.phone && { key: "phone", Icon: Phone, text: info.phone },
    info.social?.github && {
      key: "github",
      Icon: GithubLogo,
      text: info.social.github.replace(/^https?:\/\//, ""),
    },
    info.social?.linkedin && {
      key: "linkedin",
      Icon: LinkedinLogo,
      text: info.social.linkedin.replace(/^https?:\/\//, ""),
    },
    info.social?.twitter && {
      key: "twitter",
      Icon: XLogo,
      text: info.social.twitter.replace(/^https?:\/\//, ""),
    },
  ].filter(
    (item): item is Exclude<typeof item, false | "" | null | undefined> =>
      Boolean(item),
  );

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

      <article className="cv-sheet mx-auto max-w-[860px] bg-cream p-8 shadow-sm sm:p-12 print:max-w-none print:shadow-none">
        <header className="cv-head">
          <div className="cv-identity flex items-center gap-4">
            <div className="cv-avatar h-20 w-20 shrink-0 overflow-hidden">
              <Image
                src={info.avatar_url || "/avatar_3d.png"}
                alt={info.name}
                width={160}
                height={160}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <h1 className="cv-name text-h2 font-normal">{info.name}</h1>
              <p className="cv-role text-body-m text-ink/60">{info.role}</p>
            </div>
          </div>

          <ul className="cv-rail mt-5 flex flex-wrap gap-x-5 gap-y-1.5 text-body-s text-ink/70">
            {railItems.map(({ key, Icon, text }) => (
              <li key={key} className="flex items-center gap-1.5">
                <Icon weight="duotone" size={15} className="shrink-0" />
                <span className="break-all">{text}</span>
              </li>
            ))}
          </ul>

          {/* `description` appears here and nowhere else — it used to print
              both as the sidebar blurb and as the Profile prose. */}
          {info.description && (
            <Section title="Profile" className="cv-keep mt-6">
              <p className="text-body-m text-ink/70">{info.description}</p>
            </Section>
          )}
        </header>

        {/* Screen: skills/languages in a left column. Print: one column, in
            this same DOM order — see the print block in globals.css. */}
        <div className="cv-body mt-8 grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-[200px_1fr]">
          <aside className="cv-aside space-y-6">
            {skills.length > 0 && (
              <Section title="Skills" className="cv-keep">
                <div className="cv-chips flex flex-wrap gap-1.5">
                  {skills.map((skill) => (
                    <span
                      key={skill.id}
                      className="bg-ink/5 px-2 py-0.5 font-mono text-body-xs text-ink/70"
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </Section>
            )}

            {languages.length > 0 && (
              <Section title="Languages" className="cv-keep">
                <div className="cv-langs space-y-1.5">
                  {languages.map((lang) => (
                    <div
                      key={lang.id}
                      className="flex items-baseline gap-2 text-body-s"
                    >
                      <Image
                        src={`/flag-${lang.flag_code}.svg`}
                        alt=""
                        width={16}
                        height={16}
                        className="cv-flag mt-0.5 shrink-0 object-cover"
                      />
                      <span className="font-medium">{lang.name}</span>
                      <span className="text-body-xs text-ink/60">
                        {lang.proficiency}
                      </span>
                    </div>
                  ))}
                </div>
              </Section>
            )}
          </aside>

          <div className="cv-main space-y-6">
            {experience.length > 0 && (
              <Section title="Experience">
                <div className="cv-list space-y-5">
                  {experience.map((entry) => (
                    <article key={entry.id} className="cv-entry relative pl-12">
                      <span className="cv-entry-icon absolute left-0 top-0.5">
                        <CompanyIcon
                          seed={entry.company}
                          style={iconStyles.get(entry.company)}
                        />
                      </span>
                      <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                        <h3 className="cv-entry-title text-body-l font-medium">
                          {entry.role_title}
                        </h3>
                        <span className="cv-meta text-body-s text-ink/60">
                          {entry.start_date} &ndash; {entry.end_date}
                        </span>
                      </div>
                      <p className="cv-meta text-body-s text-ink/60">
                        {entry.company} &middot; {entry.employment_type}
                      </p>
                      {entry.body && (
                        <p className="mt-1.5 text-body-s text-ink/70">
                          {entry.body}
                        </p>
                      )}
                      {entry.bullets?.length > 0 && (
                        <ul className="mt-1.5 list-disc space-y-1 pl-4 text-body-s text-ink/70">
                          {entry.bullets.map((bullet) => (
                            <li key={bullet}>{bullet}</li>
                          ))}
                        </ul>
                      )}
                    </article>
                  ))}
                </div>
              </Section>
            )}

            {projects.length > 0 && (
              <Section title="Selected Projects">
                <div className="cv-list space-y-4">
                  {projects.map((project) => {
                    // Prefer the live site; fall back to the portfolio entry so
                    // every project carries a URL a reader can actually type.
                    // '#' is the table's placeholder for "no live URL".
                    const url =
                      project.live_url && project.live_url !== "#"
                        ? project.live_url
                        : `${siteUrl}/projects/${project.slug}`;

                    return (
                      <article key={project.id} className="cv-entry">
                        <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                          <h3 className="cv-entry-title text-body-l font-medium">
                            {project.name}
                          </h3>
                          {project.year && (
                            <span className="cv-meta text-body-s text-ink/60">
                              {project.year}
                            </span>
                          )}
                        </div>
                        {project.description && (
                          <p className="mt-1 text-body-s text-ink/70">
                            {project.description}
                          </p>
                        )}
                        <UrlLine href={url} />
                      </article>
                    );
                  })}
                </div>
              </Section>
            )}

            {education.length > 0 && (
              <Section title="Education">
                <div className="cv-list space-y-4">
                  {education.map((entry) => (
                    <article key={entry.id} className="cv-entry">
                      <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                        <h3 className="cv-entry-title text-body-l font-medium">
                          {entry.degree}
                        </h3>
                        <span className="cv-meta text-body-s text-ink/60">
                          {entry.year}
                        </span>
                      </div>
                      <p className="cv-meta text-body-s text-ink/60">
                        {entry.school}
                      </p>
                      {entry.description && (
                        <p className="mt-1 text-body-s text-ink/70">
                          {entry.description}
                        </p>
                      )}
                    </article>
                  ))}
                </div>
              </Section>
            )}

            {certifications.length > 0 && (
              <Section title="Certifications">
                <div className="cv-list space-y-3.5">
                  {certifications.map((cert) => {
                    // Both columns are `not null default ''`, and every row
                    // currently has an empty issued_date — join rather than
                    // interpolate so no stray separator survives.
                    const meta = [cert.issuer, cert.issued_date]
                      .filter(Boolean)
                      .join(" · ");

                    return (
                      <article key={cert.id} className="cv-entry">
                        <h3 className="cv-entry-title text-body-l font-medium">
                          {cert.title}
                        </h3>
                        {meta && (
                          <p className="cv-meta text-body-s text-ink/60">
                            {meta}
                          </p>
                        )}
                        {cert.link_url && <UrlLine href={cert.link_url} />}
                      </article>
                    );
                  })}
                </div>
              </Section>
            )}
          </div>
        </div>
      </article>
    </div>
  );
}
