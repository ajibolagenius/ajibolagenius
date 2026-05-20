import React, { useEffect, useRef, useState } from 'react';
import { DataErrorBanner, DataLoadingSkeleton } from './DataStateMessage';

const splitDescription = (value) => {
  if (!value) return [];
  return String(value)
    .split(/\n{2,}|\r?\n/)
    .map((part) => part.trim())
    .filter(Boolean);
};

const About = ({ personalInfoQuery, skillsQuery }) => {
  const [revealed, setRevealed] = useState(false);
  const sectionRef = useRef(null);
  const info = personalInfoQuery?.data ?? {};
  const skills = Array.isArray(skillsQuery?.data) ? skillsQuery.data : [];
  const paragraphs = splitDescription(info.description);
  const chips = skills.map((skill) => skill.name).filter(Boolean).slice(0, 9);
  const isLoading = personalInfoQuery?.loading || skillsQuery?.loading;
  const error = personalInfoQuery?.error || skillsQuery?.error;

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

  return (
    <section id="about" ref={sectionRef}>
      <div className="section-header">
        <span className="section-label">About</span>
        <span className="section-num">§ 01</span>
      </div>
      <div className="about-grid">
        <div className={`about-pull reveal-left ${revealed ? 'in' : ''}`}>
          <p className="about-pull-quote">
            "{info.tagline || 'Profile'}<br />
            <em>{info.tagline_suffix || info.taglineSuffix || 'unavailable.'}</em>"
          </p>
        </div>
        <div className="about-divider"></div>
        <div className={`about-text reveal-right ${revealed ? 'in' : ''}`}>
          {isLoading ? (
            <DataLoadingSkeleton lines={4} />
          ) : paragraphs.length > 0 ? (
            paragraphs.map((paragraph, idx) => <p key={idx}>{paragraph}</p>)
          ) : (
            <p>About content is unavailable.</p>
          )}
          <DataErrorBanner
            error={error}
            onRetry={() => {
              personalInfoQuery?.refetch?.();
              skillsQuery?.refetch?.();
            }}
            className="mb-4"
          />
          {chips.length > 0 && (
            <div className="about-chips">
              {chips.map((chip, idx) => (
                <span key={idx} className="chip">{chip}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default About;
