import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { SectionHeading } from "./section-heading";
import { CompanyIcon } from "@/components/company-icon";
import type { Certification } from "@/types/cv";

export function Certifications({ entries }: { entries: Certification[] }) {
  if (entries.length === 0) return null;

  return (
    <section className="reveal flex flex-col gap-6 border-t border-ink/10 py-10">
      <SectionHeading id="certifications">Certifications</SectionHeading>
      <div className="flex flex-col gap-4">
        {entries.map((cert) => {
          // Joined rather than interpolated: both columns default to '' and
          // every row currently has an empty issued_date, which the old
          // inline version rendered as a stray separator and dangling spaces.
          const meta = [cert.issuer, cert.issued_date]
            .filter(Boolean)
            .join(" · ");

          return (
            <div key={cert.id} className="flex items-center gap-4">
              <CompanyIcon seed={cert.title} size={28} />
              <div className="flex-1">
                <p className="text-body-m font-medium">{cert.title}</p>
                {meta && <p className="text-body-s text-ink/60">{meta}</p>}
              </div>
              {cert.link_url && (
                <a
                  href={cert.link_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`View ${cert.title} certificate`}
                  className="bg-ink/5 p-2 text-ink/60 transition-colors duration-[var(--dur-2)] hover:text-ink"
                >
                  <ArrowUpRight weight="duotone" size={16} />
                </a>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
