"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { SectionHeading } from "./section-heading";
import type { Project } from "@/types/project";

const MAX_FEATURED = 3;

export function FeaturedWork({
  projects,
  sideProjects = [],
}: {
  projects: Project[];
  sideProjects?: Project[];
}) {
  const hasClient = projects.length > 0;
  const hasSide = sideProjects.length > 0;

  const [activeTab, setActiveTab] = useState<"client" | "side">(
    hasClient ? "client" : "side"
  );

  if (!hasClient && !hasSide) return null;

  const currentProjects = activeTab === "client" ? projects : sideProjects;
  const viewAllLink = activeTab === "client" ? "/work" : "/side-projects";
  const viewAllText = activeTab === "client" ? "View all work" : "View all side projects";
  const projectLinkPrefix = activeTab === "client" ? "/work" : "/side-projects";

  return (
    <section className="flex flex-col gap-6 border-t border-ink/10 py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <SectionHeading id="work">Featured work</SectionHeading>
          
          {hasClient && hasSide && (
            <div className="inline-flex border border-ink/10 p-0.5 font-mono text-body-xs">
              <button
                type="button"
                onClick={() => setActiveTab("client")}
                className={`px-2.5 py-1 transition-colors ${
                  activeTab === "client"
                    ? "bg-ink text-cream"
                    : "text-ink/60 hover:text-ink hover:bg-ink/5"
                }`}
              >
                Client
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("side")}
                className={`px-2.5 py-1 transition-colors ${
                  activeTab === "side"
                    ? "bg-ink text-cream"
                    : "text-ink/60 hover:text-ink hover:bg-ink/5"
                }`}
              >
                Side Projects
              </button>
            </div>
          )}
        </div>

        <Link
          href={viewAllLink}
          className="group inline-flex shrink-0 items-center gap-1 text-body-s font-medium text-ink/60 transition-colors hover:text-accent"
        >
          {viewAllText}
          <ArrowUpRight
            size={16}
            weight="duotone"
            className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </Link>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {currentProjects.slice(0, MAX_FEATURED).map((project) => (
          <Link
            key={project.id}
            href={`${projectLinkPrefix}/${project.slug}`}
            className="group flex flex-col overflow-hidden border border-ink/10 transition hover:border-ink/30"
          >
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-ink/5">
              {project.screenshots?.[0] ? (
                <Image
                  src={project.screenshots[0]}
                  alt={`${project.name} screenshot`}
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="object-cover object-top transition-transform duration-300 group-hover:scale-[1.03]"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-body-xs text-ink/30">
                  No preview
                </div>
              )}
            </div>
            <div className="flex items-center justify-between gap-2 px-3 py-2.5">
              <div className="min-w-0">
                <p className="truncate text-body-xs uppercase tracking-wide text-ink/60">
                  {project.category}
                </p>
                <h3 className="truncate text-body-s font-medium">
                  {project.name}
                </h3>
              </div>
              <ArrowUpRight
                size={16}
                weight="duotone"
                className="shrink-0 text-ink/60 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-ink"
              />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
