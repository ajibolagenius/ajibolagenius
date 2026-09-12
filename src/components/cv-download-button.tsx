"use client";

import { DownloadSimple } from "@phosphor-icons/react/dist/ssr";
import { sound } from "@/lib/sound";
import { track } from "@/lib/analytics";

export function CvDownloadButton() {
  return (
    <button
      type="button"
      onClick={() => {
        sound.playTap();
        track("cv_download_requested");
        // window.print() blocks until the dialog closes, so anything after it
        // only runs once the visitor has accepted or cancelled. That is the
        // difference between a click and an actual download.
        window.print();
        track("cv_download_dialog_closed");
      }}
      className="fixed right-6 top-6 z-40 flex items-center gap-2 bg-ink px-4 py-2.5 text-body-s font-medium text-cream shadow-lg transition-colors hover:bg-accent print:hidden"
    >
      <DownloadSimple weight="duotone" size={16} />
      Download PDF
    </button>
  );
}
