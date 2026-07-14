import Image from "next/image";
import {
  DownloadSimple,
  Envelope,
  LinkedinLogo,
  MapPin,
  Briefcase,
  Globe,
  XLogo,
  GithubLogo,
} from "@phosphor-icons/react/dist/ssr";
import type { PersonalInfo } from "@/types/cv";

export function Sidebar({ info }: { info: PersonalInfo | null }) {
  if (!info) return null;

  return (
    <aside className="-mx-6 flex w-[calc(100%+3rem)] shrink-0 flex-col gap-6 bg-panel px-6 py-8 lg:sticky lg:top-24 lg:mx-0 lg:h-fit lg:w-64 lg:bg-transparent lg:px-0 lg:py-0">
      <div className="h-20 w-20 shrink-0 overflow-hidden transition-transform duration-300 hover:scale-105">
        <Image
          src="/avatar.png"
          alt={info.name}
          width={160}
          height={160}
          className="h-full w-full object-cover"
          priority
        />
      </div>

      <div>
        <h1 className="text-h3 font-normal">{info.name}</h1>
        <p className="text-body-s text-ink/60">{info.role}</p>
      </div>

      <p className="text-body-s text-ink/70">{info.description}</p>

      <div className="flex flex-col gap-2 border-t border-ink/10 pt-4 text-body-s text-ink/70">
        {info.location && (
          <div className="flex items-center gap-2">
            <MapPin weight="duotone" size={16} />
            {info.location}
          </div>
        )}
        <div className="flex items-center gap-2">
          <Briefcase weight="duotone" size={16} />
          3+ years experience
        </div>
        {info.availability && (
          <div className="flex items-center gap-2">
            <Globe weight="duotone" size={16} />
            {info.availability}
          </div>
        )}
      </div>

      <div className="flex items-center gap-4 border-t border-ink/10 pt-4">
        {info.social?.linkedin && (
          <a
            href={info.social.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-ink/50 transition-colors hover:text-accent"
          >
            <LinkedinLogo weight="duotone" size={18} />
          </a>
        )}
        {info.social?.twitter && (
          <a
            href={info.social.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="text-ink/50 transition-colors hover:text-accent"
          >
            <XLogo weight="duotone" size={18} />
          </a>
        )}
        {info.social?.github && (
          <a
            href={info.social.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-ink/50 transition-colors hover:text-accent"
          >
            <GithubLogo weight="duotone" size={18} />
          </a>
        )}
      </div>

      <div className="flex items-center gap-2">
        <a
          href="/resume.pdf"
          className="flex flex-1 items-center justify-center gap-2 bg-ink px-4 py-2.5 text-body-s font-medium text-cream transition-colors hover:bg-accent"
        >
          <DownloadSimple weight="duotone" size={16} />
          Download CV
        </a>
        <a
          href={`mailto:${info.email}`}
          className="flex items-center justify-center bg-ink/5 p-2.5 text-ink transition-colors hover:bg-ink/10"
        >
          <Envelope weight="duotone" size={18} />
        </a>
      </div>
    </aside>
  );
}
