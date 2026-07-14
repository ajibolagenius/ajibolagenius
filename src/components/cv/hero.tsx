import Image from "next/image";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import type { PersonalInfo } from "@/types/cv";

export function Hero({ info }: { info: PersonalInfo | null }) {
  if (!info) return null;

  return (
    <section className="flex flex-col items-center gap-6 py-16 text-center">
      <Image
        src="/illustration-hero.svg"
        alt=""
        width={120}
        height={90}
        className="opacity-90"
      />
      <h2 className="text-h1 font-normal">{info.tagline}</h2>
      <p className="max-w-md text-body-m text-ink/60">
        {info.tagline_suffix}
      </p>
      <a
        href="#experience"
        className="inline-flex items-center gap-2 rounded-full bg-ink/5 px-5 py-2.5 text-body-s font-medium text-ink"
      >
        View Experience
        <ArrowRight weight="duotone" size={16} />
      </a>
    </section>
  );
}
