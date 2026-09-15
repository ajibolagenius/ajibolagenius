"use client";

import { useCallback, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  CaretDown,
  CaretUp,
  Disc,
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
  }, [handleToggleMute]);

  if (pathname?.startsWith("/admin")) return null;

  // If user disabled the feature, render a polite discrete reactivation trigger
  if (!isEnabled) {
    return (
      <div className="fixed bottom-6 left-6 z-40 print:hidden">
        <button
          type="button"
          onClick={handleTurnOn}
          aria-label="Turn on Vintage Nigerian Radio"
          title="Turn on Vintage Nigerian Radio (Background Music)"
          className="group flex items-center gap-2 rounded-full border border-ink/15 bg-cream/95 px-3.5 py-2 text-body-xs font-medium text-ink/75 shadow-lg backdrop-blur-md transition-all hover:border-accent hover:text-ink active:scale-95 dark:bg-panel/95"
        >
          <Radio size={16} weight="duotone" className="text-accent transition-transform group-hover:scale-110" />
          <span className="font-mono text-[11px] tracking-wide text-ink/90">Naija Radio</span>
        </button>
      </div>
    );
  }

  // Collapsed Minimalist Floating Pill Dock
  if (isMinimized) {
    return (
      <div className="fixed bottom-6 left-6 z-40 print:hidden">
        <div
          role="region"
          aria-label="Vintage Nigerian Radio Player (Minimized)"
          className="flex items-center gap-2.5 rounded-full border border-ink/15 bg-cream/95 py-1.5 pl-2 pr-3 shadow-xl backdrop-blur-md dark:bg-panel/95 transition-all duration-[var(--dur-2)]"
        >
          {/* Spinning Vinyl Button */}
          <button
            type="button"
            onClick={() => {
              sound.playTap();
              vintageRadio.toggleMinimized();
            }}
            aria-label="Expand radio player"
            title="Expand Vintage Radio Player"
            className="group relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ink text-cream transition-transform active:scale-95"
          >
            <div
              className={`flex h-full w-full items-center justify-center rounded-full border border-ink/20 ${
                isPlaying
                  ? "animate-[spin_4s_linear_infinite]"
                  : "rotate-0"
              }`}
            >
              <Disc
                size={18}
                weight="duotone"
                className="text-cream group-hover:text-accent transition-colors"
              />
            </div>
            <span className="absolute h-1.5 w-1.5 rounded-full bg-accent" />
          </button>

          {/* Soundwave Equalizer */}
          <div
            className="flex h-3.5 items-end gap-0.5 px-0.5 cursor-pointer"
            onClick={handleTogglePlay}
            title={isPlaying ? "Click to pause" : "Click to play"}
            aria-hidden
          >
            <span
              className={`w-0.5 rounded-full bg-accent transition-all ${
                isPlaying ? "eq-bar-1" : "h-1 opacity-40"
              }`}
            />
            <span
              className={`w-0.5 rounded-full bg-accent transition-all ${
                isPlaying ? "eq-bar-2" : "h-1 opacity-40"
              }`}
            />
            <span
              className={`w-0.5 rounded-full bg-accent transition-all ${
                isPlaying ? "eq-bar-3" : "h-1 opacity-40"
              }`}
            />
            <span
              className={`w-0.5 rounded-full bg-accent transition-all ${
                isPlaying ? "eq-bar-4" : "h-1 opacity-40"
              }`}
            />
          </div>

          {/* Track Summary / Title */}
          <button
            type="button"
            onClick={() => {
              sound.playTap();
              vintageRadio.toggleMinimized();
            }}
            className="flex max-w-[130px] sm:max-w-[160px] flex-col items-start text-left truncate"
            title={`${currentTrack.title} — ${currentTrack.artist}`}
          >
            <span className="w-full truncate font-display text-[12px] font-semibold leading-tight text-ink">
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
            title={isPlaying ? "Pause (Space)" : "Play (Space)"}
            className="flex h-6 w-6 items-center justify-center rounded-full text-ink/70 hover:bg-ink/5 hover:text-ink active:scale-95 transition-colors"
          >
            {isPlaying ? (
              <Pause size={13} weight="fill" />
            ) : (
              <Play size={13} weight="fill" className="ml-0.5" />
            )}
          </button>

          {/* Quick Mute Toggle */}
          <button
            type="button"
            onClick={handleToggleMute}
            aria-label={isMuted ? "Unmute radio" : "Mute radio"}
            title={isMuted ? "Unmute (Shift+M)" : "Mute (Shift+M)"}
            className="flex h-6 w-6 items-center justify-center rounded-full text-ink/60 hover:bg-ink/5 hover:text-ink active:scale-95 transition-colors"
          >
            {isMuted || volume === 0 ? (
              <SpeakerSimpleSlash size={13} weight="regular" className="text-accent" />
            ) : (
              <SpeakerSimpleHigh size={13} weight="regular" />
            )}
          </button>

          {/* Expand Button */}
          <button
            type="button"
            onClick={() => {
              sound.playTap();
              vintageRadio.toggleMinimized();
            }}
            aria-label="Expand radio cassette deck"
            title="Expand player"
            className="flex h-6 w-6 items-center justify-center rounded-full text-ink/40 hover:bg-ink/5 hover:text-ink active:scale-95 transition-colors"
          >
            <CaretUp size={13} weight="bold" />
          </button>
        </div>
      </div>
    );
  }

  // Expanded Option 1: Full Vintage Cassette / Vinyl Deck
  return (
    <div
      role="region"
      aria-label="Vintage Nigerian Radio Cassette Player"
      className="fixed bottom-6 left-6 z-40 w-[330px] max-w-[calc(100vw-3rem)] rounded-xl border border-ink/15 bg-cream/95 p-3.5 shadow-2xl backdrop-blur-md dark:bg-panel/95 print:hidden transition-all duration-[var(--dur-3)] flex flex-col gap-3"
    >
      {/* Top Header Bar */}
      <div className="flex items-center justify-between border-b border-ink/10 pb-2">
        <div className="flex items-center gap-2">
          <span
            className={`h-2 w-2 rounded-full transition-colors ${
              isPlaying
                ? "bg-accent animate-pulse shadow-[0_0_8px_rgba(230,67,1,0.6)]"
                : "bg-ink/30"
            }`}
            aria-hidden
          />
          <div className="flex flex-col">
            <span className="font-mono text-[9px] uppercase tracking-widest font-semibold text-accent">
              Naija Vintage Radio
            </span>
            <span className="font-mono text-[8px] uppercase tracking-wider text-ink/40">
              Tape Deck · Side A · Stereo
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => {
              sound.playTap();
              vintageRadio.toggleMinimized();
            }}
            aria-label="Minimize radio player"
            title="Minimize to floating pill"
            className="flex h-6 w-6 items-center justify-center rounded p-1 text-ink/50 transition-colors hover:bg-ink/5 hover:text-ink"
          >
            <CaretDown size={14} weight="bold" />
          </button>
          <button
            type="button"
            onClick={handleTurnOff}
            aria-label="Turn off radio feature"
            title="Turn off background radio feature"
            className="flex h-6 w-6 items-center justify-center rounded p-1 text-ink/50 transition-colors hover:bg-ink/5 hover:text-accent"
          >
            <X size={14} weight="bold" />
          </button>
        </div>
      </div>

      {/* Retro Cassette Graphic Visualizer */}
      <div className="relative rounded-lg border border-ink/15 bg-panel/70 dark:bg-ink/10 p-3 overflow-hidden shadow-inner flex flex-col gap-2">
        {/* Cassette Tape Header Label */}
        <div className="flex items-center justify-between font-mono text-[9px] text-ink/50 border-b border-ink/10 pb-1">
          <span className="font-bold text-ink/70">HIGH BIAS · C-90</span>
          <span className="text-accent font-semibold tracking-wider">LAGOS STEREO</span>
          <span>CH 1-2</span>
        </div>

        {/* Cassette Window with Spools & Magnetic Ribbon */}
        <div className="relative flex items-center justify-between px-4 py-2 bg-ink/[0.04] dark:bg-ink/[0.2] rounded border border-ink/10">
          {/* Left Spool */}
          <div
            className={`relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-ink/30 bg-cream/90 dark:bg-panel shadow-xs transition-transform ${
              isPlaying ? "animate-[spin_4s_linear_infinite]" : ""
            }`}
            aria-hidden
          >
            <div className="h-3 w-3 rounded-full border border-ink/40 bg-ink/10 flex items-center justify-center">
              <div className="h-1 w-1 rounded-full bg-accent" />
            </div>
            {/* Cog teeth */}
            <span className="absolute top-0 h-1 w-0.5 bg-ink/50" />
            <span className="absolute bottom-0 h-1 w-0.5 bg-ink/50" />
            <span className="absolute left-0 h-0.5 w-1 bg-ink/50" />
            <span className="absolute right-0 h-0.5 w-1 bg-ink/50" />
          </div>

          {/* Magnetic Ribbon Bridge with Equalizer Bars */}
          <div className="flex flex-col items-center gap-1">
            <div className="flex h-4 items-end gap-1 px-2" aria-hidden>
              <span
                className={`w-1 rounded-full bg-accent transition-all ${
                  isPlaying ? "eq-bar-1" : "h-1 opacity-30"
                }`}
              />
              <span
                className={`w-1 rounded-full bg-accent transition-all ${
                  isPlaying ? "eq-bar-2" : "h-1 opacity-30"
                }`}
              />
              <span
                className={`w-1 rounded-full bg-accent transition-all ${
                  isPlaying ? "eq-bar-3" : "h-1 opacity-30"
                }`}
              />
              <span
                className={`w-1 rounded-full bg-accent transition-all ${
                  isPlaying ? "eq-bar-4" : "h-1 opacity-30"
                }`}
              />
              <span
                className={`w-1 rounded-full bg-accent transition-all ${
                  isPlaying ? "eq-bar-5" : "h-1 opacity-30"
                }`}
              />
            </div>
            <span className="font-mono text-[8px] uppercase tracking-widest text-ink/40">
              {isPlaying ? "PLAYING" : "STANDBY"}
            </span>
          </div>

          {/* Right Spool */}
          <div
            className={`relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-ink/30 bg-cream/90 dark:bg-panel shadow-xs transition-transform ${
              isPlaying ? "animate-[spin_4s_linear_infinite]" : ""
            }`}
            aria-hidden
          >
            <div className="h-3 w-3 rounded-full border border-ink/40 bg-ink/10 flex items-center justify-center">
              <div className="h-1 w-1 rounded-full bg-accent" />
            </div>
            {/* Cog teeth */}
            <span className="absolute top-0 h-1 w-0.5 bg-ink/50" />
            <span className="absolute bottom-0 h-1 w-0.5 bg-ink/50" />
            <span className="absolute left-0 h-0.5 w-1 bg-ink/50" />
            <span className="absolute right-0 h-0.5 w-1 bg-ink/50" />
          </div>
        </div>
      </div>

      {/* Track Information */}
      <div className="flex flex-col gap-1">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="font-display text-body-s font-semibold text-ink leading-snug truncate">
            {currentTrack.title}
          </h3>
          <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-accent/10 text-accent font-medium shrink-0">
            {currentTrack.year} · {currentTrack.genre}
          </span>
        </div>
        <p className="text-body-xs text-ink/70 leading-none truncate">
          {currentTrack.artist}
        </p>
        {currentTrack.culturalNote && (
          <p className="mt-1 font-serif italic text-[11px] leading-relaxed text-ink/65 bg-ink/[0.03] p-1.5 rounded border border-ink/5">
            &ldquo;{currentTrack.culturalNote}&rdquo;
          </p>
        )}
      </div>

      {/* Main Transport Playback Controls */}
      <div className="flex items-center justify-center gap-3 pt-0.5">
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous track"
          title="Previous Track"
          className="flex h-8 w-8 items-center justify-center rounded-full text-ink/70 hover:bg-ink/5 hover:text-ink active:scale-95 transition-all"
        >
          <SkipBack size={16} weight="fill" />
        </button>

        <button
          type="button"
          onClick={handleTogglePlay}
          aria-label={isPlaying ? "Pause music" : "Play music"}
          title={isPlaying ? "Pause" : "Play"}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-ink text-cream hover:bg-accent hover:shadow-accent/20 active:scale-95 shadow-md transition-all"
        >
          {isPlaying ? (
            <Pause size={18} weight="fill" />
          ) : (
            <Play size={18} weight="fill" className="ml-0.5" />
          )}
        </button>

        <button
          type="button"
          onClick={handleNext}
          aria-label="Next track (Random)"
          title="Next Track (Random)"
          className="flex h-8 w-8 items-center justify-center rounded-full text-ink/70 hover:bg-ink/5 hover:text-ink active:scale-95 transition-all"
        >
          <SkipForward size={16} weight="fill" />
        </button>

        <button
          type="button"
          onClick={() => {
            sound.playTap();
            vintageRadio.nextTrack(true);
            track("vintage_radio_shuffled");
          }}
          aria-label="Shuffle random track"
          title="Shuffle track"
          className="flex h-8 w-8 items-center justify-center rounded-full text-ink/50 hover:bg-ink/5 hover:text-accent active:scale-95 transition-all"
        >
          <Shuffle size={16} weight="bold" />
        </button>
      </div>

      {/* Volume & Accessibility Control Row */}
      <div className="flex items-center gap-2 pt-1 border-t border-ink/10">
        <button
          type="button"
          onClick={handleToggleMute}
          aria-label={isMuted ? "Unmute audio" : "Mute audio"}
          title={isMuted ? "Unmute (Shift+M)" : "Mute (Shift+M)"}
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded text-ink/60 hover:text-ink transition-colors"
        >
          {isMuted || volume === 0 ? (
            <SpeakerSimpleSlash size={15} weight="regular" className="text-accent" />
          ) : volume < 0.4 ? (
            <SpeakerSimpleLow size={15} weight="regular" />
          ) : (
            <SpeakerSimpleHigh size={15} weight="regular" />
          )}
        </button>

        <input
          type="range"
          min="0"
          max="0.80"
          step="0.01"
          value={isMuted ? 0 : volume}
          onChange={handleVolumeChange}
          aria-label="Background music volume"
          className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-ink/15 accent-accent transition-colors"
        />

        <span className="w-7 text-right font-mono text-[10px] text-ink/50">
          {Math.round((isMuted ? 0 : volume) * 100)}%
        </span>
      </div>

      {/* Accessibility announcement for screen readers */}
      <div className="sr-only" aria-live="polite">
        {isPlaying
          ? `Playing ${currentTrack.title} by ${currentTrack.artist} (${currentTrack.year})`
          : "Vintage radio playback paused"}
      </div>
    </div>
  );
}
