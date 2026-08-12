"use client";

import { useSyncExternalStore } from "react";

type Entry = {
  subscribe: (onStoreChange: () => void) => () => void;
  getSnapshot: () => boolean;
};

// One cached {subscribe, getSnapshot} pair per query. useSyncExternalStore
// resubscribes whenever these identities change, so they must be stable.
const cache = new Map<string, Entry>();

function entryFor(query: string): Entry {
  let entry = cache.get(query);
  if (!entry) {
    entry = {
      subscribe(onStoreChange) {
        const mq = window.matchMedia(query);
        mq.addEventListener("change", onStoreChange);
        return () => mq.removeEventListener("change", onStoreChange);
      },
      getSnapshot: () => window.matchMedia(query).matches,
    };
    cache.set(query, entry);
  }
  return entry;
}

const getServerSnapshot = () => false;

export function useMediaQuery(query: string) {
  const { subscribe, getSnapshot } = entryFor(query);
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
