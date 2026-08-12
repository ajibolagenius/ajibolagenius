import type { CSSProperties } from "react";
import Image from "next/image";
import type { PersonalInfo } from "@/types/cv";

/**
 * Above-the-fold, so every animation here is mount-time.
 *
 * `.reveal` (and anything else on an `animation-timeline: view()`) is
 * deliberately not used in this component: Chrome can paint the 0% state of a
 * scroll-driven animation on load, which would flash an empty hero. The
 * `.enter` / `--enter-i` stagger is time-based and safe.
 *
 * Kept deliberately spare — one statement, nothing competing with it. Identity
 * and the derived proof stats both live in the Sidebar, which is on screen at
 * the same time on desktop and stacked directly above this on mobile.
 */
export function Hero({ info }: { info: PersonalInfo | null }) {
  if (!info) return null;

  return (
    <section className="flex flex-col items-center gap-6 py-16 text-center">
      <Image
        src="/illustration-hero.svg"
        alt=""
        width={120}
        height={96}
        className="enter animate-float opacity-90"
      />
      {/* Staggered by token rather than the previous magic 80/140/200ms. */}
      <h2
        className="enter text-h1 font-normal"
        style={{ "--enter-i": 1 } as CSSProperties}
      >
        {info.tagline}
      </h2>
      <span aria-hidden className="rule-draw h-px w-16 bg-accent/40" />
      <p
        className="enter max-w-md text-body-m text-ink/60"
        style={{ "--enter-i": 2 } as CSSProperties}
      >
        {info.tagline_suffix}
      </p>
    </section>
  );
}
