import { Suspense } from "react";
import { getLatestGitHubActivity } from "@/lib/github-activity";
import { HeroIntro } from "@/components/cv/hero-intro";
import { HeroStatusLine } from "@/components/cv/hero-status-line";
import type { SidebarStats } from "@/lib/sidebar-stats";
import type { ExperienceEntry, PersonalInfo } from "@/types/cv";

async function HeroStatus({ github }: { github?: string | null }) {
  const activity = await getLatestGitHubActivity(github);
  return <HeroStatusLine initialActivity={activity} />;
}

/**
 * Above the fold, so nothing here uses `.reveal` (Chrome can paint the 0%
 * state of a scroll-driven animation on load) — only the time-based `.enter`
 * stagger inside HeroIntro.
 *
 * The status line is streamed behind a boundary so the GitHub request can
 * never delay the name and statement. Its fallback is the same line without
 * the commit, so nothing shifts when it resolves.
 */
export function Hero({
  info,
  current,
  stats,
}: {
  info: PersonalInfo | null;
  /** Roles whose end date is "Present", in display order. */
  current: ExperienceEntry[];
  stats: SidebarStats;
}) {
  if (!info) return null;

  return (
    <HeroIntro
      info={info}
      current={current}
      stats={stats}
      status={
        <Suspense fallback={<HeroStatusLine initialActivity={null} />}>
          <HeroStatus github={info.social?.github} />
        </Suspense>
      }
    />
  );
}
