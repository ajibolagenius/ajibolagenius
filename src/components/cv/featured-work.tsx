"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Pause, Play } from "@phosphor-icons/react/dist/ssr";
import { SectionHeading } from "./section-heading";
import type { Project } from "@/types/project";

const REDUCE_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(onStoreChange: () => void) {
  const mq = window.matchMedia(REDUCE_MOTION_QUERY);
  mq.addEventListener("change", onStoreChange);
  return () => mq.removeEventListener("change", onStoreChange);
}

function getReducedMotionSnapshot() {
  return window.matchMedia(REDUCE_MOTION_QUERY).matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );
}

function FeaturedCard({
  project,
  href,
  className,
  sizes,
}: {
  project: Project;
  href: string;
  className?: string;
  sizes: string;
}) {
  return (
    <Link
      href={href}
      className={`group/card flex shrink-0 flex-col overflow-hidden border border-ink/10 bg-cream transition hover:border-ink/30 ${className ?? ""}`}
    >
      <div className="relative aspect-16/10 w-full overflow-hidden bg-ink/5">
        {project.screenshots?.[0] ? (
          <Image
            src={project.screenshots[0]}
            alt={`${project.name} screenshot`}
            fill
            sizes={sizes}
            className="object-cover object-top transition-transform duration-500 group-hover/card:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-body-xs text-ink/30">
            No preview
          </div>
        )}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-linear-to-t from-cream/80 to-transparent opacity-0 transition-opacity duration-300 group-hover/card:opacity-100" />
      </div>
      <div className="flex items-center justify-between gap-2 px-3 py-2.5">
        <div className="min-w-0">
          <p className="truncate text-body-xs uppercase tracking-wide text-ink/60">
            {project.category}
          </p>
          <h3 className="truncate text-body-s font-medium">{project.name}</h3>
        </div>
        <ArrowUpRight
          size={16}
          weight="duotone"
          className="shrink-0 text-ink/60 transition group-hover/card:translate-x-0.5 group-hover/card:-translate-y-0.5 group-hover/card:text-ink"
        />
      </div>
    </Link>
  );
}

function buildMarqueeBase(projects: Project[]) {
  // Need ≥3 cards in one half so three stay on-screen while the track loops.
  let base = [...projects];
  while (base.length > 0 && base.length < 3) {
    base = [...base, ...projects];
  }
  return base;
}

function MarqueeTrack({
  projects,
  linkPrefix,
  reverse,
}: {
  projects: Project[];
  linkPrefix: string;
  reverse: boolean;
}) {
  const base = buildMarqueeBase(projects);
  // Keep perceived speed steady as the featured set grows
  const durationSec = Math.max(28, base.length * 10);

  return (
    <div
      className={`flex w-max ${
        reverse
          ? "animate-featured-marquee-reverse"
          : "animate-featured-marquee"
      }`}
      style={{ animationDuration: `${durationSec}s` }}
    >
      {/* Two identical halves; pr-3 matches gap so -50% lands on a seam */}
      {[0, 1].map((copy) => (
        <div
          key={copy}
          className="flex gap-3 pr-3"
          {...(copy === 1 ? { "aria-hidden": true, inert: true } : {})}
        >
          {base.map((project, i) => (
            <FeaturedCard
              key={`${copy}-${project.id}-${i}`}
              project={project}
              href={`${linkPrefix}/${project.slug}`}
              className="w-[calc((100cqi-1.5rem)/3)]"
              sizes="(max-width: 640px) 85vw, 240px"
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function MobileCarousel({
  projects,
  linkPrefix,
}: {
  projects: Project[];
  linkPrefix: string;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduceMotion = usePrefersReducedMotion();

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const onScroll = () => {
      const cards = Array.from(el.children) as HTMLElement[];
      if (cards.length === 0) return;
      const mid = el.scrollLeft + el.clientWidth / 2;
      let best = 0;
      let bestDist = Infinity;
      cards.forEach((card, i) => {
        const center = card.offsetLeft + card.offsetWidth / 2;
        const dist = Math.abs(center - mid);
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      });
      setActive(best);
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [projects]);

  const scrollToIndex = (index: number, behavior: ScrollBehavior = "smooth") => {
    const el = scrollerRef.current;
    const card = el?.children[index] as HTMLElement | undefined;
    if (!el || !card) return;
    const left = card.offsetLeft - (el.clientWidth - card.offsetWidth) / 2;
    el.scrollTo({ left, behavior });
  };

  useEffect(() => {
    if (reduceMotion || paused || projects.length <= 1) return;

    const id = window.setInterval(() => {
      scrollToIndex((active + 1) % projects.length);
    }, 3200);

    return () => window.clearInterval(id);
  }, [active, paused, projects.length, reduceMotion]);

  return (
    <div
      className="relative sm:hidden"
      onPointerDown={() => setPaused(true)}
      onPointerUp={() => setPaused(false)}
      onPointerLeave={() => setPaused(false)}
    >
      <div
        ref={scrollerRef}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {projects.map((project) => (
          <FeaturedCard
            key={project.id}
            project={project}
            href={`${linkPrefix}/${project.slug}`}
            className="w-[min(85%,20rem)] snap-center"
            sizes="85vw"
          />
        ))}
      </div>

      {projects.length > 1 && (
        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            {projects.map((project, i) => (
              <button
                key={project.id}
                type="button"
                aria-label={`Go to ${project.name}`}
                onClick={() => scrollToIndex(i)}
                className={`h-1.5 transition-all ${
                  i === active
                    ? "w-5 bg-accent"
                    : "w-1.5 bg-ink/20 hover:bg-ink/40"
                }`}
              />
            ))}
          </div>
          <p className="font-mono text-body-xs tabular-nums text-ink/40">
            {String(active + 1).padStart(2, "0")}
            <span className="text-ink/20"> / </span>
            {String(projects.length).padStart(2, "0")}
          </p>
        </div>
      )}
    </div>
  );
}

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
  const [hovered, setHovered] = useState(false);
  const reduceMotion = usePrefersReducedMotion();

  if (!hasClient && !hasSide) return null;

  const currentProjects = activeTab === "client" ? projects : sideProjects;
  const viewAllLink = activeTab === "client" ? "/work" : "/side-projects";
  const viewAllText =
    activeTab === "client" ? "View all work" : "View all side projects";
  const projectLinkPrefix = activeTab === "client" ? "/work" : "/side-projects";
  const canMarquee = !reduceMotion && currentProjects.length > 0;

  return (
    <section className="flex flex-col gap-6 border-t border-ink/10 py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-4">
          <SectionHeading id="work">Featured work</SectionHeading>

          {hasClient && hasSide && (
            <div className="inline-flex border border-ink/10 p-0.5 font-mono text-body-xs">
              <button
                type="button"
                onClick={() => setActiveTab("client")}
                className={`px-2.5 py-1 transition-colors ${
                  activeTab === "client"
                    ? "bg-ink text-cream"
                    : "text-ink/60 hover:bg-ink/5 hover:text-ink"
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
                    : "text-ink/60 hover:bg-ink/5 hover:text-ink"
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

      {/* Desktop / tablet: infinite 3-up marquee, clipped to content column */}
      {canMarquee ? (
        <div
          className="@container relative hidden overflow-hidden sm:block"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onFocusCapture={() => setHovered(true)}
          onBlurCapture={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
              setHovered(false);
            }
          }}
        >
          {/* Soft edge masks — keeps motion inside the red-line width */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-linear-to-r from-cream to-transparent"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-linear-to-l from-cream to-transparent"
          />

          <div
            className={`featured-marquee-host ${hovered ? "is-paused" : ""}`}
          >
            <MarqueeTrack
              key={activeTab}
              projects={currentProjects}
              linkPrefix={projectLinkPrefix}
              reverse={activeTab === "side"}
            />
          </div>

          <div className="mt-3 flex items-center justify-between gap-3">
            <p className="font-mono text-body-xs uppercase tracking-[0.18em] text-ink/35">
              {activeTab === "client" ? "Client reel" : "Side reel"}
              <span className="mx-2 text-ink/15">·</span>
              {currentProjects.length} featured
            </p>
            <span className="inline-flex items-center gap-1.5 font-mono text-body-xs text-ink/35">
              {hovered ? (
                <>
                  <Pause size={12} weight="fill" className="text-accent" />
                  Paused
                </>
              ) : (
                <>
                  <Play size={12} weight="fill" className="text-ink/30" />
                  Auto
                </>
              )}
            </span>
          </div>
        </div>
      ) : (
        <div className="hidden gap-3 sm:grid sm:grid-cols-3">
          {currentProjects.slice(0, 3).map((project) => (
            <FeaturedCard
              key={project.id}
              project={project}
              href={`${projectLinkPrefix}/${project.slug}`}
              sizes="(max-width: 640px) 100vw, 33vw"
            />
          ))}
        </div>
      )}

      {/* Mobile: peek snap strip — one focus card + next peek */}
      <MobileCarousel
        key={activeTab}
        projects={currentProjects}
        linkPrefix={projectLinkPrefix}
      />
    </section>
  );
}
