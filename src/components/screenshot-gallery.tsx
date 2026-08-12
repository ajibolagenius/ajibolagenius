"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import { CaretLeft, CaretRight, X } from "@phosphor-icons/react/dist/ssr";
import { useFocusTrap } from "@/hooks/use-focus-trap";
import { useViewTransition } from "@/hooks/use-view-transition";

export function ScreenshotGallery({
  screenshots,
  alt,
}: {
  screenshots: string[];
  alt: string;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpenIndex(null), []);
  const transition = useViewTransition("lightbox");

  // Adds a focus trap, Escape, body scroll lock and focus restore — the
  // lightbox previously had none of the four.
  useFocusTrap(dialogRef, openIndex !== null, close);

  // Keep prev/next mounted (invisible) so arrow-key navigation doesn't
  // fetch + decode the image inside the interaction (INP).
  const prevIndex =
    openIndex === null
      ? null
      : (openIndex - 1 + screenshots.length) % screenshots.length;
  const nextIndex =
    openIndex === null ? null : (openIndex + 1) % screenshots.length;

  useEffect(() => {
    if (openIndex === null) return;
    const handleKey = (e: KeyboardEvent) => {
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
            onClick={() => transition(() => setOpenIndex(i))}
            style={
              openIndex === i
                ? undefined
                : ({ viewTransitionName: `shot-${i}` } as CSSProperties)
            }
            className="relative aspect-video w-full cursor-zoom-in overflow-hidden border border-ink/10 transition-transform duration-[var(--dur-3)] ease-out-quart hover:scale-[1.03]"
          >
            <Image
              src={src}
              alt={`${alt} screenshot ${i + 1}`}
              fill
              sizes="(max-width: 640px) 50vw, 33vw"
              className="object-cover object-top"
            />
          </button>
        ))}
      </div>

      {openIndex !== null && (
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={`${alt} screenshots`}
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/90 p-6"
          onClick={() => transition(close)}
        >
          <button
            type="button"
            onClick={() => transition(close)}
            className="absolute right-6 top-6 text-cream/70 transition-colors duration-[var(--dur-2)] hover:text-cream"
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
            {screenshots.map((src, i) => {
              if (i !== openIndex && i !== prevIndex && i !== nextIndex) {
                return null;
              }
              const active = i === openIndex;
              return (
                <Image
                  key={src}
                  src={src}
                  alt={active ? `${alt} screenshot ${i + 1}` : ""}
                  aria-hidden={!active}
                  fill
                  sizes="(max-width: 1024px) 100vw, 1024px"
                  style={
                    active
                      ? ({
                          viewTransitionName: `shot-${openIndex}`,
                        } as CSSProperties)
                      : undefined
                  }
                  className={`object-contain transition-[opacity,transform] duration-[var(--dur-3)] ease-out-quart ${
                    active
                      ? "scale-100 opacity-100"
                      : "pointer-events-none scale-[0.99] opacity-0"
                  }`}
                />
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
