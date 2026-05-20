import React, { useEffect, useRef, useState } from 'react';
import { fetchPersonalInfo } from '../../services/api';
import { useRealtimeQuery } from '../../hooks/useRealtimeQuery';
import { getPersonalInfoQueryFallback } from '../../lib/personalInfoFallbacks';

const fbInfo = getPersonalInfoQueryFallback();

const About = () => {
  const [revealed, setRevealed] = useState(false);
  const sectionRef = useRef(null);
  const { data: info } = useRealtimeQuery('personal_info', fetchPersonalInfo, fbInfo);

  const data = info || fbInfo;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const chips = [
    'React / Next.js',
    'Python',
    'Node.js',
    'UI/UX Design',
    'Graphic Design',
    '3D Design',
    'Motion Graphics',
    'No-Code',
    'AI Integration'
  ];

  return (
    <section id="about" ref={sectionRef}>
      <div className="section-header">
        <span className="section-label">About</span>
        <span className="section-num">§ 01</span>
      </div>
      <div className="about-grid">
        <div className={`about-pull reveal-left ${revealed ? 'in' : ''}`}>
          <p className="about-pull-quote">
            "I teach what I know<br />
            and ship what I <em>learn.</em>"
          </p>
        </div>
        <div className="about-divider"></div>
        <div className={`about-text reveal-right ${revealed ? 'in' : ''}`}>
          <p>
            I'm a full-stack developer, designer, and instructor
            who has been at the intersection of code and creativity since few years ago.
            What started in graphic design grew into software engineering, and
            eventually into building and teaching both.
          </p>
          <p>
            My approach is visual-first and aesthetics-aware — every product I build
            is something I'd be proud to show a designer and a developer in the same room.
            I'm especially drawn to AI-native products and interfaces that feel alive.
          </p>
          <p>
            When I'm not building or teaching, I'm designing systems, exploring
            Afrofuturism, or prototyping the next thing that doesn't exist yet.
          </p>
          <div className="about-chips">
            {chips.map((chip, idx) => (
              <span key={idx} className="chip">{chip}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
