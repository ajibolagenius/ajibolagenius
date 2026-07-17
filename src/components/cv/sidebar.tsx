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
import { EdgeMarquee } from "@/components/cv/edge-marquee";

export function Sidebar({ info }: { info: PersonalInfo | null }) {
    if (!info) return null;

    const marqueeItems = [
        info.role,
        info.location ? `Based in ${info.location}` : null,
        info.availability,
        info.tagline,
    ].filter((item): item is string => Boolean(item));

    return (
        <>
        <aside className="flex w-full shrink-0 flex-col gap-6 bg-panel px-6 py-8 lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:h-screen lg:w-80 lg:gap-8 lg:overflow-y-auto lg:border-r lg:border-ink/10 lg:px-8 lg:py-10">
            <div className="flex flex-col gap-6 md:flex-row md:items-start lg:flex-col">
                <div className="h-20 w-20 shrink-0 overflow-hidden transition-transform duration-300 hover:scale-105">
                    <Image
                        src={info.avatar_url || "/avatar_3d.png"}
                        alt={info.name}
                        width={160}
                        height={160}
                        className="h-full w-full object-cover"
                        priority
                    />
                </div>

                <div className="flex flex-col gap-3 md:gap-2 lg:gap-3">
                    <div>
                        <h1 className="text-h3 font-normal">{info.name}</h1>
                        <p className="text-body-s text-ink/60">{info.role}</p>
                    </div>
                    <p className="text-body-s text-ink/70 md:max-w-md lg:max-w-none">
                        {info.description}
                    </p>
                </div>
            </div>

            <div className="flex flex-col gap-2 border-t border-ink/10 pt-4 text-body-s text-ink/70 md:flex-row md:flex-wrap md:gap-6 lg:flex-col lg:gap-2">
                {info.location && (
                    <div className="flex items-center gap-2">
                        <MapPin weight="duotone" size={16} />
                        {info.location}
                    </div>
                )}
                <div className="flex items-center gap-2">
                    <Briefcase weight="duotone" size={16} />
                    5+ years experience
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
                        className="text-ink/60 transition-colors hover:text-accent"
                    >
                        <LinkedinLogo weight="duotone" size={18} />
                    </a>
                )}
                {info.social?.twitter && (
                    <a
                        href={info.social.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-ink/60 transition-colors hover:text-accent"
                    >
                        <XLogo weight="duotone" size={18} />
                    </a>
                )}
                {info.social?.github && (
                    <a
                        href={info.social.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-ink/60 transition-colors hover:text-accent"
                    >
                        <GithubLogo weight="duotone" size={18} />
                    </a>
                )}
            </div>

            <div className="flex items-center gap-2 lg:mt-auto lg:pt-6">
                <a
                    href="/cv"
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
        <EdgeMarquee items={marqueeItems} />
        </>
    );
}
