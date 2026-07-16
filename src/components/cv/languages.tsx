import Image from "next/image";
import { SectionHeading } from "./section-heading";
import type { Language } from "@/types/cv";

export function Languages({ languages }: { languages: Language[] }) {
  if (languages.length === 0) return null;

  return (
    <section className="flex flex-col gap-6 border-t border-ink/10 py-10">
      <SectionHeading id="languages">Languages</SectionHeading>
      <div className="flex flex-col gap-4">
        {languages.map((lang) => (
          <div key={lang.id} className="flex items-center gap-3">
            <Image
              src={`/flag-${lang.flag_code}.svg`}
              alt=""
              width={24}
              height={18}
              className=" object-cover"
            />
            <div>
              <p className="text-body-m font-medium">{lang.name}</p>
              <p className="text-body-s text-ink/60">{lang.proficiency}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
