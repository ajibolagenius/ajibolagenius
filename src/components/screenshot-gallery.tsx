"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { CaretLeft, CaretRight, X } from "@phosphor-icons/react/dist/ssr";

export function ScreenshotGallery({
  screenshots,
  alt,
}: {
  screenshots: string[];
  alt: string;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    if (openIndex === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenIndex(null);
      if (e.key === "ArrowRight") {
        setOpenIndex((i) => (i === null ? i : (i + 1) % screenshots.length));
      }
      if (e.key === "ArrowLeft") {
        setOpenIndex((i) =>
          i === null ? i : (i - 1 + screenshots.length) % screenshots.length,
        );
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [openIndex, screenshots.length]);

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {screenshots.map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => setOpenIndex(i)}
            className="relative aspect-video w-full cursor-zoom-in overflow-hidden border border-ink/10 transition-transform duration-300 hover:scale-[1.03]"
          >
            <Image
              src={src}
              alt={`${alt} screenshot ${i + 1}`}
              fill
              unoptimized
              className="object-cover object-top"
            />
          </button>
        ))}
      </div>

      {openIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/90 p-6"
          onClick={() => setOpenIndex(null)}
        >
          <button
            type="button"
            onClick={() => setOpenIndex(null)}
            className="absolute right-6 top-6 text-cream/70 transition-colors hover:text-cream"
            aria-label="Close"
          >
            <X size={28} weight="bold" />
          </button>

          {screenshots.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenIndex(
                    (i) => ((i ?? 0) - 1 + screenshots.length) % screenshots.length,
                  );
                }}
                className="absolute left-4 text-cream/70 transition-colors hover:text-cream sm:left-6"
                aria-label="Previous screenshot"
              >
                <CaretLeft size={32} weight="bold" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenIndex((i) => ((i ?? 0) + 1) % screenshots.length);
                }}
                className="absolute right-4 text-cream/70 transition-colors hover:text-cream sm:right-6"
                aria-label="Next screenshot"
              >
                <CaretRight size={32} weight="bold" />
              </button>
            </>
          )}

          <div
            className="relative h-full max-h-[85vh] w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={screenshots[openIndex]}
              alt={`${alt} screenshot ${openIndex + 1}`}
              fill
              unoptimized
              className="object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
}
