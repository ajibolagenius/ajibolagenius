import React, { useEffect, useRef, useState } from 'react';

const Skills = () => {
  const [revealed, setRevealed] = useState(false);
  const sectionRef = useRef(null);

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

  const devSkills = [
    { name: 'React / Next.js', level: 95 },
    { name: 'Python', level: 88 },
    { name: 'JavaScript / TypeScript', level: 92 },
    { name: 'Node.js / Express', level: 82 },
    { name: 'Databases (SQL/NoSQL)', level: 80 },
    { name: '3D / Three.js / R3F', level: 72 }
  ];

  const designSkills = [
    { name: 'UI/UX Design', level: 93 },
    { name: 'Graphic Design', level: 95 },
    { name: 'Design Systems', level: 90 },
    { name: 'Motion Graphics', level: 85 },
    { name: '3D Design', level: 78 },
    { name: 'No-Code Tools', level: 88 }
  ];

  return (
    <section ref={sectionRef}>
      <div className="section-header">
        <span className="section-label">Skills & Craft</span>
        <span className="section-num">§ 04</span>
      </div>
      <div className="skills-body">
        <div className={`skills-col reveal-left ${revealed ? 'in' : ''}`}>
          <h3 className="skills-col-title">Development</h3>
          {devSkills.map((skill, idx) => (
            <div key={idx} className="skill-row">
              <span className="skill-name">{skill.name}</span>
              <div className="skill-bar-wrap">
                <div 
                  className="skill-bar" 
                  style={{ width: revealed ? `${skill.level}%` : '0%' }}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="skills-divider"></div>
        <div className={`skills-col reveal-right ${revealed ? 'in' : ''}`}>
          <h3 className="skills-col-title">Design</h3>
          {designSkills.map((skill, idx) => (
            <div key={idx} className="skill-row">
              <span className="skill-name">{skill.name}</span>
              <div className="skill-bar-wrap">
                <div 
                  className="skill-bar" 
                  style={{ width: revealed ? `${skill.level}%` : '0%' }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
