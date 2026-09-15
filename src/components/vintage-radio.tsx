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
import { sound } from "@/lib/sound";
import { track } from "@/lib/analytics";

/** Determines whether the current page already renders the desktop sidebar. */
function routeHasSidebar(pathname: string | null): boolean {
  if (!pathname) return true;
  if (pathname.startsWith("/sandbox")) return false;
  if (pathname.startsWith("/cv")) return false;
  if (pathname.startsWith("/admin")) return false;
  return true;
}

/**
 * Embedded Vintage Radio component for the desktop sidebar rail.
 * Adheres strictly to the sharp-corner Swiss-grid aesthetic.
 */
export function SidebarVintageRadio() {
  const {
    currentTrack,
    isPlaying,
    isMuted,
    volume,
    isMinimized,
    isEnabled,
  } = useVintageRadio();

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
    const val = parseFloat(e.target.value);
    vintageRadio.setVolume(val);
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

  if (!isEnabled) {
    return (
      <button
        type="button"
        onClick={handleTurnOn}
        aria-label="Turn on Vintage Nigerian Radio"
        title="Turn on Vintage Nigerian Radio (Background Music)"
        className="group flex w-full items-center justify-between border border-ink/10 bg-ink/[0.02] px-3 py-2 text-left font-mono text-[11px] text-ink/75 transition-colors hover:border-accent hover:bg-accent/5 hover:text-ink active:scale-[0.99]"
      >
        <div className="flex items-center gap-2">
          <Radio size={14} weight="duotone" className="text-accent" />
          <span className="font-mono text-[10px] uppercase tracking-wider font-medium">
            Naija Radio (Off)
          </span>
        </div>
        <span className="font-mono text-[9px] uppercase tracking-widest text-accent">
          Turn On →
        </span>
      </button>
    );
  }

  // Minimized / Docked State inside Sidebar
  if (isMinimized) {
    return (
      <div
        role="region"
        aria-label="Vintage Nigerian Radio (Sidebar Docked)"
        className="flex w-full flex-col gap-2 border border-ink/10 bg-ink/[0.02] p-2.5 transition-all"
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <span
              className={`h-1.5 w-1.5 shrink-0 transition-colors ${
                isPlaying ? "bg-accent animate-pulse" : "bg-ink/30"
              }`}
              aria-hidden
            />
            <span className="font-mono text-[9px] uppercase tracking-widest text-accent font-semibold truncate">
              Vintage Radio
            </span>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={handleTogglePlay}
              aria-label={isPlaying ? "Pause music" : "Play music"}
              title={isPlaying ? "Pause (Space)" : "Play (Space)"}
              className="flex h-6 w-6 items-center justify-center border border-ink/10 bg-ink/[0.03] text-ink transition-colors hover:border-accent hover:bg-accent hover:text-cream"
            >
              {isPlaying ? <Pause size={11} weight="fill" /> : <Play size={11} weight="fill" />}
            </button>

            <button
              type="button"
              onClick={handleToggleMute}
              aria-label={isMuted ? "Unmute audio" : "Mute audio"}
              title={isMuted ? "Unmute (Shift+M)" : "Mute (Shift+M)"}
              className="flex h-6 w-6 items-center justify-center border border-ink/10 bg-ink/[0.03] text-ink transition-colors hover:border-accent hover:bg-accent hover:text-cream"
            >
              {isMuted || volume === 0 ? (
                <SpeakerSimpleSlash size={11} className="text-accent" />
              ) : (
                <SpeakerSimpleHigh size={11} />
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                sound.playTap();
                vintageRadio.toggleMinimized();
              }}
              aria-label="Expand radio deck"
              title="Expand Cassette Deck"
              className="flex h-6 w-6 items-center justify-center border border-ink/10 bg-ink/[0.03] text-ink/60 transition-colors hover:border-ink/30 hover:text-ink"
            >
              <CaretDown size={11} weight="bold" />
            </button>
          </div>
        </div>

        {/* Track Title + Equalizer */}
        <div
          className="flex items-center justify-between gap-2 cursor-pointer pt-0.5"
          onClick={() => {
            sound.playTap();
            vintageRadio.toggleMinimized();
          }}
          title="Click to expand deck"
        >
          <span className="font-display text-[12px] font-medium text-ink truncate">
            {currentTrack.title}
          </span>
          <div className="flex h-3 items-end gap-0.5 shrink-0" aria-hidden>
            <span
              className={`w-0.5 bg-accent transition-all ${
                isPlaying ? "eq-bar-1" : "h-1 opacity-30"
              }`}
            />
            <span
              className={`w-0.5 bg-accent transition-all ${
                isPlaying ? "eq-bar-2" : "h-1 opacity-30"
              }`}
            />
            <span
              className={`w-0.5 bg-accent transition-all ${
                isPlaying ? "eq-bar-3" : "h-1 opacity-30"
              }`}
            />
            <span
              className={`w-0.5 bg-accent transition-all ${
                isPlaying ? "eq-bar-4" : "h-1 opacity-30"
              }`}
            />
          </div>
        </div>
      </div>
    );
  }

  // Expanded State inside Sidebar Rail
  return (
    <div
      role="region"
      aria-label="Vintage Nigerian Radio Cassette Player"
      className="flex w-full flex-col gap-2.5 border border-ink/10 bg-ink/[0.02] p-3 transition-all"
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
            Tape Deck · Stereo
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => {
              sound.playTap();
              vintageRadio.toggleMinimized();
            }}
            aria-label="Minimize radio player"
            title="Dock player"
            className="flex h-5 w-5 items-center justify-center text-ink/40 transition-colors hover:text-ink"
          >
            <CaretUp size={11} weight="bold" />
          </button>
          <button
            type="button"
            onClick={handleTurnOff}
            aria-label="Turn off radio feature"
            title="Turn off radio"
            className="flex h-5 w-5 items-center justify-center text-ink/40 transition-colors hover:text-accent"
          >
            <X size={11} weight="bold" />
          </button>
        </div>
      </div>

      {/* Swiss Cassette Window with Spools */}
      <div className="border border-ink/10 bg-panel/50 dark:bg-ink/[0.1] p-2 flex flex-col gap-1.5">
        <div className="flex items-center justify-between font-mono text-[8px] text-ink/40 border-b border-ink/5 pb-1">
          <span>HIGH BIAS C-90</span>
          <span className="text-accent font-medium">SIDE A</span>
        </div>

        <div className="flex items-center justify-between px-2 py-1 bg-ink/[0.03] border border-ink/5">
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
        <p className="font-sans text-[11px] text-ink/65 truncate">
          {currentTrack.artist}
        </p>
        {currentTrack.culturalNote && (
          <p className="mt-1 font-serif text-[10px] italic leading-relaxed text-ink/60 border-l-2 border-accent/30 pl-2">
            &ldquo;{currentTrack.culturalNote}&rdquo;
          </p>
        )}
      </div>

      {/* Playback Controls */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous track"
            title="Previous track"
            className="flex h-7 w-7 items-center justify-center border border-ink/10 bg-ink/[0.02] text-ink transition-colors hover:border-accent hover:bg-accent hover:text-cream active:scale-95"
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
            className="flex h-7 w-7 items-center justify-center border border-ink/10 bg-ink/[0.02] text-ink transition-colors hover:border-accent hover:bg-accent hover:text-cream active:scale-95"
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
            className="flex h-7 w-7 items-center justify-center border border-ink/10 bg-ink/[0.02] text-ink/50 transition-colors hover:border-accent hover:text-accent active:scale-95"
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
 * Floating Vintage Radio component:
 * - Renders on mobile screens (< lg) across all pages.
 * - On desktop (lg+), only renders on pages that DO NOT have a sidebar (e.g. /sandbox, /cv).
 * - Adheres strictly to the sharp-corner Swiss-grid aesthetic.
 */
export function VintageRadio() {
  const pathname = usePathname();
  const {
    currentTrack,
    isPlaying,
    isMuted,
    volume,
    isMinimized,
    isEnabled,
  } = useVintageRadio();

  const hasSidebar = routeHasSidebar(pathname);

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
    const val = parseFloat(e.target.value);
    vintageRadio.setVolume(val);
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

  if (pathname?.startsWith("/admin")) return null;

  // Visibility classes: On mobile always show; on desktop only show if page has no sidebar
  const visibilityClass = hasSidebar ? "lg:hidden" : "block";

  // Turned Off State
  if (!isEnabled) {
    return (
      <div className={`fixed bottom-4 left-4 z-40 print:hidden ${visibilityClass}`}>
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
      <div className={`fixed bottom-4 left-4 z-40 print:hidden ${visibilityClass}`}>
        <div
          role="region"
          aria-label="Vintage Nigerian Radio (Minimized)"
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

  // Expanded Floating Player on Mobile / Non-sidebar pages
  return (
    <div
      role="region"
      aria-label="Vintage Nigerian Radio Cassette Player"
      className={`fixed bottom-4 left-4 z-40 w-[300px] max-w-[calc(100vw-2rem)] border border-ink/15 bg-cream/95 p-3 shadow-2xl backdrop-blur-md dark:bg-panel/95 print:hidden transition-all flex flex-col gap-2.5 ${visibilityClass}`}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-ink/10 pb-1.5">
        <div className="flex items-center gap-1.5 min-w-0">
          <span
            className={`h-1.5 w-1.5 shrink-0 transition-colors ${
              isPlaying ? "bg-accent animate-pulse" : "bg-ink/30"
            }`}
            aria-hidden
          />
          <span className="font-mono text-[9px] uppercase tracking-widest text-accent font-semibold truncate">
            Naija Vintage Radio
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
            title="Minimize to bar"
            className="flex h-5 w-5 items-center justify-center text-ink/50 hover:text-ink transition-colors"
          >
            <CaretDown size={12} weight="bold" />
          </button>
          <button
            type="button"
            onClick={handleTurnOff}
            aria-label="Turn off radio"
            title="Turn off radio"
            className="flex h-5 w-5 items-center justify-center text-ink/50 hover:text-accent transition-colors"
          >
            <X size={12} weight="bold" />
          </button>
        </div>
      </div>

      {/* Cassette Visualizer */}
      <div className="border border-ink/10 bg-panel/60 dark:bg-ink/[0.1] p-2 flex flex-col gap-1.5">
        <div className="flex items-center justify-between font-mono text-[8px] text-ink/40 border-b border-ink/5 pb-1">
          <span>HIGH BIAS · C-90</span>
          <span className="text-accent font-semibold tracking-wider">STEREO</span>
        </div>

        <div className="flex items-center justify-between px-3 py-1.5 bg-ink/[0.03] border border-ink/5">
          <div
            className={`flex h-6 w-6 items-center justify-center border border-ink/30 bg-cream dark:bg-panel ${
              isPlaying ? "animate-[spin_4s_linear_infinite]" : ""
            }`}
            aria-hidden
          >
            <span className="h-1 w-1 bg-accent" />
          </div>

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

          <div
            className={`flex h-6 w-6 items-center justify-center border border-ink/30 bg-cream dark:bg-panel ${
              isPlaying ? "animate-[spin_4s_linear_infinite]" : ""
            }`}
            aria-hidden
          >
            <span className="h-1 w-1 bg-accent" />
          </div>
        </div>
      </div>

      {/* Track info */}
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
      </div>

      {/* Transport Controls */}
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
