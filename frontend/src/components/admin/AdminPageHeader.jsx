import React from 'react';
import { motion } from 'framer-motion';

/**
 * Admin section header — design system: kicker (Space Mono, sungold) + title (Syne) + optional subtitle.
 * Refined with motion entrance, corner accent, and bottom accent line.
 */
export default function AdminPageHeader({ kicker, title, subtitle }) {
  return (
    <motion.header
      className="mb-8 pb-6 border-b border-[var(--border)] relative"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {/* Corner accent */}
      <div className="absolute -top-px -left-px w-3 h-3 border-t border-l border-[var(--sungold)] opacity-40" />

      {kicker && (
        <div className="flex items-center gap-2 mb-2">
          <div className="w-5 h-px bg-[var(--sungold)]" aria-hidden />
          <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-[var(--sungold)]">
            {kicker}
          </span>
        </div>
      )}
      <h1
        className="font-display font-extrabold leading-[1.1] tracking-[-0.02em] text-[var(--white)]"
        style={{ fontSize: 'clamp(24px, 3vw, 36px)' }}
      >
        {title}
      </h1>
      {subtitle && (
        <p className="mt-2 font-body text-[15px] leading-[1.7] text-[var(--muted)] max-w-[560px]">
          {subtitle}
        </p>
      )}

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 w-12 h-px bg-[var(--sungold)]" />
    </motion.header>
  );
}
