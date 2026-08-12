import type { CSSProperties } from "react";
import Image from "next/image";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { CompanyIcon } from "@/components/company-icon";
import { assignCompanyIcons } from "@/lib/company-icon";
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
  const iconStyles = assignCompanyIcons(recentJobs.map((j) => j.company));

  return (
    <section className="flex flex-col items-center gap-6 py-16 text-center">
      <Image
        src="/illustration-hero.svg"
        alt=""
        width={120}
        height={96}
        className="enter animate-float opacity-90"
      />
      {/* Staggered by token rather than the previous magic 80/140/200ms. */}
      <h2
        className="enter text-h1 font-normal"
        style={{ "--enter-i": 1 } as CSSProperties}
      >
        {info.tagline}
      </h2>
      <span
        aria-hidden
        className="rule-draw h-px w-16 bg-accent/40"
      />
      <p
        className="enter max-w-md text-body-m text-ink/60"
        style={{ "--enter-i": 2 } as CSSProperties}
      >
        {info.tagline_suffix}
      </p>
      <a
        href="#experience"
        className="enter group inline-flex items-center gap-3 bg-ink/5 py-2 pl-2 pr-5 text-body-s font-medium text-ink transition-colors duration-[var(--dur-2)] hover:bg-ink/10"
        style={{ "--enter-i": 3 } as CSSProperties}
      >
        {recentJobs.length > 0 && (
          <span className="flex items-center">
            {recentJobs.map((job, i) => (
              <span
                key={job.id}
                className="-ml-2 border-2 border-cream first:ml-0"
                style={{ zIndex: recentJobs.length - i }}
              >
                <CompanyIcon
                  seed={job.company}
                  size={28}
                  style={iconStyles.get(job.company)}
                />
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
