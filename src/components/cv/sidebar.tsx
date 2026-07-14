import {
  DownloadSimple,
  Envelope,
  LinkedinLogo,
  MapPin,
  Briefcase,
  Globe,
  XLogo,
} from "@phosphor-icons/react/dist/ssr";
import type { PersonalInfo } from "@/types/cv";

export function Sidebar({ info }: { info: PersonalInfo | null }) {
  if (!info) return null;

  return (
    <aside className="flex w-full flex-col gap-6 sm:w-64 sm:shrink-0">
      <div className="h-20 w-20 overflow-hidden rounded-xl bg-gradient-to-b from-sky-300 to-fuchsia-400" />

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

      <div className="flex items-center gap-3 border-t border-ink/10 pt-4">
        {info.social?.linkedin && (
          <a
            href={info.social.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-ink/50 hover:text-ink"
          >
            <LinkedinLogo weight="duotone" size={18} />
          </a>
        )}
        {info.social?.twitter && (
          <a
            href={info.social.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="text-ink/50 hover:text-ink"
          >
            <XLogo weight="duotone" size={18} />
          </a>
        )}
      </div>

      <div className="flex items-center gap-2">
        <a
          href="/resume.pdf"
          className="flex flex-1 items-center justify-center gap-2 rounded-md bg-ink px-4 py-2.5 text-body-s font-medium text-cream"
        >
          <DownloadSimple weight="duotone" size={16} />
          Download CV
        </a>
        <a
          href={`mailto:${info.email}`}
          className="flex items-center justify-center rounded-md bg-ink/5 p-2.5 text-ink"
        >
          <Envelope weight="duotone" size={18} />
        </a>
      </div>
    </aside>
  );
}
