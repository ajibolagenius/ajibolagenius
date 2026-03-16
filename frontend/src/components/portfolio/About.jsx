import React, { useEffect, useRef, useState } from 'react';
import { aboutData, skills, homeAboutSnapshot } from '../../data/mock';
import { fetchPersonalInfo } from '../../services/api';
import { personalInfo as fallbackInfo } from '../../data/mock';
import { useRealtimeQuery } from '../../hooks/useRealtimeQuery';

const About = ({ snapshot = false }) => {
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);
  const { data: info } = useRealtimeQuery('personal_info', fetchPersonalInfo, fallbackInfo);

  // Use fetched description if available, otherwise fall back to mock
  const bodyCopy = snapshot
    ? (info?.description || homeAboutSnapshot)
    : (info?.description || aboutData.body);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="py-12 md:py-20 border-b border-[var(--border)]"
    >
      <div className="max-w-[1160px] mx-auto px-4 md:px-8 pt-12 md:pt-20">
        <div
          className="transition-all duration-700"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(24px)'
          }}
        >
          {/* Section kicker */}
          <div className="flex items-center gap-2 mb-3">
            <div className="w-5 h-px bg-[var(--sungold)]" />
            <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-[var(--sungold)]">
              01 — About
            </span>
          </div>

          {/* Title */}
          <h2
            className="font-display font-extrabold leading-[1.1] tracking-[-0.02em] mb-3 text-[var(--white)]"
            style={{ fontSize: 'clamp(28px, 4vw, 42px)' }}
          >
            {aboutData.headline}
          </h2>

          {/* Description — snapshot: 2–3 sentences on Home (design-system Site Map) */}
          <p
            className="font-body text-[15px] leading-[1.7] max-w-[520px] text-[var(--muted)]"
            style={{ marginBottom: snapshot ? 24 : 40 }}
          >
            {bodyCopy}
          </p>

          {!snapshot && (
          <>
          {/* Stats grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {aboutData.stats.map((stat, i) => (
              <div
                key={i}
                className="p-5 bg-[var(--surface)] border border-[var(--border)] rounded-none"
              >
                <div className="font-display text-[28px] font-extrabold mb-1 text-[var(--sungold)]">
                  {stat.value}
                </div>
                <div className="font-mono text-[10px] tracking-[0.12em] uppercase text-[var(--subtle)]">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Skills */}
          <div className="flex items-center gap-2 mb-6">
            <div className="w-5 h-px bg-[var(--stardust)]" />
            <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-[var(--stardust)]">
              Skills & Tools
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {skills.map((skill, i) => (
              <div key={i} className="flex items-center gap-4">
                <span className="font-mono text-[12px] tracking-[0.04em] min-w-[180px] text-[var(--muted)]">
                  {skill.name}
                </span>
                <div className="flex-1 h-[3px] relative bg-[var(--elevated)]">
                  <div
                    className="absolute top-0 left-0 h-full transition-all duration-1000 rounded-none bg-[var(--sungold)]"
                    style={{
                      width: visible ? `${skill.level}%` : '0%',
                      transitionDelay: `${i * 100}ms`
                    }}
                  />
                </div>
                <span className="font-mono text-[11px] text-[var(--subtle)]">
                  {skill.level}%
                </span>
              </div>
            ))}
          </div>
          </>
          )}
        </div>
      </div>
    </section>
  );
};

export default About;
