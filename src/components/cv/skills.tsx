import { SectionHeading } from "./section-heading";
import type { Skill } from "@/types/cv";

export function Skills({ skills }: { skills: Skill[] }) {
  if (skills.length === 0) return null;

  const techIcons = skills.filter((s) => s.icon_url);

  return (
    <section className="flex flex-col gap-6 border-t border-ink/10 py-10">
      <SectionHeading id="skills">Skills</SectionHeading>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <span
            key={skill.id}
            className="bg-ink/5 px-3 py-1.5 text-body-s text-ink/70"
          >
            {skill.name}
          </span>
        ))}
      </div>

      {techIcons.length > 0 && (
        <div className="flex flex-col gap-3">
          <p className="text-body-s font-medium text-ink/50">
            Technologies &amp; tools
          </p>
          <div className="flex flex-wrap gap-2">
            {techIcons.map((skill) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={skill.id}
                src={skill.icon_url!}
                alt={skill.name}
                title={skill.name}
                className="h-8 w-8 bg-ink/5 object-contain p-1.5"
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
