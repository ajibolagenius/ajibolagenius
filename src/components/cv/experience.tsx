import { SectionHeading } from "./section-heading";
import { CompanyIcon } from "@/components/company-icon";
import type { ExperienceEntry } from "@/types/cv";

export function Experience({ entries }: { entries: ExperienceEntry[] }) {
  if (entries.length === 0) return null;

  return (
    <section className="flex flex-col gap-6 border-t border-ink/10 py-10">
      <SectionHeading id="experience">Experience</SectionHeading>
      <div className="flex flex-col gap-6">
        {entries.map((entry) => (
          <div key={entry.id} className="flex gap-4">
            <CompanyIcon seed={entry.company} />
            <div className="flex flex-1 flex-col gap-1">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 className="text-body-l font-medium">
                  {entry.role_title}
                </h3>
                <span className="text-body-s text-ink/40">
                  {entry.start_date} &ndash; {entry.end_date}
                </span>
              </div>
              <p className="text-body-s text-ink/50">
                {entry.company} &middot; {entry.employment_type}
              </p>
              {entry.body && (
                <p className="mt-1 text-body-s text-ink/70">{entry.body}</p>
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
    </section>
  );
}
