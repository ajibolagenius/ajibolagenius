"use client";

/**
 * Toast store.
 *
 * A module-level store rather than React context, for one reason: most callers
 * are not components. Server-action wrappers, the `catch` arm of a fetch, and
 * the flash-cookie reader all need to raise a toast without being handed a
 * hook, and a context would force every one of them to become a component or
 * thread a callback down. `useSyncExternalStore` is already the pattern used
 * for the admin form drafts, so this is consistent with the codebase.
 *
 * The only React-facing rule: `getSnapshot` must return a stable reference
 * between changes, so every mutation replaces the array and nothing is ever
 * mutated in place.
 */

export type ToastTone = "success" | "error" | "info";

export type ToastRecord = {
  id: string;
  tone: ToastTone;
  message: string;
  /** Optional second line — detail, not a repeat of the message. */
  description?: string;
  /** ms until auto-dismiss; 0 means "stay until dismissed". */
  duration: number;
  /** Set while the exit animation plays, just before removal. */
  leaving?: boolean;
};

export type ToastOptions = {
  description?: string;
  duration?: number;
};

/** Beyond three, the stack covers content and stops being readable. */
const MAX_VISIBLE = 3;

const DEFAULT_DURATION = 4500;
/** Errors usually carry something the reader has to act on, so they linger. */
const ERROR_DURATION = 7000;

/** Long enough for the exit animation in globals.css to finish. */
const EXIT_MS = 200;

const EMPTY: ToastRecord[] = [];

let records: ToastRecord[] = EMPTY;
let nextId = 0;
let paused = false;

const listeners = new Set<() => void>();

type Timer = {
  handle: ReturnType<typeof setTimeout>;
  /** ms left when the timer was last (re)started. */
  remaining: number;
  startedAt: number;
};

const timers = new Map<string, Timer>();

function notify() {
  for (const listener of listeners) listener();
}

function clearTimer(id: string) {
  const timer = timers.get(id);
  if (!timer) return;
  clearTimeout(timer.handle);
  timers.delete(id);
}

function startTimer(id: string, ms: number) {
  if (ms <= 0) return;
  timers.set(id, {
    handle: setTimeout(() => dismiss(id), ms),
    remaining: ms,
    startedAt: Date.now(),
  });
}

function show(
  tone: ToastTone,
  message: string,
  options: ToastOptions = {},
): string {
  const trimmed = message.trim();
  if (!trimmed) return "";

  const duration =
    options.duration ??
    (tone === "error" ? ERROR_DURATION : DEFAULT_DURATION);

  // A repeat of a toast that is still on screen restarts its clock instead of
  // stacking a duplicate. Double-clicking a save button should read as one
  // event, because it was one intent.
  const existing = records.find(
    (record) =>
      !record.leaving && record.tone === tone && record.message === trimmed,
  );
  if (existing) {
    clearTimer(existing.id);
    if (!paused) startTimer(existing.id, duration);
    return existing.id;
  }

  const id = String(++nextId);
  const record: ToastRecord = {
    id,
    tone,
    message: trimmed,
    description: options.description?.trim() || undefined,
    duration,
  };

  // Drop from the front: the oldest toast is the one the reader has had the
  // most time to see.
  const kept = records.filter((r) => !r.leaving).slice(-(MAX_VISIBLE - 1));
  for (const dropped of records.filter((r) => !kept.includes(r))) {
    clearTimer(dropped.id);
  }
  records = [...kept, record];

  if (!paused) startTimer(id, duration);
  notify();
  return id;
}

function dismiss(id: string) {
  clearTimer(id);
  const record = records.find((r) => r.id === id);
  if (!record || record.leaving) return;

  records = records.map((r) => (r.id === id ? { ...r, leaving: true } : r));
  notify();

  setTimeout(() => {
    records = records.filter((r) => r.id !== id);
    if (records.length === 0) records = EMPTY;
    notify();
  }, EXIT_MS);
}

/**
 * Freezes every auto-dismiss clock — called while the pointer is over the
 * stack, so a toast can't vanish out from under someone reading it.
 */
function pause() {
  if (paused) return;
  paused = true;
  const now = Date.now();
  for (const [id, timer] of timers) {
    clearTimeout(timer.handle);
    timers.set(id, {
      ...timer,
      remaining: timer.remaining - (now - timer.startedAt),
    });
  }
}

function resume() {
  if (!paused) return;
  paused = false;
  for (const [id, timer] of [...timers]) {
    timers.delete(id);
    startTimer(id, Math.max(timer.remaining, 600));
  }
}

export const toastStore = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  getSnapshot: () => records,
  /** Nothing has been raised during a server render, by definition. */
  getServerSnapshot: () => EMPTY,
  pause,
  resume,
};

export const toast = {
  success: (message: string, options?: ToastOptions) =>
    show("success", message, options),
  error: (message: string, options?: ToastOptions) =>
    show("error", message, options),
  info: (message: string, options?: ToastOptions) =>
    show("info", message, options),
  dismiss,
};
