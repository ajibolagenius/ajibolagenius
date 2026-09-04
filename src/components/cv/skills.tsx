"use client";

import Image from "next/image";
import { SectionHeading } from "./section-heading";
import { useLanguage } from "@/lib/i18n";
import type { Skill } from "@/types/cv";

function TechIcon({ skill }: { skill: Skill }) {
  const isSvg = (url?: string | null) => Boolean(url && url.endsWith(".svg"));

  if (skill.icon_url_dark) {
    return (
      <span
        className="flex h-8 w-8 items-center justify-center bg-ink/5 p-1.5"
        title={skill.name}
      >
        <Image
          src={skill.icon_url!}
          alt={skill.name}
          width={32}
          height={32}
          className="h-full w-full object-contain dark:hidden"
          unoptimized={isSvg(skill.icon_url)}
        />
        <Image
          src={skill.icon_url_dark}
          alt={skill.name}
          width={32}
          height={32}
          className="hidden h-full w-full object-contain dark:block"
          unoptimized={isSvg(skill.icon_url_dark)}
        />
      </span>
    );
  }

  return (
    <span
      className="flex h-8 w-8 items-center justify-center bg-ink/5 p-1.5"
      title={skill.name}
    >
      <Image
        src={skill.icon_url!}
        alt={skill.name}
        width={32}
        height={32}
        className="h-full w-full object-contain"
        unoptimized={isSvg(skill.icon_url)}
      />
    </span>
  );
}

export function Skills({ skills }: { skills: Skill[] }) {
  const { t } = useLanguage();
  if (skills.length === 0) return null;

  const techIcons = skills.filter((s) => s.icon_url);

  return (
    <section className="reveal flex flex-col gap-6 border-t border-ink/10 py-10">
      <SectionHeading id="skills">Skills</SectionHeading>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <span
            key={skill.id}
            className="bg-ink/5 px-3 py-1.5 font-mono text-body-s text-ink/70"
          >
            {skill.name}
          </span>
        ))}
      </div>

      {techIcons.length > 0 && (
        <div className="flex flex-col gap-3">
          <p className="text-body-s font-medium text-ink/60">
            {t.headings.tools}
          </p>
          <div className="flex flex-wrap gap-2">
            {techIcons.map((skill) => (
              <TechIcon key={skill.id} skill={skill} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
