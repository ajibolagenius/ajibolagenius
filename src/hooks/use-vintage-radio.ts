"use client";

import { useSyncExternalStore } from "react";
import { vintageRadio, type VintageRadioState } from "@/lib/vintage-radio";
import { VINTAGE_TRACKS } from "@/lib/vintage-radio-tracks";

function subscribeVintageRadio(callback: () => void) {
  window.addEventListener("vintage-radio-change", callback);
  return () => window.removeEventListener("vintage-radio-change", callback);
}

function getVintageRadioSnapshot(): VintageRadioState {
  return vintageRadio.getState();
}

const SERVER_SNAPSHOT: VintageRadioState = {
  currentTrackIndex: 0,
  currentTrack: VINTAGE_TRACKS[0],
  isPlaying: false,
  isMuted: false,
  volume: 0.08,
  isMinimized: false,
  isEnabled: true,
};

function getVintageRadioServerSnapshot(): VintageRadioState {
  return SERVER_SNAPSHOT;
}

export function useVintageRadio(): VintageRadioState {
  return useSyncExternalStore(
    subscribeVintageRadio,
    getVintageRadioSnapshot,
    getVintageRadioServerSnapshot
  );
}
