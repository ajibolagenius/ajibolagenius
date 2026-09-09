"use client";

import { useSyncExternalStore } from "react";
import {
  SpeakerSimpleHigh,
  SpeakerSimpleSlash,
} from "@phosphor-icons/react/dist/ssr";
import { sound } from "@/lib/sound";

function subscribeSound(callback: () => void) {
  window.addEventListener("portfolio-sound-change", callback);
  return () => window.removeEventListener("portfolio-sound-change", callback);
}

function getSoundSnapshot() {
  return sound.isEnabled();
}

function getSoundServerSnapshot() {
  return false;
}

export function SoundToggle({ className }: { className?: string }) {
  const isEnabled = useSyncExternalStore(
    subscribeSound,
    getSoundSnapshot,
    getSoundServerSnapshot,
  );

  const handleToggle = () => {
    sound.toggle();
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={
        isEnabled ? "Disable audio sound effects" : "Enable tactile sound effects"
      }
      title={
        isEnabled ? "Audio effects active (Click to mute)" : "Enable tactile sound effects (Web Audio)"
      }
      className={`group relative flex items-center justify-center p-1.5 text-ink/60 transition-colors duration-[var(--dur-2)] hover:text-ink active:scale-95 ${
        className || ""
      }`}
    >
      {isEnabled ? (
        <SpeakerSimpleHigh
          weight="duotone"
          size={18}
          className="text-accent transition-transform duration-[var(--dur-2)] group-hover:scale-110"
        />
      ) : (
        <SpeakerSimpleSlash
          weight="regular"
          size={18}
          className="text-ink/40 transition-transform duration-[var(--dur-2)] group-hover:text-ink group-hover:scale-110"
        />
      )}
    </button>
  );
}
