"use client";

import { useSyncExternalStore } from "react";
import {
  CheckCircle,
  Info,
  WarningCircle,
  X,
} from "@phosphor-icons/react/dist/ssr";
import { toast, toastStore, type ToastTone } from "@/lib/toast";

/**
 * The single toast viewport, mounted once in the root layout so both the
 * client-facing pages and /admin share one stack.
 *
 * Bottom-right on desktop: the top-right corner is occupied by the CV page's
 * fixed download button, and the left edge by the marquee rail. On mobile it
 * spans the width, above the safe-area inset.
 */

const TONE = {
  success: {
    Icon: CheckCircle,
    // Tone is carried by a 2px rule rather than a filled panel — the site's
    // surfaces are all hairline-bordered, and a coloured block would read as a
    // foreign element.
    rule: "bg-emerald-600 dark:bg-emerald-400",
    icon: "text-emerald-600 dark:text-emerald-400",
  },
  error: {
    Icon: WarningCircle,
    rule: "bg-red-600 dark:bg-red-400",
    icon: "text-red-600 dark:text-red-400",
  },
  info: {
    Icon: Info,
    rule: "bg-accent",
    icon: "text-accent",
  },
} satisfies Record<ToastTone, unknown>;

export function Toaster() {
  const toasts = useSyncExternalStore(
    toastStore.subscribe,
    toastStore.getSnapshot,
    toastStore.getServerSnapshot,
  );

  return (
    <div
      // aria-live on the container, not the item: the region has to exist in
      // the DOM before the toast is inserted for assistive tech to announce it.
      aria-live="polite"
      aria-atomic="false"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex flex-col items-center gap-2 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:inset-x-auto sm:right-6 sm:items-end sm:pb-6 print:hidden"
      onMouseEnter={toastStore.pause}
      onMouseLeave={toastStore.resume}
      onFocusCapture={toastStore.pause}
      onBlurCapture={toastStore.resume}
    >
      {toasts.map((item) => {
        const tone = TONE[item.tone];
        return (
          <div
            key={item.id}
            role="status"
            data-leaving={item.leaving ? "" : undefined}
            className="toast pointer-events-auto flex w-full max-w-sm items-start gap-3 border border-ink/10 bg-panel py-3 pl-0 pr-3 shadow-lg"
          >
            <span
              aria-hidden
              className={`h-full min-h-[2.5rem] w-[2px] shrink-0 self-stretch ${tone.rule}`}
            />
            <tone.Icon
              weight="duotone"
              size={18}
              className={`mt-px shrink-0 ${tone.icon}`}
            />
            <div className="min-w-0 flex-1">
              <p className="text-body-s font-medium text-ink">{item.message}</p>
              {item.description && (
                <p className="mt-0.5 text-body-xs text-ink/60">
                  {item.description}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => toast.dismiss(item.id)}
              aria-label="Dismiss notification"
              className="-mr-1 shrink-0 p-1 text-ink/40 transition-colors duration-[var(--dur-1)] hover:text-ink"
            >
              <X weight="bold" size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
