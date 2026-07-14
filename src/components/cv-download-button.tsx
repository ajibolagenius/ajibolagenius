"use client";

import { DownloadSimple } from "@phosphor-icons/react/dist/ssr";

export function CvDownloadButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="fixed right-6 top-6 z-40 flex items-center gap-2 bg-ink px-4 py-2.5 text-body-s font-medium text-cream shadow-lg transition-colors hover:bg-accent print:hidden"
    >
      <DownloadSimple weight="duotone" size={16} />
      Download PDF
    </button>
  );
}
