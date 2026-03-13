import React, { useState, useRef, useEffect } from 'react';
import { Download, Briefcase, GraduationCap, Award, Wrench } from 'lucide-react';
import { fetchTimeline } from '../services/api';
import { timeline as fbTimeline, skills, cvData } from '../data/mock';
import { techStackForCV } from '../data/techStack';
import Badge from '../components/portfolio/Badge';
import { BADGE_VARIANTS } from '../constants';

const ACCENT_COLORS = {
  sungold: { bg: 'var(--sungold)', ring: 'rgba(232,160,32,0.2)' },
  nebula: { bg: 'var(--nebula)', ring: 'rgba(91,79,216,0.2)' },
  stardust: { bg: 'var(--stardust)', ring: 'rgba(28,184,212,0.2)' },
  terracotta: { bg: 'var(--terracotta)', ring: 'rgba(201,75,45,0.2)' }
};

/** PDF URL for download - set in env as VITE_CV_PDF_URL or override in cvData */
const getPdfUrl = () => import.meta.env?.VITE_CV_PDF_URL || (typeof cvData?.pdfUrl === 'string' ? cvData.pdfUrl : '#');

const CVPage = () => {
  const [visible, setVisible] = useState(false);
  const [timeline, setTimeline] = useState([]);
  const sectionRef = useRef(null);

  useEffect(() => {
    fetchTimeline().then(setTimeline).catch(() => setTimeline(fbTimeline));
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const displayTimeline = timeline.length > 0 ? timeline : fbTimeline;

  return (
    <>
      <section className="pt-12 pb-8 md:pt-20 md:pb-10 border-b border-[var(--border)]">
        <div className="max-w-[1160px] mx-auto px-4 md:px-8">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-5 h-px bg-[var(--stardust)]" />
            <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-[var(--stardust)]">
              CV / Resumé
            </span>
          </div>
          <h1 className="font-display font-extrabold leading-[1.05] tracking-[-0.03em] mb-4 text-[var(--white)]" style={{ fontSize: 'clamp(36px, 6vw, 64px)' }}>
            Experience & Skills
          </h1>
          <p className="font-body text-[17px] leading-[1.7] max-w-[560px] mb-8 text-[var(--muted)]">
            A detailed overview of my journey, skills, tools, and qualifications.
          </p>
          <a
            href={getPdfUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex items-center gap-2 font-display text-[13px] font-semibold px-[22px] py-[11px] no-underline bg-[var(--sungold)] text-[var(--void)] border-0 rounded-none"
          >
            <Download size={14} /> Download PDF
          </a>
        </div>
      </section>

      <section className="py-12 md:py-16" ref={sectionRef}>
        <div className="max-w-[1160px] mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12 lg:gap-16">
            {/* Left: Interactive timeline + Education + Certifications */}
            <div>
              <div className="flex items-center gap-2 mb-8">
                <Briefcase size={16} className="text-[var(--sungold)]" />
                <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-[var(--sungold)]">
                  Experience Timeline
                </span>
              </div>
              <div className="relative pl-7">
                <div
                  className="absolute left-[6px] top-0 w-px bg-[var(--sungold)] transition-all duration-1000"
                  style={{ height: visible ? '100%' : '0%' }}
                />
                {displayTimeline.map((item, i) => {
                  const accent = ACCENT_COLORS[item.accent] || ACCENT_COLORS.sungold;
                  return (
                    <div
                      key={i}
                      className="relative mb-8 last:mb-0 transition-all duration-500"
                      style={{
                        opacity: visible ? 1 : 0,
                        transform: visible ? 'translateY(0)' : 'translateY(20px)',
                        transitionDelay: `${i * 120}ms`
                      }}
                    >
                      <div
                        className="absolute -left-[27px] top-[5px] w-[10px] h-[10px] border-2 border-[var(--void)]"
                        style={{
                          background: accent.bg,
                          boxShadow: `0 0 0 3px ${accent.ring}`,
                          borderRadius: 0
                        }}
                      />
                      <div className="font-mono text-[11px] mb-1 text-[var(--stardust)]">{item.year}</div>
                      <h3 className="font-display text-[15px] font-semibold mb-1 text-[var(--white)]">{item.title}</h3>
                      <p className="font-body text-[13px] leading-[1.6] text-[var(--muted)]">{item.body}</p>
                    </div>
                  );
                })}
              </div>

              <div className="mt-16">
                <div className="flex items-center gap-2 mb-6">
                  <GraduationCap size={16} className="text-[var(--violet)]" />
                  <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-[var(--violet)]">
                    Education
                  </span>
                </div>
                <div className="flex flex-col gap-3">
                  {cvData.education.map((edu, i) => (
                    <div key={i} className="p-5 bg-[var(--surface)] border border-[var(--border)]">
                      <div className="font-mono text-[11px] mb-1 text-[var(--stardust)]">{edu.year}</div>
                      <h3 className="font-display text-[15px] font-semibold mb-1 text-[var(--white)]">{edu.degree}</h3>
                      <p className="font-body text-[13px] text-[var(--muted)]">{edu.school}</p>
                      {edu.description && (
                        <p className="font-body text-[13px] mt-2 text-[var(--subtle)]">{edu.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-12">
                <div className="flex items-center gap-2 mb-6">
                  <Award size={16} className="text-[var(--sungold)]" />
                  <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-[var(--sungold)]">
                    Certifications
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  {cvData.certifications.map((cert, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-[var(--surface)] border border-[var(--border)]">
                      <span className="w-1.5 h-1.5 flex-shrink-0 bg-[var(--sungold)]" />
                      <span className="font-body text-[13px] text-[var(--muted)]">{cert}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Skills with proficiency + Tools & stack grid */}
            <div>
              <div className="mb-10">
                <div className="flex items-center gap-2 mb-6">
                  <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-[var(--stardust)]">
                    Skills with proficiency
                  </span>
                </div>
                <div className="flex flex-col gap-4">
                  {skills.map((skill, i) => (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono text-[12px] text-[var(--muted)]">{skill.name}</span>
                        <span className="font-mono text-[11px] text-[var(--subtle)]">{skill.level}%</span>
                      </div>
                      <div className="h-[3px] bg-[var(--elevated)] overflow-hidden">
                        <div
                          className="h-full bg-[var(--sungold)] transition-all duration-1000"
                          style={{
                            width: visible ? `${skill.level}%` : '0%',
                            transitionDelay: `${i * 80}ms`
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-6">
                  <Wrench size={14} className="text-[var(--sungold)]" />
                  <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-[var(--sungold)]">
                    Tools & Stack
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {techStackForCV.map((tool, i) => (
                    <div key={i} className="p-4 bg-[var(--surface)] border border-[var(--border)]">
                      <div className="font-display text-[13px] font-semibold text-[var(--white)]">{tool.name}</div>
                      <Badge variant={BADGE_VARIANTS[i % BADGE_VARIANTS.length]} className="mt-2">
                        {tool.category}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CVPage;
