import React, { useState, useRef, useEffect } from 'react';
import { Download, Briefcase, GraduationCap, Award, Wrench, Printer } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchTimeline, fetchEducation, fetchCertifications, fetchSkills } from '../services/api';
import { techStackForCV } from '../data/techStack';
import { cvData } from '../data/mock';
import Badge from '../components/portfolio/Badge';
import SectionKicker from '../components/portfolio/SectionKicker';
import { BADGE_VARIANTS } from '../constants';
import { usePageMeta } from '../hooks/usePageMeta';
import { DEFAULT_OG_IMAGE_PATH } from '../lib/siteConfig';
import { useRealtimeQuery } from '../hooks/useRealtimeQuery';
import { CVSkeleton } from '../components/portfolio/SkeletonLayouts';
import { Skeleton } from '../components/ui/skeleton';

const ACCENT_COLORS = {
  sungold: { bg: 'var(--sungold)', ring: 'rgba(232,160,32,0.2)' },
  nebula: { bg: 'var(--nebula)', ring: 'rgba(91,79,216,0.2)' },
  stardust: { bg: 'var(--stardust)', ring: 'rgba(28,184,212,0.2)' },
  terracotta: { bg: 'var(--terracotta)', ring: 'rgba(201,75,45,0.2)' }
};

/** PDF URL for download - set in env as VITE_CV_PDF_URL or override in cvData */
const getPdfUrl = () => {
  const envUrl = import.meta.env?.VITE_CV_PDF_URL;
  if (envUrl) return envUrl;
  return (cvData && typeof cvData.pdfUrl === 'string') ? cvData.pdfUrl : '#';
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' }
  }
};

const CVPage = () => {
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);
  const { data: timeline, loading: l1 } = useRealtimeQuery('timeline_entries', fetchTimeline);
  const { data: education, loading: l2 } = useRealtimeQuery('education_entries', fetchEducation);
  const { data: certifications, loading: l3 } = useRealtimeQuery('certifications', fetchCertifications);
  const { data: skillsData, loading: l4 } = useRealtimeQuery('skills', fetchSkills);

  const skills = Array.isArray(skillsData) && skillsData.length > 0 ? skillsData : [];
  const loading = l1 || l2 || l3 || l4;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const displayTimeline = Array.isArray(timeline) && timeline.length > 0 ? timeline : [];
  const displayEducation = Array.isArray(education) && education.length > 0 ? education : [];
  const displayCertifications = Array.isArray(certifications) && certifications.length > 0
    ? certifications.map((c) => (typeof c === 'string' ? c : c.title))
    : [];

  usePageMeta({
    title: 'CV',
    description: 'Experience, education, and skills — design and engineering.',
    image: DEFAULT_OG_IMAGE_PATH,
    canonical: '/cv',
  });

  return (
    <>
      <section className="relative pt-12 pb-8 md:pt-24 md:pb-16 border-b border-[var(--border)] overflow-hidden">
        {/* Nebula Glow Backdrop */}
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[120%] bg-[var(--nebula)] opacity-[0.05] blur-[160px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[80%] bg-[var(--sungold)] opacity-[0.03] blur-[140px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-[1160px] mx-auto px-4 md:px-8">
          {loading ? (
            <>
              <Skeleton className="w-[100px] h-[11px] mb-3" />
              <Skeleton className="w-[50%] h-[48px] mb-4" />
              <Skeleton className="w-[60%] max-w-[560px] h-[17px] mb-8" />
              <div className="flex gap-3">
                <Skeleton className="w-[140px] h-[42px]" />
                <Skeleton className="w-[160px] h-[42px]" />
              </div>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <SectionKicker label="CV / Resumé" accent="stardust" />
              <h1 className="font-display font-extrabold leading-[1.05] tracking-[-0.03em] mb-6 text-[var(--white)] max-w-[800px]" style={{ fontSize: 'clamp(40px, 8vw, 80px)' }}>
                Experience <span className="text-[var(--sungold)]">&</span> Skills
              </h1>
              <p className="font-body text-[17px] leading-[1.7] max-w-[600px] mb-8 text-[var(--muted)]">
                A technical overview of my journey, stack, and design philosophy—fusing cultural identity with digital precision.
              </p>
              <div className="flex flex-wrap gap-3">
                <motion.a
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  href={getPdfUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="no-print btn-primary inline-flex items-center gap-2 font-display text-[13px] font-semibold px-[22px] py-[11px] no-underline bg-[var(--sungold)] text-[var(--void)] border-0 rounded-none hover:opacity-90 transition-opacity"
                >
                  <Download size={14} /> Download PDF
                </motion.a>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => window.print()}
                  className="no-print inline-flex items-center gap-2 font-display text-[13px] font-semibold px-[22px] py-[11px] border border-[var(--border-md)] bg-transparent text-[var(--white)] rounded-none hover:border-[var(--sungold)] hover:text-[var(--sungold)] transition-colors"
                >
                  <Printer size={14} /> Print / Save as PDF
                </motion.button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Technical Scanline effect */}
        <motion.div 
          initial={{ top: '-10%' }}
          animate={{ top: '110%' }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          className="absolute left-0 w-full h-px bg-gradient-to-r from-transparent via-[var(--sungold)]/20 to-transparent pointer-events-none z-0"
        />
      </section>

      <section className="py-12 md:py-16 relative overflow-hidden" ref={sectionRef}>
        {/* Subtle grid accent */}
        <div className="absolute inset-0 opacity-[0.1] pointer-events-none" 
             style={{ backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)', backgroundSize: '80px 80px' }} />

        <div className="relative z-10 max-w-[1160px] mx-auto px-4 md:px-8">
          {loading ? (
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12 lg:gap-16">
              <div>
                <Skeleton className="w-[160px] h-[11px] mb-8" />
                <div className="flex flex-col gap-6 pl-7">
                  {[...Array(5)].map((_, i) => (
                    <div key={i}>
                      <Skeleton className="w-[60px] h-[11px] mb-2" />
                      <Skeleton className="w-[70%] h-[15px] mb-1" />
                      <Skeleton className="w-full h-[13px]" />
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <Skeleton className="w-[160px] h-[11px] mb-6" />
                <div className="flex flex-col gap-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i}>
                      <Skeleton className="w-full h-[12px] mb-1" />
                      <Skeleton className="w-full h-[3px]" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate={visible ? "visible" : "hidden"}
              className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12 lg:gap-16"
            >
              {/* Left: Interactive timeline + Education + Certifications */}
              <div>
                <motion.div variants={itemVariants} className="flex items-center gap-2 mb-8">
                  <Briefcase size={16} className="text-[var(--sungold)]" />
                  <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-[var(--sungold)]">
                    Experience Timeline
                  </span>
                </motion.div>
                <div className="relative pl-7">
                  <motion.div
                    className="absolute left-[6px] top-0 w-px bg-[var(--sungold)] origin-top hover:shadow-[0_0_10px_var(--sungold)]"
                    style={{ height: visible ? '100%' : '0%' }}
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: visible ? 1 : 0 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                  />
                  {displayTimeline.map((item, i) => {
                    const accent = ACCENT_COLORS[item.accent] || ACCENT_COLORS.sungold;
                    return (
                      <motion.div
                        key={i}
                        variants={itemVariants}
                        className="relative mb-8 last:mb-0 group/timeline"
                      >
                        <div
                          className="absolute -left-[27px] top-[5px] w-[10px] h-[10px] border-2 border-[var(--void)] z-10"
                          style={{
                            background: accent.bg,
                            boxShadow: `0 0 0 3px ${accent.ring}`,
                            borderRadius: 0
                          }}
                        />
                        <div className="font-mono text-[11px] mb-1 text-[var(--stardust)] transition-colors group-hover/timeline:text-[var(--sungold)]">{item.year}</div>
                        <h3 className="font-display text-[15px] font-semibold mb-1 text-[var(--white)] group-hover/timeline:text-[var(--sungold)] transition-colors">{item.title}</h3>
                        <p className="font-body text-[13px] leading-[1.6] text-[var(--muted)]">{item.body}</p>
                      </motion.div>
                    );
                  })}
                </div>

                <div className="mt-16">
                  <motion.div variants={itemVariants} className="flex items-center gap-2 mb-6">
                    <GraduationCap size={16} className="text-[var(--violet)]" />
                    <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-[var(--violet)]">
                      Education
                    </span>
                  </motion.div>
                  <div className="flex flex-col gap-4">
                    {displayEducation.map((edu, i) => (
                      <motion.div 
                        key={edu.id ?? i} 
                        variants={itemVariants}
                        className="relative p-5 bg-[var(--surface)] border border-[var(--border)] group/edu hover:border-[var(--violet)]/40 transition-colors"
                      >
                        {/* Technical corner accents */}
                        <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-[var(--violet)] opacity-20 group-hover/edu:opacity-100 transition-opacity" />
                        <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-[var(--violet)] opacity-20 group-hover/edu:opacity-100 transition-opacity" />

                        <div className="font-mono text-[11px] mb-1 text-[var(--stardust)]">{edu.year}</div>
                        <h3 className="font-display text-[15px] font-semibold mb-1 text-[var(--white)]">{edu.degree}</h3>
                        <p className="font-body text-[13px] text-[var(--muted)]">{edu.school}</p>
                        {edu.description && (
                          <p className="font-body text-[13px] mt-2 text-[var(--subtle)]">{edu.description}</p>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="mt-12">
                  <motion.div variants={itemVariants} className="flex items-center gap-2 mb-6">
                    <Award size={16} className="text-[var(--sungold)]" />
                    <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-[var(--sungold)]">
                      Certifications
                    </span>
                  </motion.div>
                  <div className="flex flex-col gap-2">
                    {displayCertifications.map((cert, i) => (
                      <motion.div 
                        key={i} 
                        variants={itemVariants}
                        className="flex items-center gap-3 p-3 bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--border-hi)] hover:bg-[var(--elevated)] transition-all cursor-default"
                      >
                        <span className="w-1.5 h-1.5 flex-shrink-0 bg-[var(--sungold)]" />
                        <span className="font-body text-[13px] text-[var(--muted)] group-hover:text-[var(--white)] transition-colors">{cert}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: Skills with proficiency + Tools & stack grid */}
              <div>
                <div className="mb-10">
                  <motion.div variants={itemVariants} className="flex items-center gap-2 mb-6">
                    <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-[var(--stardust)]">
                      Skills with proficiency
                    </span>
                  </motion.div>
                  <div className="flex flex-col gap-6">
                    {skills.map((skill, i) => (
                      <motion.div key={i} variants={itemVariants} className="group/skill">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-mono text-[12px] text-[var(--muted)] group-hover/skill:text-[var(--sungold)] transition-colors">{skill.name}</span>
                          <span className="font-mono text-[11px] text-[var(--subtle)]">{skill.level}%</span>
                        </div>
                        {/* Technical segmented bar */}
                        <div className="flex gap-1 h-[4px]">
                          {[...Array(20)].map((_, idx) => (
                            <div 
                              key={idx}
                              className={`flex-1 transition-all duration-700 ${idx < (skill.level / 5) ? 'bg-[var(--sungold)] shadow-[0_0_8px_var(--sungold)]/40' : 'bg-[var(--elevated)]'}`}
                              style={{ 
                                transitionDelay: visible ? `${i * 50 + idx * 20}ms` : '0ms',
                                opacity: visible ? 1 : 0,
                                transform: visible ? 'scaleX(1)' : 'scaleX(0)'
                              }}
                            />
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div>
                  <motion.div variants={itemVariants} className="flex items-center gap-2 mb-6">
                    <Wrench size={14} className="text-[var(--sungold)]" />
                    <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-[var(--sungold)]">
                      Tools & Stack
                    </span>
                  </motion.div>
                  <div className="grid grid-cols-2 gap-3">
                    {techStackForCV.map((tool, i) => (
                      <motion.div 
                        key={i} 
                        variants={itemVariants}
                        className="relative p-4 bg-[var(--surface)] border border-[var(--border)] group/tool overflow-hidden hover:border-[var(--sungold)]/30 transition-colors"
                      >
                        {/* Corner accents */}
                        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[var(--sungold)] opacity-0 group-hover/tool:opacity-100 transition-all duration-300" />
                        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[var(--sungold)] opacity-0 group-hover/tool:opacity-100 transition-all duration-300" />
                        
                        {/* Hover scanline */}
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--sungold)]/5 to-transparent -translate-y-full group-hover/tool:translate-y-full transition-transform duration-1000 ease-in-out pointer-events-none" />

                        <div className="font-display text-[13px] font-semibold text-[var(--white)] transition-colors group-hover:text-[var(--sungold)]">{tool.name}</div>
                        <Badge variant={BADGE_VARIANTS[i % BADGE_VARIANTS.length]} className="mt-2 scale-90 origin-left opacity-80 group-hover:opacity-100 transition-all">
                          {tool.category}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </>
  );
};

export default CVPage;
