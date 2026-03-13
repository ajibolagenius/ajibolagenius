import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, BookOpen } from 'lucide-react';

/**
 * Home page CTA — design-system.html Site Map: "CTA — contact / courses"
 * Copy from design system Tone of Voice: contact + courses.
 */
const HomeCTA = () => {
  return (
    <section id="cta" className="py-20 border-b border-[var(--border)]">
      <div className="max-w-[1160px] mx-auto px-8">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-5 h-px bg-[var(--sungold)]" />
          <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-[var(--sungold)]">
            CTA
          </span>
        </div>
        <h2 className="font-display font-extrabold leading-[1.1] tracking-[-0.02em] mb-3 text-[var(--white)]" style={{ fontSize: 'clamp(28px, 4vw, 42px)' }}>
          Let&apos;s build something
        </h2>
        <p className="font-body text-[15px] leading-[1.7] mb-10 max-w-[520px] text-[var(--muted)]">
          Get in touch for projects, or explore courses and mentorship.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/contact"
            className="btn-primary inline-flex items-center gap-2 font-display text-[13px] font-semibold tracking-[0.04em] px-[22px] py-[11px] border-0 cursor-pointer no-underline transition-all duration-200 bg-[var(--sungold)] text-[var(--void)]"
          >
            <MessageCircle size={14} />
            Contact
          </Link>
          <Link
            to="/teach"
            className="btn-cosmic inline-flex items-center gap-2 font-display text-[13px] font-semibold tracking-[0.04em] px-[22px] py-[11px] border-0 cursor-pointer no-underline transition-all duration-200 bg-[var(--nebula)] text-[var(--white)]"
          >
            <BookOpen size={14} />
            View courses
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HomeCTA;
