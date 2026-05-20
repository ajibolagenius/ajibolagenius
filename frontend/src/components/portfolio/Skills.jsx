import React, { useEffect, useRef, useState } from 'react';
import { DataErrorBanner, DataLoadingSkeleton } from './DataStateMessage';

const isDesignSkill = (name = '') => {
  const value = name.toLowerCase();
  return ['design', 'figma', 'motion', '3d', 'brand', 'graphic', 'ui/ux', 'ux'].some((token) => value.includes(token));
};

const splitSkills = (skills) => {
  const dev = [];
  const design = [];
  skills.forEach((skill) => {
    if (skill.category === 'design' || isDesignSkill(skill.name)) design.push(skill);
    else dev.push(skill);
  });
  if (dev.length === 0 || design.length === 0) {
    const midpoint = Math.ceil(skills.length / 2);
    return [skills.slice(0, midpoint), skills.slice(midpoint)];
  }
  return [dev, design];
};

const Skills = ({ query }) => {
  const [revealed, setRevealed] = useState(false);
  const sectionRef = useRef(null);
  const { data, loading, error, refetch } = query ?? {};
  const skills = Array.isArray(data) ? data : [];
  const [devSkills, designSkills] = splitSkills(skills);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef}>
      <div className="section-header">
        <span className="section-label">Skills & Craft</span>
        <span className="section-num">§ 04</span>
      </div>
      <div className="skills-body">
        <div className={`skills-col reveal-left ${revealed ? 'in' : ''}`}>
          <h3 className="skills-col-title">Development</h3>
          {loading ? <DataLoadingSkeleton lines={6} /> : devSkills.length > 0 ? devSkills.map((skill, idx) => (
            <div key={idx} className="skill-row">
              <span className="skill-name">{skill.name}</span>
              <div className="skill-bar-wrap">
                <div 
                  className="skill-bar" 
                  style={{ width: revealed ? `${skill.level}%` : '0%' }}
                />
              </div>
            </div>
          )) : <p className="teaching-cell-label">No development skills available.</p>}
        </div>
        <div className="skills-divider"></div>
        <div className={`skills-col reveal-right ${revealed ? 'in' : ''}`}>
          <h3 className="skills-col-title">Design</h3>
          {loading ? <DataLoadingSkeleton lines={6} /> : designSkills.length > 0 ? designSkills.map((skill, idx) => (
            <div key={idx} className="skill-row">
              <span className="skill-name">{skill.name}</span>
              <div className="skill-bar-wrap">
                <div 
                  className="skill-bar" 
                  style={{ width: revealed ? `${skill.level}%` : '0%' }}
                />
              </div>
            </div>
          )) : <p className="teaching-cell-label">No design skills available.</p>}
        </div>
      </div>
      <DataErrorBanner error={error} onRetry={refetch} className="mx-6 md:mx-12 mb-4" />
    </section>
  );
};

export default Skills;
