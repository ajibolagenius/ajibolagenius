import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { SectionHeading } from "./section-heading";
import { CompanyIcon } from "@/components/company-icon";
import type { Certification } from "@/types/cv";

interface CertificationWithMeta extends Certification {
  issuer?: string;
  issued_date?: string;
  link_url?: string | null;
}

export function Certifications({
  entries,
}: {
  entries: CertificationWithMeta[];
}) {
  if (entries.length === 0) return null;

  return (
    <section className="flex flex-col gap-6 border-t border-ink/10 py-10">
      <SectionHeading id="certifications">Certifications</SectionHeading>
      <div className="flex flex-col gap-4">
        {entries.map((cert) => (
          <div key={cert.id} className="flex items-center gap-4">
            <CompanyIcon seed={cert.title} size={28} />
            <div className="flex-1">
              <p className="text-body-m font-medium">{cert.title}</p>
              <p className="text-body-s text-ink/60">
                {cert.issuer} {cert.issuer && cert.issued_date && "·"}{" "}
                {cert.issued_date}
              </p>
            </div>
            {cert.link_url && (
              <a
                href={cert.link_url}
                target="_blank"
                rel="noopener noreferrer"
                className=" bg-ink/5 p-2 text-ink/60 hover:text-ink"
              >
                <ArrowUpRight weight="duotone" size={16} />
              </a>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
