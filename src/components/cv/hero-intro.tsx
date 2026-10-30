"use client";

import { Fragment, type CSSProperties } from "react";
import { CompanyIcon } from "@/components/company-icon";
import { assignCompanyIcons } from "@/lib/company-icon";
import { useLanguage } from "@/lib/i18n";
import type { SidebarStats } from "@/lib/sidebar-stats";
import type { ExperienceEntry, PersonalInfo } from "@/types/cv";

function Company({ entry, icon }: { entry: ExperienceEntry; icon: React.ReactNode }) {
  const body = (
    <>
      <span className="mr-1.5 inline-block align-[-2px]">{icon}</span>
      {entry.company}
    </>
  );
  const className = "font-medium text-ink";

  return entry.company_url ? (
    <a
      href={entry.company_url}
      target="_blank"
      rel="noopener noreferrer"
      className={`${className} underline decoration-ink/20 underline-offset-4 transition-colors hover:decoration-accent`}
    >
      {body}
    </a>
  ) : (
    <span className={className}>{body}</span>
  );
}

export function HeroIntro({
  info,
  current,
  stats,
  status,
}: {
  info: PersonalInfo;
  current: ExperienceEntry[];
  stats: SidebarStats;
  status: React.ReactNode;
}) {
  const { t } = useLanguage();

  // One mention per company, even when two current roles share it.
  const companies = current.filter(
    (entry, i) => current.findIndex((e) => e.company === entry.company) === i,
  );
  const icons = assignCompanyIcons(companies.map((e) => e.company));

  const statLine = [
    stats.yearsLabel,
    stats.projectCount
      ? t.hero.projectsShipped.replace("{count}", String(stats.projectCount))
      : null,
  ].filter(Boolean);

  const socials = [
    ["GitHub", info.social?.github],
    ["LinkedIn", info.social?.linkedin],
    ["X", info.social?.twitter],
  ].filter((s): s is [string, string] => Boolean(s[1]));

  const step = (i: number) => ({ "--enter-i": i }) as CSSProperties;

  return (
    <section className="py-12 lg:py-20">
      <p className="enter mb-5 font-mono text-body-xs lowercase text-ink/55">
        {[info.role, info.location].filter(Boolean).join(" · ")}
      </p>

      <h1
        className="enter mb-9 font-display text-[clamp(3.5rem,11vw,8rem)] font-normal leading-[0.92] tracking-[-0.035em] text-balance"
        style={step(1)}
      >
        {info.name}
        <span lang="yo" className="mt-4 block text-[0.32em] leading-none tracking-normal text-accent">
          {t.hero.welcome}
        </span>
      </h1>

      {info.tagline && (
        <p
          className="enter mb-5 max-w-[34ch] font-display text-[clamp(1.375rem,2.6vw,1.75rem)] leading-[1.35] text-pretty"
          style={step(2)}
        >
          {info.tagline}
        </p>
      )}

      <div
        className="enter flex max-w-[62ch] flex-col gap-3 text-body-m text-ink/65"
        style={step(3)}
      >
        {info.description && <p>{info.description}</p>}
        {/* A div, not a <p>: CompanyIcon renders block elements. */}
        {companies.length > 0 && (
          <div>
            {t.hero.currentlyAt}{" "}
            {companies.map((entry, i) => (
              <Fragment key={entry.id}>
                {i > 0 && (i === companies.length - 1 ? ` ${t.hero.and} ` : ", ")}
                <Company
                  entry={entry}
                  icon={
                    <CompanyIcon
                      seed={entry.company}
                      size={16}
                      style={icons.get(entry.company)}
                    />
                  }
                />
              </Fragment>
            ))}
            .
          </div>
        )}
        {statLine.length > 0 && (
          <p className="font-mono text-body-xs text-ink/50">{statLine.join(" · ")}</p>
        )}
      </div>

      <div className="enter mt-9" style={step(4)}>
        {status}
      </div>

      <div
        className="enter mt-7 flex flex-wrap gap-x-5 gap-y-2 text-body-s"
        style={step(5)}
      >
        <a
          href="#featured-work"
          className="text-accent underline decoration-accent/30 underline-offset-4 transition-colors hover:decoration-accent"
        >
          {t.hero.seeWork} ↓
        </a>
        {socials.map(([label, href]) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-ink/20 underline-offset-4 transition-colors hover:decoration-accent"
          >
            {label}
          </a>
        ))}
      </div>
    </section>
  );
}
