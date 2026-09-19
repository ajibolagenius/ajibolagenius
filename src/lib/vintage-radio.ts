"use client";

import { VINTAGE_TRACKS, type VintageTrack } from "./vintage-radio-tracks";

const STORAGE_KEYS = {
  ENABLED: "portfolio-vintage-radio-enabled",
  MUTED: "portfolio-vintage-radio-muted",
  VOLUME: "portfolio-vintage-radio-volume",
  MINIMIZED: "portfolio-vintage-radio-minimized",
};

export interface VintageRadioState {
  currentTrackIndex: number;
  currentTrack: VintageTrack;
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  isMinimized: boolean;
  isEnabled: boolean;
}

class VintageRadioManager {
  private audio: HTMLAudioElement | null = null;
  private currentTrackIndex: number = 0;
  private isPlaying: boolean = false;
  private isMuted: boolean = false;
  private volume: number = 0.08; // Default low ambient background level (8%)
  private isMinimized: boolean = false;
  private isEnabled: boolean = true;
  private userPaused: boolean = false;
  private autoplayAttempted: boolean = false;
  /** Removes the armed first-interaction listeners; null when none are armed. */
  private cancelPendingAutoplay: (() => void) | null = null;
  /** Silent element that warms the next track's buffer while this one plays. */
  private prefetch: HTMLAudioElement | null = null;
  private nextTrackIndex: number = -1;

  constructor() {
    if (typeof window !== "undefined") {
      this.currentTrackIndex = Math.floor(Math.random() * VINTAGE_TRACKS.length);
      this.loadPreferences();
    }
  }

  private loadPreferences() {
    try {
      const storedEnabled = localStorage.getItem(STORAGE_KEYS.ENABLED);
      if (storedEnabled !== null) {
        this.isEnabled = storedEnabled === "true";
      }

      const storedMuted = localStorage.getItem(STORAGE_KEYS.MUTED);
      if (storedMuted !== null) {
        this.isMuted = storedMuted === "true";
      }

      const storedVolume = localStorage.getItem(STORAGE_KEYS.VOLUME);
      if (storedVolume !== null) {
        const parsed = parseFloat(storedVolume);
        if (!isNaN(parsed) && parsed >= 0 && parsed <= 1) {
          this.volume = parsed;
        }
      }

      const storedMinimized = localStorage.getItem(STORAGE_KEYS.MINIMIZED);
      if (storedMinimized !== null) {
        this.isMinimized = storedMinimized === "true";
      } else if (typeof window !== "undefined" && window.innerWidth < 640) {
        // Default to minimized on mobile to preserve viewport space
        this.isMinimized = true;
      }
    } catch {
      // Ignore localStorage errors (e.g. private browsing)
    }
  }

  private initAudio() {
    if (typeof window === "undefined" || this.audio) return this.audio;

    const audio = new Audio();
    audio.preload = "metadata";
    audio.volume = this.isMuted ? 0 : this.volume;

    audio.addEventListener("ended", () => {
      this.nextTrack(true);
    });

    audio.addEventListener("pause", () => {
      if (this.isPlaying) {
        this.isPlaying = false;
        this.notify();
      }
    });

    audio.addEventListener("play", () => {
      if (!this.isPlaying) {
        this.isPlaying = true;
        this.notify();
      }
    });

    audio.addEventListener("error", (e) => {
      console.warn("Vintage radio audio source error:", e);
      this.isPlaying = false;
      this.notify();
    });

    this.audio = audio;
    return audio;
  }

  /** Picks a track other than the current one, when the crate allows it. */
  private pickNextIndex(): number {
    if (VINTAGE_TRACKS.length < 2) return this.currentTrackIndex;
    let idx = this.currentTrackIndex;
    while (idx === this.currentTrackIndex) {
      idx = Math.floor(Math.random() * VINTAGE_TRACKS.length);
    }
    return idx;
  }

  /**
   * Decides the next track early and warms its buffer, so the handoff at
   * `ended` is gapless instead of stalling. The playing element reuses this
   * fetch straight from the HTTP cache rather than repeating it.
   */
  private prebufferNext() {
    if (typeof window === "undefined") return;
    this.nextTrackIndex = this.pickNextIndex();
    this.warm(VINTAGE_TRACKS[this.nextTrackIndex]?.src);
  }

  /**
   * Pulls a clip into the HTTP cache on a single shared element.
   *
   * ponytail: one warming slot, so warming the current track discards a queued
   * next track. They fire at opposite ends of playback, so in practice they
   * don't collide; give them an element each if that ever stops being true.
   */
  private warm(src: string | undefined) {
    if (typeof window === "undefined" || !src) return;

    if (!this.prefetch) {
      this.prefetch = new Audio();
      this.prefetch.preload = "auto";
      this.prefetch.volume = 0;
      // A failed warm-up is not worth surfacing: the real element will retry
      // on play and route any genuine failure through its own error handler.
      this.prefetch.addEventListener("error", () => {});
    }

    if (this.prefetch.getAttribute("src") !== src) {
      this.prefetch.src = src;
      this.prefetch.load();
    }
  }

  /**
   * Warms the track that is cued up, on hover or focus of the radio. Turns the
   * first press of play from a cold round trip into a cache hit, and costs
   * nothing for the visitors who never reach for it.
   */
  public warmCurrent() {
    if (!this.isEnabled || this.isPlaying) return;
    this.warm(VINTAGE_TRACKS[this.currentTrackIndex]?.src);
  }

  private syncAudioSource() {
    const audio = this.initAudio();
    if (!audio) return;

    const track = VINTAGE_TRACKS[this.currentTrackIndex];
    if (!track) return;

    // Only update src if it differs
    const currentSrc = audio.getAttribute("src");
    if (currentSrc !== track.src) {
      audio.src = track.src;
      audio.load();
    }
    audio.volume = this.isMuted ? 0 : this.volume;
  }

  private cachedState: VintageRadioState | null = null;

  private notify() {
    this.updateCachedState();
    if (typeof window === "undefined") return;
    window.dispatchEvent(
      new CustomEvent("vintage-radio-change", { detail: this.cachedState })
    );
  }

  private updateCachedState(): VintageRadioState {
    const currentTrack =
      VINTAGE_TRACKS[this.currentTrackIndex] || VINTAGE_TRACKS[0];
    this.cachedState = {
      currentTrackIndex: this.currentTrackIndex,
      currentTrack,
      isPlaying: this.isPlaying,
      isMuted: this.isMuted,
      volume: this.volume,
      isMinimized: this.isMinimized,
      isEnabled: this.isEnabled,
    };
    return this.cachedState;
  }

  public getState(): VintageRadioState {
    if (!this.cachedState) {
      return this.updateCachedState();
    }
    return this.cachedState;
  }

  public async play(): Promise<boolean> {
    if (!this.isEnabled) return false;
    this.userPaused = false;
    this.syncAudioSource();
    const audio = this.initAudio();
    if (!audio) return false;

    audio.volume = this.isMuted ? 0 : this.volume;

    try {
      await audio.play();
      this.isPlaying = true;
      this.notify();
      this.prebufferNext();
      return true;
    } catch {
      // Browser autoplay restriction or interruption
      this.isPlaying = false;
      this.notify();
      return false;
    }
  }

  public pause(userInitiated: boolean = true) {
    if (userInitiated) {
      this.userPaused = true;
    }
    if (this.audio) {
      this.audio.pause();
    }
    this.isPlaying = false;
    this.notify();
  }

  public togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  public nextTrack(autoPlay: boolean = false) {
    // Prefer the track we already warmed; fall back if nothing is buffered yet.
    // A manual setTrack() can land on the queued index, which would stall here.
    const queued =
      this.nextTrackIndex >= 0 &&
      this.nextTrackIndex < VINTAGE_TRACKS.length &&
      this.nextTrackIndex !== this.currentTrackIndex;
    const nextIdx = queued ? this.nextTrackIndex : this.pickNextIndex();
    this.nextTrackIndex = -1;
    this.setTrack(nextIdx, autoPlay || this.isPlaying);
  }

  public prevTrack() {
    const prevIdx = (this.currentTrackIndex - 1 + VINTAGE_TRACKS.length) % VINTAGE_TRACKS.length;
    this.setTrack(prevIdx, this.isPlaying);
  }

  public setTrack(index: number, shouldPlay: boolean = false) {
    if (index < 0 || index >= VINTAGE_TRACKS.length) return;
    this.currentTrackIndex = index;
    this.syncAudioSource();
    this.notify();

    if (shouldPlay) {
      this.play();
    }
  }

  public setVolume(vol: number) {
    const clamped = Math.max(0, Math.min(1, vol));
    this.volume = clamped;
    if (this.audio) {
      this.audio.volume = this.isMuted ? 0 : clamped;
    }
    if (this.isMuted && clamped > 0) {
      this.isMuted = false;
    }
    try {
      localStorage.setItem(STORAGE_KEYS.VOLUME, clamped.toString());
    } catch {}
    this.notify();
  }

  public toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.audio) {
      this.audio.volume = this.isMuted ? 0 : this.volume;
    }
    try {
      localStorage.setItem(STORAGE_KEYS.MUTED, this.isMuted ? "true" : "false");
    } catch {}
    this.notify();
  }

  public setMinimized(minimized: boolean) {
    this.isMinimized = minimized;
    try {
      localStorage.setItem(
        STORAGE_KEYS.MINIMIZED,
        minimized ? "true" : "false"
      );
    } catch {}
    this.notify();
  }

  public toggleMinimized() {
    this.setMinimized(!this.isMinimized);
  }

  public setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
    if (!enabled) {
      this.userPaused = true;
      this.pause(true);
    }
    try {
      localStorage.setItem(STORAGE_KEYS.ENABLED, enabled ? "true" : "false");
    } catch {}
    this.notify();
  }

  /**
   * Starts playback on page load at low background volume (8%).
   * If browser autoplay policy prevents immediate unmuted audio, it arms a
   * one-time listener on the first user interaction (scroll, click, touch, keydown)
   * so audio begins seamlessly and continues uninterrupted.
   */
  public async startAutoplay() {
    if (typeof window === "undefined") return;
    if (this.autoplayAttempted || this.isPlaying || this.userPaused || !this.isEnabled) return;
    this.autoplayAttempted = true;

    const started = await this.play();
    if (started) return;

    // Autoplay was restricted by browser policy; start on first user interaction anywhere on the page
    const onFirstInteraction = async () => {
      this.disarmAutoplay();
      if (!this.isPlaying && !this.userPaused && this.isEnabled) {
        await this.play();
      }
    };

    const events = ["pointerdown", "keydown", "touchstart", "scroll", "click"] as const;
    for (const type of events) {
      window.addEventListener(type, onFirstInteraction, { once: true, passive: true });
    }

    this.cancelPendingAutoplay = () => {
      for (const type of events) {
        window.removeEventListener(type, onFirstInteraction);
      }
    };
  }

  /**
   * Disarms the pending first-interaction listeners, so a later click cannot
   * start playback somewhere the radio has no business playing (e.g. /admin).
   */
  public cancelAutoplay() {
    if (!this.cancelPendingAutoplay) return;
    this.disarmAutoplay();
    // Let a later mount on a normal route arm autoplay again.
    this.autoplayAttempted = false;
  }

  private disarmAutoplay() {
    this.cancelPendingAutoplay?.();
    this.cancelPendingAutoplay = null;
  }
}

export const vintageRadio = new VintageRadioManager();

