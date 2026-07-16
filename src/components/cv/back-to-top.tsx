"use client";

export function BackToTop({ className }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={className}
    >
      Back to Top
    </button>
  );
}
