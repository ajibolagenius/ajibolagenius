import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Download } from 'lucide-react';
import { fetchPersonalInfo } from '../../services/api';
import { personalInfo as fallbackInfo, tickerItems } from '../../data/mock';
import { useRealtimeQuery } from '../../hooks/useRealtimeQuery';
import { useLocale } from '../../contexts/LocaleContext';

const Ticker = () => {
  const items = [...tickerItems, ...tickerItems];
  return (
    <div
      className="w-full overflow-hidden bg-[var(--elevated)] border-t border-b border-[var(--border)] py-2"
    >
      <div className="ticker-track flex items-center gap-12 whitespace-nowrap font-mono text-[11px] tracking-[0.12em] uppercase text-[var(--subtle)]">
        {items.map((item, i) => (
          <span key={i} className="flex items-center gap-6">
            <span className="text-[var(--sungold)]">◆</span>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
};

const Hero = () => {
  const [visible, setVisible] = useState(false);
  const heroRef = useRef(null);
  const navigate = useNavigate();
  const { data: info } = useRealtimeQuery('personal_info', fetchPersonalInfo, fallbackInfo);
  const { t } = useLocale();

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const data = info || fallbackInfo;

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex flex-col overflow-hidden"
    >
      {/* Hero orbs — flat tint rectangles, blur 80px (Design System §08: no radial) */}
      <div
        className="absolute pointer-events-none w-[400px] h-[400px] -top-[80px] -right-[80px] blur-[80px]"
        style={{ background: 'var(--cosmic-glow)', borderRadius: 0 }}
      />
      <div
        className="absolute pointer-events-none w-[320px] h-[320px] bottom-0 -left-[40px] blur-[80px]"
        style={{ background: 'var(--warm-glow)', borderRadius: 0 }}
      />

      {/* Main hero content — flex-1 so ticker stays in first viewport */}
      <div className="flex-1 flex items-center relative z-10">
        <div className="max-w-[1160px] mx-auto px-4 md:px-8 w-full">
          <div
            className="transition-all duration-1000"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(30px)'
            }}
          >
            <div
              className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.15em] uppercase mb-6 px-[14px] py-[6px] border border-[rgba(232,160,32,0.3)]"
              style={{ color: 'var(--sungold)' }}
            >
              <span className="text-[7px]">◆</span>
              Portfolio 2024
            </div>

            <h1
              className="hero-h1 font-display font-extrabold leading-[0.95] tracking-[-0.03em] mb-6"
            >
              <span className="text-[var(--sungold)] block">
                {data.tagline || data.tagline_suffix}
              </span>
              <span className="block text-[var(--violet)]">
                {data.tagline_suffix || data.taglineSuffix}
              </span>
            </h1>

            <p className="font-body text-[17px] leading-[1.7] mb-8 max-w-[480px] text-[var(--muted)]">
              {data.description}
            </p>

            <p className="font-mono text-[11px] tracking-[0.12em] uppercase mb-10 text-[var(--subtle)]">
              {data.role}
            </p>

            <div className="flex gap-3 flex-wrap">
              <button
                className="btn-primary inline-flex items-center gap-2 font-display text-[13px] font-semibold tracking-[0.04em] px-[22px] py-[11px] border-0 cursor-pointer transition-all duration-200 bg-[var(--sungold)] text-[var(--void)]"
                onClick={() => navigate('/work')}
              >
                {t('hero_view_projects')}
                <ArrowRight size={14} />
              </button>
              <button
                className="btn-ghost inline-flex items-center gap-2 font-display text-[13px] font-semibold tracking-[0.04em] px-[22px] py-[11px] cursor-pointer transition-all duration-200 bg-transparent text-[var(--white)] border border-[var(--border-md)]"
                onClick={() => navigate('/cv')}
              >
                <Download size={14} />
                {t('hero_download_cv')}
              </button>
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
