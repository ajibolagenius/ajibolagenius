"use client";

import { ArrowClockwise } from "@phosphor-icons/react/dist/ssr";

export function UpdateModal({
  onUpdate,
  updating,
}: {
  onUpdate: () => void;
  updating: boolean;
}) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/60 p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="update-modal-title"
    >
      <div className="w-full max-w-sm bg-cream p-6 shadow-lg">
        <div className="flex flex-col gap-2">
          <h2 id="update-modal-title" className="text-h3 font-normal text-ink">
            A new version is available
          </h2>
          <p className="text-body-s text-ink/60">
            This app has been updated with new changes. Refresh to update to
            the latest version.
          </p>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onUpdate}
            disabled={updating}
            className="inline-flex items-center gap-2 bg-accent px-4 py-2 text-body-s font-medium text-cream transition-colors hover:bg-accent/90 disabled:opacity-60"
          >
            <ArrowClockwise
              weight="bold"
              size={16}
              className={updating ? "animate-spin" : undefined}
            />
            {updating ? "Updating…" : "Update now"}
          </button>
        </div>
      </div>
    </div>
  );
}
