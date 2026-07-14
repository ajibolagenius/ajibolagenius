"use client";

import { useState } from "react";
import { ArrowSquareOut, X } from "@phosphor-icons/react/dist/ssr";
import { SectionHeading } from "./section-heading";
import { CompanyIcon } from "@/components/company-icon";
import type { ExperienceEntry } from "@/types/cv";

function JobCard({ entry }: { entry: ExperienceEntry }) {
  return (
    <div className="group flex gap-4 transition-transform duration-200 hover:translate-x-1">
      <CompanyIcon seed={entry.company} />
      <div className="flex flex-1 flex-col gap-1">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h3 className="text-body-l font-medium transition-colors group-hover:text-accent">
            {entry.role_title}
          </h3>
          <span className="text-body-s text-ink/40">
            {entry.start_date} &ndash; {entry.end_date}
          </span>
        </div>
        <p className="text-body-s text-ink/50">
          {entry.company} &middot; {entry.employment_type}
        </p>
        {entry.body && (
          <p className="mt-1 text-body-s text-ink/70">{entry.body}</p>
        )}
        {entry.bullets?.length > 0 && (
          <ul className="mt-1 flex list-disc flex-col gap-1 pl-4 text-body-s text-ink/70">
            {entry.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export function Experience({ entries }: { entries: ExperienceEntry[] }) {
  const [open, setOpen] = useState(false);

  if (entries.length === 0) return null;

  const visible = entries.slice(0, 3);
  const hasMore = entries.length > 3;

  return (
    <section className="flex flex-col gap-6 border-t border-ink/10 py-10">
      <SectionHeading id="experience">Experience</SectionHeading>
      <div className="flex flex-col gap-6">
        {visible.map((entry) => (
          <JobCard key={entry.id} entry={entry} />
        ))}
      </div>

      {hasMore && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex w-fit items-center gap-2 bg-ink/5 px-4 py-2 text-body-s font-medium text-ink transition-colors hover:bg-ink/10"
        >
          View full CV
          <ArrowSquareOut weight="duotone" size={16} />
        </button>
      )}

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/40 p-6 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="my-10 w-full max-w-2xl bg-cream p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-h2 font-normal">Full Experience</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="p-1 text-ink/50 hover:text-ink"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex flex-col gap-8">
              {entries.map((entry) => (
                <JobCard key={entry.id} entry={entry} />
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
