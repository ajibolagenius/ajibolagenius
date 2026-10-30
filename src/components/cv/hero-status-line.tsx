"use client";

import { Pause, Play } from "@phosphor-icons/react/dist/ssr";
import { LiveClock } from "@/components/live-clock";
import { NowLiveCommit } from "@/components/cv/now-live-commit";
import { useRadioControls } from "@/components/vintage-radio";
import { useLanguage } from "@/lib/i18n";
import type { GitHubActivity } from "@/lib/github-activity";

/**
 * "13:19 WAT in Lagos / last commit 58m ago on EduPoint / ▶ Fantastic Man"
 *
 * The radio control lives here on the homepage. It plays only when pressed;
 * nothing on the page starts audio on scroll or on an unrelated click.
 * Separators are drawn by the parent so a missing item (no recent commit)
 * never leaves a dangling slash.
 */
export function HeroStatusLine({
  initialActivity,
}: {
  initialActivity: GitHubActivity | null;
}) {
  const { t } = useLanguage();
  const {
    currentTrack,
    isPlaying,
    isEnabled,
    handleTogglePlay,
    handleTurnOn,
  } = useRadioControls();

  const label = (isPlaying ? t.hero.pauseTrack : t.hero.playTrack)
    .replace("{title}", currentTrack.title)
    .replace("{artist}", currentTrack.artist);

  return (
    <div className="flex flex-wrap items-center gap-x-3.5 gap-y-2 font-mono text-body-xs text-ink/55 [&>*+*]:before:mr-3.5 [&>*+*]:before:text-ink/20 [&>*+*]:before:content-['/']">
      <span className="inline-flex items-center">
        <span
          aria-hidden
          className="mr-2 inline-block size-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400"
        />
        <LiveClock />
        &nbsp;{t.hero.inLagos}
      </span>

      <NowLiveCommit initialActivity={initialActivity} />

      <button
        type="button"
        onClick={isEnabled ? handleTogglePlay : handleTurnOn}
        aria-pressed={isPlaying}
        aria-label={label}
        className="group inline-flex items-center gap-2 text-left text-ink"
      >
        <span className="grid size-5 shrink-0 place-items-center border border-ink/15 transition-colors duration-[var(--dur-2)] group-hover:border-accent group-hover:text-accent">
          {isPlaying ? (
            <Pause size={9} weight="fill" />
          ) : (
            <Play size={9} weight="fill" />
          )}
        </span>
        <span>
          {currentTrack.title}, {currentTrack.artist}
        </span>
        {isPlaying && (
          <span aria-hidden className="flex h-2.5 items-end gap-0.5">
            <span className="w-0.5 bg-accent eq-bar-1" />
            <span className="w-0.5 bg-accent eq-bar-2" />
            <span className="w-0.5 bg-accent eq-bar-3" />
          </span>
        )}
      </button>
    </div>
  );
}
