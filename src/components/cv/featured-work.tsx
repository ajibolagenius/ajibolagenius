"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { HomeSection } from "@/components/cv/home-section";
import { projectHref } from "@/lib/project-kind";
import { useLanguage } from "@/lib/i18n";
import type { Project } from "@/types/project";

/** Hostname for the frame's address bar, or null for "#" and other non-URLs. */
function hostOf(url?: string | null) {
  try {
    const { protocol, hostname } = new URL(url ?? "");
    return protocol.startsWith("http") ? hostname.replace(/^www\./, "") : null;
  } catch {
    return null;
  }
}

/** The slide shows the opening sentence; the case-study page has the rest. */
function firstSentence(text?: string | null) {
  if (!text) return "";
  return text.match(/^[\s\S]*?[.!?](?=\s|$)/)?.[0] ?? text;
}

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * One case study at a time, crossfading every 7s.
 *
 * The timer is the active dot's CSS fill animation: when it ends, the next
 * slide shows. Hovering or focusing a slide pauses it (CSS, see globals.css),
 * as does the pause button, and prefers-reduced-motion removes the animation
 * — so the slides only ever change when the visitor asks.
 *
 * Slides share one grid cell, so the section is as tall as its tallest slide
 * and the page never jumps on a change. Hidden slides are `inert`.
 */
export function FeaturedWork({
  projects,
  total,
}: {
  projects: Project[];
  total: number | null;
}) {
  const { t } = useLanguage();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const count = projects.length;
  if (count === 0) return null;

  const go = (n: number) => setIndex((n + count) % count);

  return (
    <HomeSection
      id="featured-work"
      label={t.labels.work}
      sub={
        total
          ? t.labels.shownOf
              .replace("{shown}", String(count))
              .replace("{total}", String(total))
          : undefined
      }
    >
      <div
        className="work-slider"
        data-paused={paused}
        role="region"
        aria-roledescription="carousel"
        aria-label={t.labels.work}
      >
        <div className="work-slides grid grid-cols-1">
          {projects.map((project, k) => {
            const host = hostOf(project.live_url);
            const github = hostOf(project.github_url) ? project.github_url : null;
            const status = t.work.status[project.status];
            const facts = [
              [t.work.problem, firstSentence(project.problem || project.description)],
              [t.work.decision, firstSentence(project.solution)],
              [t.work.result, project.outcome],
            ].filter(([, value]) => value);

            return (
              <article
                key={project.id}
                data-active={k === index}
                inert={k !== index}
                aria-roledescription="slide"
                aria-label={`${k + 1} / ${count}`}
                className="work-slide grid gap-5 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:gap-8"
              >
                <figure className="m-0 self-start border border-ink/10 bg-panel">
                  <div className="flex items-center gap-1.5 border-b border-ink/10 px-3 py-2 font-mono text-[11px] text-ink/50">
                    <span className="size-[7px] rounded-full bg-ink/15" />
                    <span className="size-[7px] rounded-full bg-ink/15" />
                    <span className="size-[7px] rounded-full bg-ink/15" />
                    <span className="mx-auto truncate">{host ?? project.category}</span>
                  </div>
                  <div className="relative aspect-16/10 overflow-hidden">
                    {project.screenshots?.[0] ? (
                      <Image
                        src={project.screenshots[0]}
                        alt={`${project.name} screenshot`}
                        fill
                        sizes="(min-width: 1024px) 460px, 100vw"
                        priority={k === 0}
                        className="object-cover object-top"
                      />
                    ) : (
                      <div className="grid h-full place-items-center text-body-xs text-ink/30">
                        {t.work.noPreview}
                      </div>
                    )}
                  </div>
                </figure>

                <div className="flex min-w-0 flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <h3 className="font-display text-[clamp(1.625rem,3.2vw,2.125rem)] font-normal leading-tight text-balance">
                      <Link
                        href={projectHref(project)}
                        className="transition-colors duration-[var(--dur-2)] hover:text-accent"
                      >
                        {project.name}
                      </Link>
                    </h3>
                    <p className="flex flex-wrap gap-x-3.5 gap-y-1 font-mono text-body-xs text-ink/55">
                      {project.role_title && <span>{project.role_title}</span>}
                      {(project.duration || project.year) && (
                        <span>
                          {[project.duration, project.year].filter(Boolean).join(" · ")}
                        </span>
                      )}
                      {status && <span className="text-accent">{status}</span>}
                    </p>
                  </div>

                  {facts.length > 0 && (
                    <dl className="border-t border-ink/10">
                      {facts.map(([term, value]) => (
                        <div key={term} className="grid gap-0.5 border-b border-ink/10 py-3">
                          <dt className="font-mono text-body-xs text-ink/50">{term}</dt>
                          <dd className="text-body-s leading-relaxed">{value}</dd>
                        </div>
                      ))}
                    </dl>
                  )}

                  <p className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-body-xs">
                    <Link
                      href={projectHref(project)}
                      className="text-accent underline decoration-accent/30 underline-offset-4 hover:decoration-accent"
                    >
                      {t.work.caseStudy} →
                    </Link>
                    {host && (
                      <a
                        href={project.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline decoration-ink/20 underline-offset-4 hover:decoration-accent"
                      >
                        {host} ↗
                      </a>
                    )}
                    {github && (
                      <a
                        href={github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline decoration-ink/20 underline-offset-4 hover:decoration-accent"
                      >
                        GitHub ↗
                      </a>
                    )}
                  </p>
                </div>
              </article>
            );
          })}
        </div>

        {count > 1 && (
          <div className="work-ctrl mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 font-mono text-body-xs">
            <div className="flex gap-2">
              {(
                [
                  [t.work.previous, "←", -1],
                  [t.work.next, "→", 1],
                ] as const
              ).map(([label, glyph, step]) => (
                <button
                  key={label}
                  type="button"
                  aria-label={label}
                  onClick={() => go(index + step)}
                  className="grid size-8 place-items-center border border-ink/15 transition-colors duration-[var(--dur-2)] hover:border-accent hover:text-accent"
                >
                  {glyph}
                </button>
              ))}
            </div>

            <ol className="flex gap-1.5">
              {projects.map((project, k) => (
                <li key={project.id}>
                  <button
                    type="button"
                    aria-label={`${t.work.goTo} ${project.name}`}
                    aria-current={k === index}
                    onClick={() => go(k)}
                    className="relative block h-5 w-10"
                  >
                    <span className="absolute inset-x-0 top-[9px] h-0.5 bg-ink/15" />
                    {k === index && (
                      <span
                        onAnimationEnd={() => go(index + 1)}
                        className="work-fill absolute inset-x-0 top-[9px] h-0.5 origin-left bg-accent"
                      />
                    )}
                  </button>
                </li>
              ))}
            </ol>

            <button
              type="button"
              aria-pressed={paused}
              onClick={() => setPaused((p) => !p)}
              className="text-ink/55 transition-colors hover:text-ink motion-reduce:hidden"
            >
              {paused ? t.work.play : t.work.pause}
            </button>

            <span className="ml-auto tabular-nums text-ink/50">
              {pad(index + 1)} / {pad(count)}
            </span>
          </div>
        )}
      </div>

      {total ? (
        <Link
          href="/projects"
          className="mt-12 inline-block text-body-s underline decoration-ink/20 underline-offset-4 transition-colors hover:decoration-accent"
        >
          {t.work.allProjects.replace("{count}", String(total))} →
        </Link>
      ) : null}
    </HomeSection>
  );
}
