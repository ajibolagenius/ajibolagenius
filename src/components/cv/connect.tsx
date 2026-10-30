"use client";

import { useState } from "react";
import { ContactForm } from "@/components/cv/contact-form";
import { HomeSection } from "@/components/cv/home-section";
import { useLanguage } from "@/lib/i18n";
import type { PersonalInfo } from "@/types/cv";

const link =
  "underline decoration-accent/40 underline-offset-[0.2em] transition-colors hover:decoration-accent";

export function Connect({ info }: { info: PersonalInfo | null }) {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);
  if (!info) return null;

  const socials = [
    ["GitHub", info.social?.github],
    ["LinkedIn", info.social?.linkedin],
    ["X", info.social?.twitter],
  ].filter((s): s is [string, string] => Boolean(s[1]));

  const copy = () => {
    navigator.clipboard
      .writeText(info.email)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1600);
      })
      // Clipboard refused: the address is `select-all`, one click selects it.
      .catch(() => {});
  };

  return (
    <HomeSection
      id="connect"
      label={t.labels.contact}
      sub={
        <span className="inline-flex items-center gap-2 text-ink">
          <span aria-hidden className="size-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
          {t.labels.available}
        </span>
      }
    >
      {/* Desktop: the invitation on the left, the form beside it. */}
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-14">
        <div>
          <p className="max-w-[24ch] font-display text-[clamp(1.625rem,3.2vw,2.25rem)] leading-[1.3] text-pretty">
            {t.connect.writeTo}{" "}
            <a href={`mailto:${info.email}`} className={link}>
              {t.connect.myEmail}
            </a>
            {socials.length > 0 && (
              <>
                , {t.connect.findMe}{" "}
                {socials.map(([label, href], i) => (
                  <span key={label}>
                    {i > 0 && (i === socials.length - 1 ? ` ${t.connect.and} ` : ", ")}
                    <a href={href} target="_blank" rel="noopener noreferrer" className={link}>
                      {label}
                    </a>
                  </span>
                ))}
              </>
            )}
            .
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2.5 font-mono text-body-xs">
            <span className="select-all">{info.email}</span>
            <button
              type="button"
              onClick={copy}
              className="border border-ink/15 px-2.5 py-1.5 transition-colors duration-[var(--dur-2)] hover:border-accent hover:text-accent"
            >
              {copied ? t.connect.copied : t.connect.copy}
            </button>
            {info.social?.whatsapp && (
              <a
                href={info.social.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink/55 underline decoration-ink/20 underline-offset-4 hover:decoration-accent"
              >
                {t.connect.orWhatsApp}
                {info.phone ? ` ${info.phone}` : ""}
              </a>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <p className="font-mono text-body-xs text-ink/50">{t.connect.orMessage}</p>
          <ContactForm />
        </div>
      </div>
    </HomeSection>
  );
}
