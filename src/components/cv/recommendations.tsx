import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { SectionHeading } from "./section-heading";
import type { Recommendation } from "@/types/cv";

export function Recommendations({ items }: { items: Recommendation[] }) {
  if (items.length === 0) return null;

  return (
    <section className="flex flex-col gap-6 border-t border-ink/10 py-10">
      <SectionHeading id="recommendations">Recommendations</SectionHeading>
      <div className="flex flex-col gap-6">
        {items.map((item) => (
          <div key={item.id} className="flex gap-4">
            <div className="h-9 w-9 shrink-0 rounded-full bg-gradient-to-b from-ink/20 to-ink/5" />
            <div className="flex-1">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-body-m font-medium">{item.name}</p>
                  <p className="text-body-s text-ink/50">{item.role_title}</p>
                </div>
                {item.link_url && (
                  <a
                    href={item.link_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-md bg-ink/5 p-2 text-ink/50 hover:text-ink"
                  >
                    <ArrowUpRight weight="duotone" size={16} />
                  </a>
                )}
              </div>
              <p className="mt-2 text-body-s text-ink/70">{item.quote}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
