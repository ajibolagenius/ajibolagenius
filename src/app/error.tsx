"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowClockwise, House, WarningCircle } from "@phosphor-icons/react";
import { useLanguage } from "@/lib/i18n";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useLanguage();

  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-1 flex-col items-center justify-center bg-cream px-6 py-24 text-center">
      <div className="mx-auto flex w-full max-w-md flex-col items-center gap-5">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/10 text-accent">
          <WarningCircle size={32} weight="duotone" />
        </span>

        <h1 className="text-h2 font-normal">Something went wrong</h1>

        <p className="text-body-m text-ink/60">
          An unexpected error occurred while loading this page. You can try reloading or return to the homepage.
        </p>

        {error.digest && (
          <p className="font-mono text-body-xs text-ink/40">
            Error reference: {error.digest}
          </p>
        )}

        <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 bg-ink px-4 py-2.5 text-body-s font-medium text-cream transition-opacity hover:opacity-90 cursor-pointer"
          >
            <ArrowClockwise size={16} weight="bold" />
            {t.actions.tryAgain}
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 border border-ink/20 bg-panel px-4 py-2.5 text-body-s font-medium text-ink transition-colors hover:border-ink/40"
          >
            <House size={16} weight="duotone" />
            {t.actions.returnHome}
          </Link>
        </div>
      </div>
    </div>
  );
}
