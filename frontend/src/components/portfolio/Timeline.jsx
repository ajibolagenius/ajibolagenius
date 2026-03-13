import React, { useEffect, useRef, useState } from 'react';
import { fetchTimeline } from '../../services/api';
import { timeline as fbTimeline } from '../../data/mock';

const accentColors = {
  sungold: { bg: '#E8A020', shadow: 'rgba(232,160,32,0.2)' },
  nebula: { bg: '#5B4FD8', shadow: 'rgba(91,79,216,0.2)' },
  stardust: { bg: '#1CB8D4', shadow: 'rgba(28,184,212,0.2)' },
  terracotta: { bg: '#C94B2D', shadow: 'rgba(201,75,45,0.2)' }
};

const Timeline = () => {
  const [visible, setVisible] = useState(false);
  const [timeline, setTimeline] = useState([]);
  const sectionRef = useRef(null);

  useEffect(() => {
    fetchTimeline().then(setTimeline).catch(() => setTimeline(fbTimeline));
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="timeline" ref={sectionRef} className="py-20 border-b border-[var(--border)]">
      <div className="max-w-[1160px] mx-auto px-8">
        <div className="flex items-center gap-2 mb-3"><div className="w-5 h-px bg-[var(--sungold)]" /><span className="font-mono text-[11px] tracking-[0.2em] uppercase text-[var(--sungold)]">04 — Experience</span></div>
        <h2 className="font-display font-extrabold leading-[1.1] tracking-[-0.02em] mb-3 text-[var(--white)]" style={{ fontSize: 'clamp(28px, 4vw, 42px)' }}>Journey So Far</h2>
        <p className="font-body text-[15px] leading-[1.7] mb-12 max-w-[520px] text-[var(--muted)]">A timeline of key milestones in my career — from learning to building to teaching.</p>
        <div className="relative pl-7">
          <div className="absolute left-[6px] top-0 w-px transition-all duration-1000 bg-[var(--sungold)]" style={{ height: visible ? '100%' : '0%' }} />
          {timeline.map((item, i) => {
            const accent = accentColors[item.accent] || accentColors.sungold;
            return (
              <div key={i} className="relative mb-8 last:mb-0 transition-all duration-600" style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)', transitionDelay: `${i * 150}ms` }}>
                <div className="absolute -left-[27px] top-[5px] w-[10px] h-[10px] rounded-none border-2 border-[var(--void)]" style={{ background: accent.bg, boxShadow: 'var(--shadow-sharp-ring)' }} />
                <div className="font-mono text-[11px] mb-1 text-[var(--stardust)]">{item.year}</div>
                <h3 className="font-display text-[15px] font-semibold mb-1 text-[var(--white)]">{item.title}</h3>
                <p className="font-body text-[13px] leading-[1.6] text-[var(--muted)]">{item.body}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Timeline;
