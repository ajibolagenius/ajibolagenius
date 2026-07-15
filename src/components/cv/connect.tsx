import Image from "next/image";
import {
  Envelope,
  Phone,
  LinkedinLogo,
  XLogo,
  GithubLogo,
} from "@phosphor-icons/react/dist/ssr";
import type { PersonalInfo } from "@/types/cv";
import { ContactForm } from "@/components/cv/contact-form";

export function Connect({ info }: { info: PersonalInfo | null }) {
  if (!info) return null;

  return (
    <section
      id="connect"
      className="flex scroll-mt-24 flex-col items-center gap-8 border-t border-ink/10 py-16 text-center"
    >
      <div>
        <h2 className="text-h1 font-normal">Let&apos;s Connect</h2>
        <p className="mt-2 text-body-m text-ink/60">
          Currently available for full-time roles, freelance work, and
          collaborations.
        </p>
      </div>

      <div className="flex w-full max-w-md flex-col gap-3 sm:flex-row">
        <a
          href={`mailto:${info.email}`}
          className="flex flex-1 items-center gap-3  bg-ink/5 px-4 py-3 text-left"
        >
          <Envelope weight="duotone" size={18} />
          <div>
            <p className="text-body-s font-medium">Email Me</p>
            <p className="text-body-xs text-ink/50">{info.email}</p>
          </div>
        </a>
        {info.social?.whatsapp && (
          <a
            href={info.social.whatsapp}
            className="flex flex-1 items-center gap-3  bg-ink/5 px-4 py-3 text-left"
          >
            <Phone weight="duotone" size={18} />
            <div>
              <p className="text-body-s font-medium">Call Me</p>
              <p className="text-body-xs text-ink/50">WhatsApp</p>
            </div>
          </a>
        )}
      </div>

      <ContactForm />

      <div>
        <p className="text-body-s text-ink/50">Join my network:</p>
        <div className="mt-2 flex items-center justify-center gap-3">
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
          {info.social?.github && (
            <a
              href={info.social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink/50 hover:text-ink"
            >
              <GithubLogo weight="duotone" size={18} />
            </a>
          )}
        </div>
      </div>

      <Image
        src="/illustration-connect.svg"
        alt=""
        width={160}
        height={120}
        className="opacity-90"
      />
    </section>
  );
}
