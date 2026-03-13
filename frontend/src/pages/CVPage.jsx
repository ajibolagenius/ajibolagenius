import React, { useState, useRef, useEffect } from 'react';
import { Download, Briefcase, GraduationCap, Award, Wrench } from 'lucide-react';
import { fetchTimeline } from '../services/api';
import { timeline as fbTimeline, skills, cvData } from '../data/mock';
import { techStackForCV } from '../data/techStack';
import { KenteDivider } from '../components/portfolio/About';

const accentColors = {
  sungold: { bg: '#E8A020', shadow: 'rgba(232,160,32,0.2)' },
  nebula: { bg: '#5B4FD8', shadow: 'rgba(91,79,216,0.2)' },
  stardust: { bg: '#1CB8D4', shadow: 'rgba(28,184,212,0.2)' },
  terracotta: { bg: '#C94B2D', shadow: 'rgba(201,75,45,0.2)' }
};

const CVPage = () => {
  const [visible, setVisible] = useState(false);
  const [timeline, setTimeline] = useState([]);
  const ref = useRef(null);

  useEffect(() => {
    fetchTimeline().then(setTimeline).catch(() => setTimeline(fbTimeline));
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <section className="pt-20 pb-10" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-[1160px] mx-auto px-8">
          <div className="flex items-center gap-2 mb-3"><div className="w-6 h-[1px]" style={{ background: '#E8A020' }} /><span className="font-mono text-[11px] tracking-[0.2em] uppercase" style={{ color: '#E8A020' }}>CV / Resumé</span></div>
          <h1 className="font-display font-extrabold leading-[1.05] tracking-[-0.03em] mb-4" style={{ fontSize: 'clamp(36px, 6vw, 64px)' }}>Experience & Skills</h1>
          <p className="font-body text-[17px] leading-[1.7] max-w-[560px] mb-8" style={{ color: 'rgba(242,239,232,0.55)' }}>A detailed overview of my journey, skills, tools, and qualifications.</p>
          <button className="inline-flex items-center gap-2 font-display text-[13px] font-semibold px-[22px] py-[11px] border-none cursor-pointer" style={{ background: '#E8A020', color: '#07070F', borderRadius: 0 }}><Download size={14} /> Download PDF</button>
        </div>
      </section>
      <KenteDivider />
      <section className="py-16" ref={ref}>
        <div className="max-w-[1160px] mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-16">
            <div>
              <div className="flex items-center gap-3 mb-8"><Briefcase size={16} style={{ color: '#E8A020' }} /><span className="font-mono text-[11px] tracking-[0.2em] uppercase" style={{ color: '#E8A020' }}>Experience Timeline</span></div>
              <div className="relative pl-7">
                <div className="absolute left-0 top-0 w-[2px] transition-all duration-1000" style={{ height: visible ? '100%' : '0%', background: '#E8A020' }} />
                {timeline.map((item, i) => {
                  const accent = accentColors[item.accent] || accentColors.sungold;
                  return (
                    <div key={i} className="relative mb-8 last:mb-0 transition-all duration-600" style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)', transitionDelay: `${i * 150}ms` }}>
                      <div className="absolute -left-[25px] top-[5px] w-[10px] h-[10px]" style={{ background: accent.bg, border: '2px solid #07070F', boxShadow: `0 0 0 3px ${accent.shadow}`, borderRadius: 0 }} />
                      <div className="font-mono text-[11px] mb-1" style={{ color: '#1CB8D4' }}>{item.year}</div>
                      <h3 className="font-display text-[16px] font-semibold mb-1" style={{ color: '#F2EFE8' }}>{item.title}</h3>
                      <p className="font-body text-[13px] leading-[1.6]" style={{ color: 'rgba(242,239,232,0.55)' }}>{item.body}</p>
                    </div>
                  );
                })}
              </div>
              <div className="mt-16">
                <div className="flex items-center gap-3 mb-8"><GraduationCap size={16} style={{ color: '#8B72F0' }} /><span className="font-mono text-[11px] tracking-[0.2em] uppercase" style={{ color: '#8B72F0' }}>Education</span></div>
                {cvData.education.map((edu, i) => (
                  <div key={i} className="p-5 mb-3" style={{ background: '#111126', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 0 }}>
                    <div className="font-mono text-[11px] mb-1" style={{ color: '#1CB8D4' }}>{edu.year}</div>
                    <h3 className="font-display text-[15px] font-semibold mb-1" style={{ color: '#F2EFE8' }}>{edu.degree}</h3>
                    <p className="font-body text-[13px]" style={{ color: 'rgba(242,239,232,0.55)' }}>{edu.school}</p>
                  </div>
                ))}
              </div>
              <div className="mt-12">
                <div className="flex items-center gap-3 mb-6"><Award size={16} style={{ color: '#E8A020' }} /><span className="font-mono text-[11px] tracking-[0.2em] uppercase" style={{ color: '#E8A020' }}>Certifications</span></div>
                <div className="flex flex-col gap-2">
                  {cvData.certifications.map((cert, i) => (
                    <div key={i} className="flex items-center gap-3 p-3" style={{ background: '#111126', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 0 }}>
                      <span className="w-1.5 h-1.5 flex-shrink-0" style={{ background: '#E8A020', borderRadius: 0 }} />
                      <span className="font-body text-[13px]" style={{ color: 'rgba(242,239,232,0.65)' }}>{cert}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-6"><span className="font-mono text-[11px] tracking-[0.2em] uppercase" style={{ color: '#1CB8D4' }}>Skills Proficiency</span></div>
                <div className="flex flex-col gap-4">
                  {skills.map((skill, i) => (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono text-[12px]" style={{ color: 'rgba(242,239,232,0.55)' }}>{skill.name}</span>
                        <span className="font-mono text-[11px]" style={{ color: 'rgba(242,239,232,0.3)' }}>{skill.level}%</span>
                      </div>
                      <div className="h-[3px]" style={{ background: '#17172E' }}>
                        <div className="h-full transition-all duration-1000" style={{ width: visible ? `${skill.level}%` : '0%', background: '#E8A020', transitionDelay: `${i * 80}ms`, borderRadius: 0 }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-3 mb-6"><Wrench size={14} style={{ color: '#E8A020' }} /><span className="font-mono text-[11px] tracking-[0.2em] uppercase" style={{ color: '#E8A020' }}>Tools & Stack</span></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {techStackForCV.map((tool, i) => (
                    <div key={i} className="p-3" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 0 }}>
                      <div className="font-display text-[13px] font-semibold text-[var(--white)]">{tool.name}</div>
                      <div className="font-mono text-[10px] text-[var(--subtle)]">{tool.category}</div>
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
