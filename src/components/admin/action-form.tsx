"use client";

import { useRef, useTransition, type ReactNode } from "react";
import type { ActionResult } from "@/lib/action-result";
import { toast } from "@/lib/toast";

/**
 * A <form> whose server action returns an ActionResult, toasted on completion.
 *
 * Submitted manually rather than through the `action` prop because the plain
 * form action discards the return value — the whole point here is to get the
 * result back and show it. The fields themselves stay server-rendered and are
 * passed through as children.
 */
export function ActionForm({
  action,
  children,
  className,
  /** Cleared on success — for create forms, so the next entry starts empty. */
  resetOnSuccess = false,
}: {
  action: (formData: FormData) => Promise<ActionResult>;
  children: ReactNode;
  className?: string;
  resetOnSuccess?: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      className={className}
      onSubmit={(event) => {
        event.preventDefault();
        const form = event.currentTarget;
        const formData = new FormData(form);

        startTransition(async () => {
          try {
            const result = await action(formData);
            if (result.ok) {
              toast.success(result.message);
              if (resetOnSuccess) form.reset();
            } else {
              toast.error(result.message);
            }
          } catch {
            toast.error("That didn't go through. Please try again.");
          }
        });
      }}
      // Disables every control inside for the duration, so a second submit
      // can't race the first. Cheaper and more complete than threading a
      // pending flag into each server-rendered field.
      aria-busy={pending || undefined}
    >
      <fieldset
        disabled={pending}
        className="flex min-w-0 flex-col gap-3 disabled:opacity-70"
      >
        {children}
      </fieldset>
    </form>
  );
}
