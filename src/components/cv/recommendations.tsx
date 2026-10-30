"use client";

import Image from "next/image";
import { HomeSection } from "@/components/cv/home-section";
import { useLanguage } from "@/lib/i18n";
import type { Recommendation } from "@/types/cv";

const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

/** Pull quotes from the `recommendations` table; renders nothing while it is empty. */
export function Recommendations({ items }: { items: Recommendation[] }) {
  const { t } = useLanguage();
  if (items.length === 0) return null;

  return (
    <HomeSection id="recommendations" label={t.labels.kindWords}>
      <div className="flex flex-col gap-14">
        {items.map((item) => (
          <figure key={item.id} className="m-0 flex flex-col gap-5">
            <blockquote className="relative max-w-[30ch] font-display text-[clamp(1.375rem,2.8vw,1.875rem)] leading-[1.4] text-pretty lg:before:absolute lg:before:-left-[0.55em] lg:before:text-accent lg:before:content-['“']">
              {item.quote}
            </blockquote>
            <figcaption className="flex items-center gap-3 font-mono text-body-xs text-ink/55">
              {item.avatar_url ? (
                <Image
                  src={item.avatar_url}
                  alt=""
                  width={36}
                  height={36}
                  className="size-9 object-cover"
                />
              ) : (
                <span className="grid size-9 place-items-center border border-ink/10 bg-panel text-ink">
                  {initials(item.name)}
                </span>
              )}
              <span>
                {item.link_url ? (
                  <a
                    href={item.link_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block font-medium text-ink underline decoration-ink/20 underline-offset-4 hover:decoration-accent"
                  >
                    {item.name}
                  </a>
                ) : (
                  <span className="block font-medium text-ink">{item.name}</span>
                )}
                {item.role_title}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </HomeSection>
  );
}
