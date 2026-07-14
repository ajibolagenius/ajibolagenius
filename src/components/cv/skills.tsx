import { SectionHeading } from "./section-heading";
import type { Skill } from "@/types/cv";

const TECH_BADGES = [
  { label: "React", bg: "#61DAFB", fg: "#0b0b0b" },
  { label: "Next", bg: "#000000", fg: "#fff" },
  { label: "JS", bg: "#F7DF1E", fg: "#0b0b0b" },
  { label: "TS", bg: "#3178C6", fg: "#fff" },
  { label: "AWS", bg: "#FF9900", fg: "#0b0b0b" },
  { label: "GH", bg: "#181717", fg: "#fff" },
];

export function Skills({ skills }: { skills: Skill[] }) {
  if (skills.length === 0) return null;

  return (
    <section className="flex flex-col gap-6 border-t border-ink/10 py-10">
      <SectionHeading id="skills">Skills</SectionHeading>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <span
            key={skill.id}
            className="rounded-full bg-ink/5 px-3 py-1.5 text-body-s text-ink/70"
          >
            {skill.name}
          </span>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        <p className="text-body-s font-medium text-ink/50">
          Technologies &amp; tools
        </p>
        <div className="flex flex-wrap gap-2">
          {TECH_BADGES.map((tech) => (
            <span
              key={tech.label}
              className="flex h-8 w-8 items-center justify-center rounded-md text-[10px] font-semibold"
              style={{ backgroundColor: tech.bg, color: tech.fg }}
            >
              {tech.label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
