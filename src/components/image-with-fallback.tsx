"use client";

import Image, { type ImageProps } from "next/image";
import { useState, type ReactNode } from "react";
import { track } from "@/lib/analytics";

/**
 * next/image with a real failure state.
 *
 * next/image has no built-in fallback, so a failed fetch — an unreachable
 * storage object, a network status 0 — paints the browser's broken-image icon.
 * The existing placeholder only covers a missing source, never a failed load.
 * On error this swaps in the caller's placeholder and records one
 * `image_load_failed` event, so the failure is measurable.
 */
export function ImageWithFallback({
  fallback,
  alt,
  ...props
}: ImageProps & { fallback: ReactNode }) {
  const [failed, setFailed] = useState(false);

  if (failed) return <>{fallback}</>;

  return (
    <Image
      {...props}
      alt={alt}
      onError={() => {
        track("image_load_failed", {
          src: typeof props.src === "string" ? props.src : undefined,
        });
        setFailed(true);
      }}
    />
  );
}
