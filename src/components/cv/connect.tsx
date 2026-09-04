"use client";

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
import { SectionHeading } from "@/components/cv/section-heading";
import { useLanguage } from "@/lib/i18n";

export function Connect({ info }: { info: PersonalInfo | null }) {
  const { t } = useLanguage();
  if (!info) return null;

  return (
    <section className="flex flex-col items-center gap-8 border-t border-ink/10 py-16 text-center">
      <div>
        <SectionHeading id="connect">Let&apos;s Connect</SectionHeading>
        <p className="mt-2 text-body-m text-ink/60">{t.connect.availability}</p>
      </div>

      <div className="flex w-full max-w-md flex-col gap-3 sm:flex-row">
        <a
          href={`mailto:${info.email}`}
          className="flex flex-1 items-center gap-3  bg-ink/5 px-4 py-3 text-left"
        >
          <Envelope weight="duotone" size={18} />
          <div>
            <p className="text-body-s font-medium">{t.connect.emailMe}</p>
            <p className="text-body-xs text-ink/60">{info.email}</p>
          </div>
        </a>
        {info.social?.whatsapp && (
          <a
            href={info.social.whatsapp}
            className="flex flex-1 items-center gap-3  bg-ink/5 px-4 py-3 text-left"
          >
            <Phone weight="duotone" size={18} />
            <div>
              <p className="text-body-s font-medium">{t.connect.callMe}</p>
              <p className="text-body-xs text-ink/60">WhatsApp</p>
            </div>
          </a>
        )}
      </div>

      <ContactForm />

      <div>
        <p className="text-body-s text-ink/60">{t.connect.joinNetwork}</p>
        <div className="mt-2 flex items-center justify-center gap-3">
          {info.social?.linkedin && (
            <a
              href={info.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink/60 hover:text-ink"
            >
              <LinkedinLogo weight="duotone" size={18} />
            </a>
          )}
          {info.social?.twitter && (
            <a
              href={info.social.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink/60 hover:text-ink"
            >
              <XLogo weight="duotone" size={18} />
            </a>
          )}
          {info.social?.github && (
            <a
              href={info.social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink/60 hover:text-ink"
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
        height={160}
        className="opacity-90"
      />
    </section>
  );
}
