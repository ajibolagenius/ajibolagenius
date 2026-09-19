"use client";

const STORAGE_KEY = "portfolio-sound-enabled";

/**
 * One note. Every sound in the app is a sine oscillator with an exponential
 * gain decay, optionally sweeping pitch — so the six public methods below are
 * the same three lines of Web Audio with different numbers.
 */
type Note = {
  /** Start frequency, Hz. */
  freq: number;
  /** Sweep to this frequency over `sweep` seconds. Omitted means hold. */
  to?: number;
  /** Seconds after the note starts to reach `to`. */
  sweep?: number;
  /** Seconds after the call to start this note. */
  at?: number;
  /** Starting gain. */
  peak: number;
  /** Seconds to decay to silence. */
  decay: number;
};

class SoundManager {
  private ctx: AudioContext | null = null;
  private enabled: boolean = false;

  constructor() {
    if (typeof window !== "undefined") {
      try {
        this.enabled = localStorage.getItem(STORAGE_KEY) === "true";
      } catch {
        this.enabled = false;
      }
    }
  }

  private initContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public setEnabled(enabled: boolean) {
    this.enabled = enabled;
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, enabled ? "true" : "false");
        window.dispatchEvent(
          new CustomEvent("portfolio-sound-change", { detail: { enabled } }),
        );
      } catch {}
    }
    if (enabled) {
      this.initContext();
      this.playChime();
    }
  }

  public toggle(): boolean {
    const next = !this.enabled;
    this.setEnabled(next);
    return next;
  }

  /**
   * Schedules every note on one shared context. A throw here is never worth
   * surfacing — the audio is decoration, and a browser that refuses to build
   * an oscillator should not take a click handler down with it.
   */
  private play(notes: Note[]) {
    if (!this.enabled) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      for (const { freq, to, sweep = 0.02, at = 0, peak, decay } of notes) {
        const start = now + at;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, start);
        if (to !== undefined) {
          osc.frequency.exponentialRampToValueAtTime(to, start + sweep);
        }

        gain.gain.setValueAtTime(peak, start);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + decay);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(start);
        // A hair past the decay, so the ramp finishes before the node stops.
        osc.stop(start + decay + 0.005);
      }
    } catch {}
  }

  /** Subtle mechanical tactile click (~6ms) */
  public playTap() {
    this.play([{ freq: 600, to: 140, sweep: 0.02, peak: 0.08, decay: 0.025 }]);
  }

  /** Gentle harmonic chime (e.g. for theme toggle or audio activation) */
  public playChime() {
    // C5, G5
    this.play(
      [523.25, 783.99].map((freq, i) => ({
        freq,
        at: i * 0.06,
        peak: 0.06,
        decay: 0.16,
      })),
    );
  }

  /** Soft modal/drawer open swell */
  public playDrawer() {
    this.play([{ freq: 240, to: 480, sweep: 0.06, peak: 0.04, decay: 0.07 }]);
  }

  /** Triumphant soft 3-tone arpeggio for match result */
  public playMatch() {
    // D5, F#5, A5
    this.play(
      [587.33, 739.99, 880.0].map((freq, i) => ({
        freq,
        at: i * 0.07,
        peak: 0.06,
        decay: 0.22,
      })),
    );
  }

  /** Soft low-frequency double tone for errors or failures */
  public playError() {
    this.play(
      [0, 0.08].map((at) => ({
        freq: 180,
        to: 110,
        sweep: 0.05,
        at,
        peak: 0.06,
        decay: 0.06,
      })),
    );
  }

  /** Ascending subtle pitch pip for pipeline/step progress */
  public playStep(stepIndex: number = 0) {
    const freq = 440 * (1 + (stepIndex % 8) * 0.12);
    this.play([
      { freq, to: freq * 1.15, sweep: 0.03, peak: 0.05, decay: 0.04 },
    ]);
  }
}

export const sound = new SoundManager();
