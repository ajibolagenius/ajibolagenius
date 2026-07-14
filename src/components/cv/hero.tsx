import Image from "next/image";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { CompanyIcon } from "@/components/company-icon";
import type { ExperienceEntry, PersonalInfo } from "@/types/cv";

export function Hero({
  info,
  experience,
}: {
  info: PersonalInfo | null;
  experience: ExperienceEntry[];
}) {
  if (!info) return null;

  const recentJobs = experience.slice(0, 3);

  return (
    <section className="flex flex-col items-center gap-6 py-16 text-center">
      <Image
        src="/illustration-hero.svg"
        alt=""
        width={120}
        height={90}
        className="animate-fade-in-up opacity-90"
      />
      <h2 className="animate-fade-in-up text-h1 font-normal [animation-delay:80ms]">
        {info.tagline}
      </h2>
      <p className="max-w-md animate-fade-in-up text-body-m text-ink/60 [animation-delay:140ms]">
        {info.tagline_suffix}
      </p>
      <a
        href="#experience"
        className="group inline-flex animate-fade-in-up items-center gap-3 bg-ink/5 py-2 pl-2 pr-5 text-body-s font-medium text-ink transition-colors hover:bg-ink/10 [animation-delay:200ms]"
      >
        {recentJobs.length > 0 && (
          <span className="flex items-center">
            {recentJobs.map((job, i) => (
              <span
                key={job.id}
                className="-ml-2 border-2 border-cream first:ml-0"
                style={{ zIndex: recentJobs.length - i }}
              >
                <CompanyIcon seed={job.company} size={28} />
              </span>
            ))}
          </span>
        )}
        View Experience
        <ArrowRight
          weight="duotone"
          size={16}
          className="transition-transform group-hover:translate-x-1"
        />
      </a>
    </section>
  );
}
