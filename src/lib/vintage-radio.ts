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
  hasStartedOnce: boolean;
}

class VintageRadioManager {
  private audio: HTMLAudioElement | null = null;
  private currentTrackIndex: number = 0;
  private isPlaying: boolean = false;
  private isMuted: boolean = false;
  private volume: number = 0.20; // Default low-mid background level (20%)
  private isMinimized: boolean = false;
  private isEnabled: boolean = true;
  private hasStartedOnce: boolean = false;
  private isInitialized: boolean = false;

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
    audio.preload = "none";
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
    this.isInitialized = true;
    return audio;
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
      hasStartedOnce: this.hasStartedOnce,
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
    this.hasStartedOnce = true;
    this.syncAudioSource();
    const audio = this.initAudio();
    if (!audio) return false;

    audio.volume = this.isMuted ? 0 : this.volume;

    try {
      await audio.play();
      this.isPlaying = true;
      this.notify();
      return true;
    } catch {
      // Browser autoplay restriction or interruption
      this.isPlaying = false;
      this.notify();
      return false;
    }
  }

  public pause() {
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
    // Pick random different track
    let nextIdx = Math.floor(Math.random() * VINTAGE_TRACKS.length);
    if (VINTAGE_TRACKS.length > 1 && nextIdx === this.currentTrackIndex) {
      nextIdx = (this.currentTrackIndex + 1) % VINTAGE_TRACKS.length;
    }
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
      this.pause();
    }
    try {
      localStorage.setItem(STORAGE_KEYS.ENABLED, enabled ? "true" : "false");
    } catch {}
    this.notify();
  }
}

export const vintageRadio = new VintageRadioManager();
