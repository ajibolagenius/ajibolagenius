import { SectionHeading } from "./section-heading";
import type { EducationEntry } from "@/types/cv";

export function Education({ entries }: { entries: EducationEntry[] }) {
  if (entries.length === 0) return null;

  return (
    <section className="flex flex-col gap-6 border-t border-ink/10 py-10">
      <SectionHeading id="education">Education</SectionHeading>
      <div className="flex flex-col gap-5">
        {entries.map((entry) => (
          <div key={entry.id}>
            <div className="flex flex-wrap items-baseline justify-between gap-x-4">
              <h3 className="text-body-l font-medium">{entry.degree}</h3>
              <span className="text-body-s text-ink/60">{entry.year}</span>
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
    </section>
  );
}
