import { SectionHeading } from "./section-heading";
import type { PersonalInfo, Skill } from "@/types/cv";

export function About({
  info,
  skills,
}: {
  info: PersonalInfo | null;
  skills: Skill[];
}) {
  if (!info) return null;

  return (
    <section className="reveal flex flex-col gap-4 border-t border-ink/10 py-10">
      <SectionHeading id="about">About</SectionHeading>
      <p className="max-w-2xl text-body-m text-ink/70">{info.description}</p>
      {skills.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-body-s font-medium text-ink/60">Key skills:</p>
          <div className="flex flex-wrap gap-2">
            {skills.slice(0, 6).map((skill) => (
              <span
                key={skill.id}
                className="bg-ink/5 px-3 py-1.5 font-mono text-body-s text-ink/70"
              >
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
