import React from 'react';
import Hero from '../components/portfolio/Hero';
import About from '../components/portfolio/About';
import Projects from '../components/portfolio/Projects';
import HomeCTA from '../components/portfolio/HomeCTA';
import { Link } from 'react-router-dom';
import { ArrowRight, PencilLine, GraduationCap } from 'lucide-react';
import { usePageMeta } from '../hooks/usePageMeta';
import { buildPersonSchema } from '../lib/structuredData';
import { buildStaticPageMeta } from '../lib/routeMeta';

/**
 * Home — Hero (with ticker) · About (stats + Skills & Tools) · Featured projects · CTA
 */
const HomePage = () => {
  usePageMeta({
    ...buildStaticPageMeta('/'),
    structuredData: buildPersonSchema(),
  });
  return (
    <>
      <Hero />
      <About snapshot />
      <Projects featuredOnly />
      <section className="py-10 md:py-16 border-b border-[var(--border)]">
        <div className="max-w-[1160px] mx-auto px-4 md:px-8">
          <div className="grid gap-3 md:grid-cols-3">
            <Link
              to="/writing"
              className="group flex items-center justify-between gap-4 border border-[var(--border-md)] bg-[var(--surface)] px-4 py-4 no-underline transition-all duration-200 hover:border-[var(--sungold)]/30 hover:bg-[var(--elevated)]"
            >
              <span className="min-w-0">
                <span className="block font-mono text-[10px] tracking-[0.16em] uppercase text-[var(--sungold)] mb-2">Writing</span>
                <span className="block font-display text-[16px] text-[var(--white)]">Notes, essays, and build logs</span>
              </span>
              <PencilLine className="h-4 w-4 shrink-0 text-[var(--sungold)] transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/teach"
              className="group flex items-center justify-between gap-4 border border-[var(--border-md)] bg-[var(--surface)] px-4 py-4 no-underline transition-all duration-200 hover:border-[var(--nebula)]/30 hover:bg-[var(--elevated)]"
            >
              <span className="min-w-0">
                <span className="block font-mono text-[10px] tracking-[0.16em] uppercase text-[var(--nebula)] mb-2">Teaching</span>
                <span className="block font-display text-[16px] text-[var(--white)]">Courses, mentorship, and sessions</span>
              </span>
              <GraduationCap className="h-4 w-4 shrink-0 text-[var(--nebula)] transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/assets"
              className="group flex items-center justify-between gap-4 border border-[var(--border-md)] bg-[var(--surface)] px-4 py-4 no-underline transition-all duration-200 hover:border-[var(--stardust)]/30 hover:bg-[var(--elevated)]"
            >
              <span className="min-w-0">
                <span className="block font-mono text-[10px] tracking-[0.16em] uppercase text-[var(--stardust)] mb-2">Assets</span>
                <span className="block font-display text-[16px] text-[var(--white)]">Downloads, links, and decks</span>
              </span>
              <ArrowRight className="h-4 w-4 shrink-0 text-[var(--stardust)] transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </section>
      <HomeCTA />
    </>
  );
};

export default HomePage;
