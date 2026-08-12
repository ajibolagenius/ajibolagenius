"use client";

import { useState, useTransition, type ReactNode } from "react";
import type { ActionResult } from "@/lib/action-result";
import { toast } from "@/lib/toast";

/**
 * Runs a bound server action on click and reports the outcome as a toast.
 *
 * `type="button"`, always: several of these sit inside a <form> that submits a
 * different action, and a submit button would fire that instead. It also means
 * the action can be invoked directly rather than through form submission,
 * which is why it takes no FormData.
 */
export function ActionButton({
  action,
  children,
  className,
  confirm,
  pendingLabel,
  title,
  "aria-label": ariaLabel,
}: {
  action: () => Promise<ActionResult>;
  children: ReactNode;
  className?: string;
  /** When set, a window.confirm the user has to accept first. */
  confirm?: string;
  /** Replaces the label while the action is in flight. */
  pendingLabel?: ReactNode;
  title?: string;
  "aria-label"?: string;
}) {
  const [pending, startTransition] = useTransition();
  // Separate from `pending`: the transition ends when the server responds, but
  // the button must stay disabled through the router refresh that follows.
  const [done, setDone] = useState(false);

  const run = () => {
    if (confirm && !window.confirm(confirm)) return;

    startTransition(async () => {
      setDone(false);
      try {
        const result = await action();
        if (result.ok) toast.success(result.message);
        else toast.error(result.message);
      } catch {
        // A thrown action means the request never completed — a dropped
        // connection, a redirect, an unhandled server fault. Say so rather
        // than leaving the button silently stuck.
        toast.error("That didn't go through. Please try again.");
      } finally {
        setDone(true);
      }
    });
  };

  const busy = pending && !done;

  return (
    <button
      type="button"
      onClick={run}
      disabled={busy}
      title={title}
      aria-label={ariaLabel}
      aria-busy={busy || undefined}
      className={`${className ?? ""} disabled:cursor-progress disabled:opacity-60`}
    >
      {busy && pendingLabel ? pendingLabel : children}
    </button>
  );
}
