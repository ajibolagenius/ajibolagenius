"use client";

import { useCallback, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  CaretDown,
  CaretUp,
  Pause,
  Play,
  Radio,
  Shuffle,
  SkipBack,
  SkipForward,
  SpeakerSimpleHigh,
  SpeakerSimpleLow,
  SpeakerSimpleSlash,
  X,
} from "@phosphor-icons/react/dist/ssr";
import { useVintageRadio } from "@/hooks/use-vintage-radio";
import { vintageRadio } from "@/lib/vintage-radio";
import type { VintageTrack } from "@/lib/vintage-radio-tracks";
import { sound } from "@/lib/sound";
import { track } from "@/lib/analytics";

/**
 * Source + attribution row. The cultural note gets a citation, and Apple's
 * terms require the store link wherever one of their previews plays.
 */
function TrackCitation({ track }: { track: VintageTrack }) {
  return (
    <div className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-wider text-ink/45">
      <a
        href={track.wikiUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Read about ${track.title} on Wikipedia`}
        className="underline decoration-dotted underline-offset-2 transition-colors hover:text-accent focus-visible:text-accent focus-visible:outline-none"
      >
        Source
      </a>
      {track.listenUrl && (
        <>
          <span aria-hidden="true" className="text-ink/25">/</span>
          <a
            href={track.listenUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Listen to ${track.title} in full on Apple Music`}
            className="underline decoration-dotted underline-offset-2 transition-colors hover:text-accent focus-visible:text-accent focus-visible:outline-none"
          >
            Apple Music
          </a>
        </>
      )}
    </div>
  );
}

type RadioControls = ReturnType<typeof useRadioControls>;

/**
 * The expanded cassette deck. It once served both the sidebar rail and the
 * floating player; the sidebar is gone, so the floating player is its only
 * mount.
 */
function ExpandedDeck({
  className,
  label,
  CollapseIcon,
  collapseTitle,
  showCulturalNote = false,
  controls,
}: {
  className: string;
  label: string;
  CollapseIcon: typeof CaretUp;
  collapseTitle: string;
  showCulturalNote?: boolean;
  controls: RadioControls;
}) {
  const {
    currentTrack,
    isPlaying,
    isMuted,
    volume,
    handleTogglePlay,
    handleNext,
    handlePrev,
    handleToggleMute,
    handleVolumeChange,
    handleTurnOff,
  } = controls;

  return (
    <div
      role="region"
      aria-label="Vintage Nigerian Radio Cassette Player"
      onMouseEnter={() => vintageRadio.warmCurrent()}
      onFocus={() => vintageRadio.warmCurrent()}
      className={className}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-ink/10 pb-1.5">
        <div className="flex items-center gap-1.5 min-w-0">
          <span
            className={`h-1.5 w-1.5 shrink-0 transition-colors ${
              isPlaying ? "bg-accent animate-pulse" : "bg-ink/30"
            }`}
            aria-hidden
          />
          <span className="font-mono text-[9px] uppercase tracking-widest text-accent font-semibold truncate">
            {label}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => {
              sound.playTap();
              vintageRadio.toggleMinimized();
            }}
            aria-label="Minimize player"
            title={collapseTitle}
            className="flex h-5 w-5 items-center justify-center text-ink/50 transition-colors hover:text-ink"
          >
            <CollapseIcon size={12} weight="bold" />
          </button>
          <button
            type="button"
            onClick={handleTurnOff}
            aria-label="Turn off radio"
            title="Turn off radio"
            className="flex h-5 w-5 items-center justify-center text-ink/50 transition-colors hover:text-accent"
          >
            <X size={12} weight="bold" />
          </button>
        </div>
      </div>

      {/* Swiss Cassette Window with Spools */}
      <div className="border border-ink/10 bg-panel/60 dark:bg-ink/[0.1] p-2 flex flex-col gap-1.5">
        <div className="flex items-center justify-between font-mono text-[8px] text-ink/40 border-b border-ink/5 pb-1">
          <span>HIGH BIAS · C-90</span>
          <span className="text-accent font-medium">SIDE A</span>
        </div>

        <div className="flex items-center justify-between px-3 py-1.5 bg-ink/[0.03] border border-ink/5">
          {/* Left Spool */}
          <div
            className={`flex h-6 w-6 items-center justify-center border border-ink/30 bg-cream dark:bg-panel transition-transform ${
              isPlaying ? "animate-[spin_4s_linear_infinite]" : ""
            }`}
            aria-hidden
          >
            <span className="h-1 w-1 bg-accent" />
          </div>

          {/* Equalizer Meter */}
          <div className="flex flex-col items-center gap-0.5">
            <div className="flex h-3 items-end gap-1" aria-hidden>
              <span className={`w-0.5 bg-accent ${isPlaying ? "eq-bar-1" : "h-1 opacity-30"}`} />
              <span className={`w-0.5 bg-accent ${isPlaying ? "eq-bar-2" : "h-1 opacity-30"}`} />
              <span className={`w-0.5 bg-accent ${isPlaying ? "eq-bar-3" : "h-1 opacity-30"}`} />
              <span className={`w-0.5 bg-accent ${isPlaying ? "eq-bar-4" : "h-1 opacity-30"}`} />
              <span className={`w-0.5 bg-accent ${isPlaying ? "eq-bar-5" : "h-1 opacity-30"}`} />
            </div>
            <span className="font-mono text-[7px] uppercase tracking-widest text-ink/40">
              {isPlaying ? "PLAYING" : "STANDBY"}
            </span>
          </div>

          {/* Right Spool */}
          <div
            className={`flex h-6 w-6 items-center justify-center border border-ink/30 bg-cream dark:bg-panel transition-transform ${
              isPlaying ? "animate-[spin_4s_linear_infinite]" : ""
            }`}
            aria-hidden
          >
            <span className="h-1 w-1 bg-accent" />
          </div>
        </div>
      </div>

      {/* Track Details */}
      <div className="flex flex-col gap-0.5">
        <div className="flex items-baseline justify-between gap-1">
          <span className="font-display text-[13px] font-medium text-ink truncate">
            {currentTrack.title}
          </span>
          <span className="font-mono text-[9px] border border-accent/20 bg-accent/5 px-1 text-accent shrink-0">
            {currentTrack.year}
          </span>
        </div>
        <p className="font-sans text-[11px] text-ink/70 truncate">
          {currentTrack.artist}
        </p>
        {showCulturalNote && currentTrack.culturalNote && (
          <p className="mt-1 font-serif text-[10px] italic leading-relaxed text-ink/60 border-l-2 border-accent/30 pl-2">
            &ldquo;{currentTrack.culturalNote}&rdquo;
          </p>
        )}
        <div className="mt-1.5">
          <TrackCitation track={currentTrack} />
        </div>
      </div>

      {/* Playback Controls */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous track"
            title="Previous track"
            className="flex h-7 w-7 items-center justify-center border border-ink/10 bg-ink/[0.03] text-ink transition-colors hover:border-accent hover:bg-accent hover:text-cream active:scale-95"
          >
            <SkipBack size={13} weight="fill" />
          </button>

          <button
            type="button"
            onClick={handleTogglePlay}
            aria-label={isPlaying ? "Pause music" : "Play music"}
            title={isPlaying ? "Pause" : "Play"}
            className="flex h-7 w-7 items-center justify-center bg-ink text-cream transition-colors hover:bg-accent active:scale-95"
          >
            {isPlaying ? <Pause size={13} weight="fill" /> : <Play size={13} weight="fill" />}
          </button>

          <button
            type="button"
            onClick={handleNext}
            aria-label="Next track"
            title="Next track"
            className="flex h-7 w-7 items-center justify-center border border-ink/10 bg-ink/[0.03] text-ink transition-colors hover:border-accent hover:bg-accent hover:text-cream active:scale-95"
          >
            <SkipForward size={13} weight="fill" />
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playTap();
              vintageRadio.nextTrack(true);
              track("vintage_radio_shuffled");
            }}
            aria-label="Shuffle track"
            title="Shuffle track"
            className="flex h-7 w-7 items-center justify-center border border-ink/10 bg-ink/[0.03] text-ink/50 transition-colors hover:border-accent hover:text-accent active:scale-95"
          >
            <Shuffle size={13} weight="bold" />
          </button>
        </div>

        {/* Volume & Mute */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleToggleMute}
            aria-label={isMuted ? "Unmute" : "Mute"}
            title={isMuted ? "Unmute (Shift+M)" : "Mute (Shift+M)"}
            className="flex h-6 w-6 items-center justify-center text-ink/50 transition-colors hover:text-ink"
          >
            {isMuted || volume === 0 ? (
              <SpeakerSimpleSlash size={13} className="text-accent" />
            ) : volume < 0.4 ? (
              <SpeakerSimpleLow size={13} />
            ) : (
              <SpeakerSimpleHigh size={13} />
            )}
          </button>
          <input
            type="range"
            min="0"
            max="0.80"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            aria-label="Volume"
            className="h-1 w-14 cursor-pointer appearance-none bg-ink/15 accent-accent"
          />
        </div>
      </div>
    </div>
  );
}

/**
 * Player state plus the handlers that act on it. Both variants below drove
 * byte-identical copies of these seven — the only thing that ever differed
 * between them is the markup.
 */
export function useRadioControls() {
  const state = useVintageRadio();
  const { currentTrack, isPlaying, isMuted } = state;

  const handleTogglePlay = useCallback(() => {
    sound.playTap();
    if (isPlaying) {
      vintageRadio.pause();
      track("vintage_radio_paused", {
        track_id: currentTrack.id,
        title: currentTrack.title,
      });
    } else {
      vintageRadio.play();
      track("vintage_radio_played", {
        track_id: currentTrack.id,
        title: currentTrack.title,
      });
    }
  }, [isPlaying, currentTrack]);

  const handleNext = useCallback(() => {
    sound.playTap();
    vintageRadio.nextTrack(isPlaying);
    track("vintage_radio_next", {
      track_id: currentTrack.id,
    });
  }, [isPlaying, currentTrack]);

  const handlePrev = useCallback(() => {
    sound.playTap();
    vintageRadio.prevTrack();
    track("vintage_radio_prev", {
      track_id: currentTrack.id,
    });
  }, [currentTrack]);

  const handleToggleMute = useCallback(() => {
    sound.playTap();
    vintageRadio.toggleMute();
    track("vintage_radio_mute_toggled", {
      is_muted: !isMuted,
    });
  }, [isMuted]);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    vintageRadio.setVolume(parseFloat(e.target.value));
  };

  const handleTurnOff = () => {
    sound.playTap();
    vintageRadio.setEnabled(false);
    track("vintage_radio_disabled");
  };

  const handleTurnOn = () => {
    sound.playTap();
    vintageRadio.setEnabled(true);
    vintageRadio.play();
    track("vintage_radio_enabled");
  };

  return {
    ...state,
    handleTogglePlay,
    handleNext,
    handlePrev,
    handleToggleMute,
    handleVolumeChange,
    handleTurnOff,
    handleTurnOn,
  };
}

/**
 * Floating Vintage Radio component:
 * - Hidden on the homepage, where the hero status line is the control.
 * - Elsewhere, appears only after the visitor has started playback.
 * - Adheres strictly to the sharp-corner Swiss-grid aesthetic.
 */
export function VintageRadio() {
  const pathname = usePathname();
  const controls = useRadioControls();
  const {
    currentTrack,
    isPlaying,
    isMuted,
    volume,
    isMinimized,
    isEnabled,
    hasStarted,
    handleTogglePlay,
    handleToggleMute,
    handleTurnOn,
  } = controls;

  // Keyboard shortcut listener: Shift+M to toggle playback, or global space when focused
  useEffect(() => {
    if (pathname?.startsWith("/admin")) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target as HTMLElement)?.isContentEditable
      ) {
        return;
      }

      if (e.key === "m" && e.shiftKey) {
        e.preventDefault();
        handleToggleMute();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleToggleMute, pathname]);

  // Nothing plays until the visitor presses play — on the homepage that is the
  // hero's status line, which is also the control there, so the floating
  // player only appears elsewhere and only once playback has started.
  if (pathname?.startsWith("/admin") || pathname === "/" || !hasStarted) {
    return null;
  }

  // Turned Off State
  if (!isEnabled) {
    return (
      <div className="fixed bottom-4 left-4 z-40 print:hidden">
        <button
          type="button"
          onClick={handleTurnOn}
          aria-label="Turn on Vintage Nigerian Radio"
          title="Turn on Vintage Nigerian Radio (Background Music)"
          className="group flex items-center gap-2 border border-ink/15 bg-cream/95 px-3 py-2 text-body-xs font-medium text-ink/75 shadow-lg backdrop-blur-md transition-all hover:border-accent hover:text-ink active:scale-95 dark:bg-panel/95"
        >
          <Radio size={14} weight="duotone" className="text-accent transition-transform group-hover:scale-110" />
          <span className="font-mono text-[10px] uppercase tracking-wider text-ink/90">
            Naija Radio
          </span>
        </button>
      </div>
    );
  }

  // Minimized / Docked Pill on Mobile / Non-sidebar pages
  if (isMinimized) {
    return (
      <div className="fixed bottom-4 left-4 z-40 print:hidden">
        <div
          role="region"
          aria-label="Vintage Nigerian Radio (Minimized)"
      onMouseEnter={() => vintageRadio.warmCurrent()}
      onFocus={() => vintageRadio.warmCurrent()}
          className="flex items-center gap-2 border border-ink/15 bg-cream/95 py-1.5 pl-2 pr-2.5 shadow-xl backdrop-blur-md dark:bg-panel/95"
        >
          {/* Status Indicator & Spool */}
          <button
            type="button"
            onClick={() => {
              sound.playTap();
              vintageRadio.toggleMinimized();
            }}
            aria-label="Expand radio player"
            title="Expand Vintage Radio Player"
            className="flex h-6 w-6 items-center justify-center border border-ink/20 bg-ink text-cream transition-transform active:scale-95"
          >
            <span
              className={`h-1.5 w-1.5 bg-accent ${
                isPlaying ? "animate-pulse" : ""
              }`}
            />
          </button>

          {/* Equalizer */}
          <div
            className="flex h-3 items-end gap-0.5 px-0.5 cursor-pointer"
            onClick={handleTogglePlay}
            title={isPlaying ? "Pause" : "Play"}
            aria-hidden
          >
            <span className={`w-0.5 bg-accent ${isPlaying ? "eq-bar-1" : "h-1 opacity-30"}`} />
            <span className={`w-0.5 bg-accent ${isPlaying ? "eq-bar-2" : "h-1 opacity-30"}`} />
            <span className={`w-0.5 bg-accent ${isPlaying ? "eq-bar-3" : "h-1 opacity-30"}`} />
            <span className={`w-0.5 bg-accent ${isPlaying ? "eq-bar-4" : "h-1 opacity-30"}`} />
          </div>

          {/* Track Summary */}
          <button
            type="button"
            onClick={() => {
              sound.playTap();
              vintageRadio.toggleMinimized();
            }}
            className="flex max-w-[120px] sm:max-w-[150px] flex-col items-start text-left truncate"
            title={`${currentTrack.title} — ${currentTrack.artist}`}
          >
            <span className="w-full truncate font-display text-[12px] font-medium leading-tight text-ink">
              {currentTrack.title}
            </span>
            <span className="w-full truncate font-mono text-[9px] text-ink/50 leading-tight">
              {currentTrack.artist}
            </span>
          </button>

          {/* Quick Play/Pause */}
          <button
            type="button"
            onClick={handleTogglePlay}
            aria-label={isPlaying ? "Pause music" : "Play music"}
            title={isPlaying ? "Pause" : "Play"}
            className="flex h-6 w-6 items-center justify-center border border-ink/10 bg-ink/[0.03] text-ink/80 hover:bg-accent hover:text-cream transition-colors"
          >
            {isPlaying ? <Pause size={11} weight="fill" /> : <Play size={11} weight="fill" />}
          </button>

          {/* Quick Mute Toggle */}
          <button
            type="button"
            onClick={handleToggleMute}
            aria-label={isMuted ? "Unmute radio" : "Mute radio"}
            title={isMuted ? "Unmute" : "Mute"}
            className="flex h-6 w-6 items-center justify-center border border-ink/10 bg-ink/[0.03] text-ink/60 hover:bg-ink/10 hover:text-ink transition-colors"
          >
            {isMuted || volume === 0 ? (
              <SpeakerSimpleSlash size={11} className="text-accent" />
            ) : (
              <SpeakerSimpleHigh size={11} />
            )}
          </button>

          {/* Expand Caret */}
          <button
            type="button"
            onClick={() => {
              sound.playTap();
              vintageRadio.toggleMinimized();
            }}
            aria-label="Expand radio player"
            title="Expand player"
            className="flex h-6 w-6 items-center justify-center text-ink/40 hover:text-ink transition-colors"
          >
            <CaretUp size={11} weight="bold" />
          </button>
        </div>
      </div>
    );
  }

  // Expanded floating player
  return (
    <ExpandedDeck
      controls={controls}
      className="fixed bottom-4 left-4 z-40 w-[300px] max-w-[calc(100vw-2rem)] border border-ink/15 bg-cream/95 p-3 shadow-2xl backdrop-blur-md dark:bg-panel/95 print:hidden transition-all flex flex-col gap-2.5"
      label="Naija Vintage Radio"
      CollapseIcon={CaretDown}
      collapseTitle="Minimize to bar"
      showCulturalNote
    />
  );
}
