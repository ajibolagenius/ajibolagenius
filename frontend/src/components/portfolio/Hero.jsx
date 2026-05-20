import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Download } from 'lucide-react';
import { fetchPersonalInfo } from '../../services/api';
import { useRealtimeQuery } from '../../hooks/useRealtimeQuery';
import { useLocale } from '../../contexts/LocaleContext';
import Ticker from './Ticker';
import { HeroSkeleton } from './SkeletonLayouts';

const Hero = () => {
  const [visible, setVisible] = useState(false);
  const heroRef = useRef(null);
  const { data: info, loading } = useRealtimeQuery('personal_info', fetchPersonalInfo);
  const { t } = useLocale();

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const data = info;

  if (loading || !data) {
    return (
      <section className="relative flex flex-col overflow-hidden h-[calc(100dvh-120px)] md:h-[calc(100dvh-56px)]">
        <HeroSkeleton />
        <div className="relative z-10 flex-shrink-0"><Ticker /></div>
      </section>
    );
  }

  return (
    <section
      ref={heroRef}
      className="relative flex flex-col overflow-hidden h-[calc(100dvh-120px)] md:h-[calc(100dvh-56px)] editorial-band"
    >
      {/* Main hero content — flex-1 + min-h-0 so it actually shrinks, keeping ticker visible */}
      <div className="flex-1 min-h-0 flex items-center relative z-10 overflow-hidden">
        <div className="max-w-[1160px] mx-auto px-4 md:px-8 w-full">
          <div
            className="transition-all duration-1000"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(30px)'
            }}
          >
            <div
              className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.18em] uppercase mb-6 px-[12px] py-[6px] border border-[var(--border-md)] bg-[var(--surface)]"
              style={{ color: 'var(--sungold)' }}
            >
              <span className="text-[7px]">◆</span>
              Editorial Studio {new Date().getFullYear()}
            </div>

            <h1
              className="hero-h1 font-display font-extrabold leading-[0.92] tracking-[-0.04em] mb-6 max-w-[11ch]"
            >
              <span className="block text-[var(--white)]">
                {data.tagline || data.tagline_suffix || 'I build things that work'}
              </span>
              <span className="block text-[var(--subtle)]">
                {data.tagline_suffix || data.taglineSuffix || 'and things that feel right.'}
              </span>
            </h1>

            <p className="font-body text-[17px] leading-[1.7] mb-8 max-w-[560px] text-[var(--muted)]">
              {data.description}
            </p>

            <p className="font-mono text-[10px] tracking-[0.14em] uppercase mb-10 text-[var(--subtle)]">
              {data.role}
            </p>

            <div className="flex gap-3 flex-wrap">
              <Link
                to="/work"
                className="btn-primary inline-flex items-center gap-2 font-display text-[13px] font-semibold tracking-[0.04em] px-[22px] py-[11px] border-0 rounded-none no-underline transition-all duration-200 bg-[var(--sungold)] text-[var(--void)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sungold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--void)]"
              >
                {t('hero_view_projects')}
                <ArrowRight size={14} />
              </Link>
              <Link
                to="/cv"
                className="btn-ghost inline-flex items-center gap-2 font-display text-[13px] font-semibold tracking-[0.04em] px-[22px] py-[11px] rounded-none no-underline cursor-pointer transition-all duration-200 bg-transparent text-[var(--white)] border border-[var(--border-md)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sungold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--void)]"
              >
                <Download size={14} />
                {t('hero_download_cv')}
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-[720px]">
              {[
                ['Selected', 'Work, writing, teaching'],
                ['Base', 'Nigeria / remote / global'],
                ['Mode', 'Minimal, editorial, readable'],
              ].map(([label, value]) => (
                <div key={label} className="editorial-panel p-4">
                  <div className="font-mono text-[10px] tracking-[0.14em] uppercase text-[var(--subtle)] mb-2">{label}</div>
                  <div className="font-display text-[15px] text-[var(--white)] leading-[1.35]">{value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Ticker anchored to bottom of first viewport */}
      <div className="relative z-10 flex-shrink-0">
        <Ticker />
      </div>
    </section>
  );
};

export default Hero;
