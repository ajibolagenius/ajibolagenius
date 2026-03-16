import React, { useEffect, useRef, useState } from 'react';
import { fetchPersonalInfo, fetchSkills, fetchProjects, fetchCourses } from '../../services/api';
import { useRealtimeQuery } from '../../hooks/useRealtimeQuery';
import { AboutSkeleton } from './SkeletonLayouts';

const About = ({ snapshot = false }) => {
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);
  const { data: info, loading: l1 } = useRealtimeQuery('personal_info', fetchPersonalInfo);
  const { data: skillsData, loading: l2 } = useRealtimeQuery('skills', fetchSkills);
  const { data: projectsData, loading: l3 } = useRealtimeQuery('projects', fetchProjects);
  const { data: coursesData, loading: l4 } = useRealtimeQuery('courses', fetchCourses);

  const loading = l1 || l2 || l3 || l4;
  const skills = Array.isArray(skillsData) && skillsData.length > 0 ? skillsData : [];

  // Compute dynamic stats from live table counts
  const dynamicStats = [
    { label: 'Projects Shipped', value: `${Array.isArray(projectsData) ? projectsData.length : 0}+` },
    { label: 'Courses Created', value: `${Array.isArray(coursesData) ? coursesData.length : 0}` },
    { label: 'Students Taught', value: '300+' },
    { label: 'Years Experience', value: '6+' },
  ];

  const bodyCopy = info?.description || '';

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
        {loading ? (
          <AboutSkeleton snapshot={snapshot} />
        ) : (
          <div
            className="transition-all duration-700"
            style={{
              opacity: 1,
              transform: 'translateY(0)'
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
              {'I build things that work and things that feel right.' || info?.tagline || 'About Me'}
            </h2>

            {/* Description — snapshot: 2–3 sentences on Home (design-system Site Map) */}
            <p
              className="font-body text-[15px] leading-[1.7] max-w-[520px] text-[var(--muted)]"
              style={{ marginBottom: snapshot ? 24 : 40 }}
            >
              {'Developer and designer based in Nigeria, building for a global audience. I teach what I know and ship what I learn. My work sits at the intersection of African identity and modern technology — fusing cultural depth with technical precision.' || bodyCopy}
            </p>

            {!snapshot && (
              <>
                {/* Stats grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
                  {dynamicStats.map((stat, i) => (
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
                    {skills.map((skill, i) => {
                      const barColors = [
                        'var(--sungold)',
                        'var(--nebula)',
                        'var(--stardust)',
                        'var(--terracotta)'
                      ];
                      const barColor = barColors[i % barColors.length];

                      return (
                        <div key={i} className="flex items-center gap-4">
                          <span className="font-mono text-[12px] tracking-[0.04em] min-w-[180px] text-[var(--muted)]">
                            {skill.name}
                          </span>
                          <div className="flex-1 h-[3px] relative bg-[var(--elevated)]">
                            <div
                              className="absolute top-0 left-0 h-full transition-all duration-1000 rounded-none"
                              style={{
                                width: `${skill.level}%`,
                                backgroundColor: barColor,
                                transitionDelay: `${i * 100}ms`
                              }}
                            />
                          </div>
                          <span className="font-mono text-[11px] text-[var(--subtle)]">
                            {skill.level}%
                          </span>
                        </div>
                      );
                    })}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default About;
