import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchProjects } from '../../services/api';
import { useRealtimeQuery } from '../../hooks/useRealtimeQuery';
import { projects as mockFallback } from '../../data/mock';

const getProjectPreset = (project, idx) => {
  const title = (project.title || '').toLowerCase();
  if (title.includes('narvo')) {
    return {
      className: 'spread-v-dark',
      bgText: 'NARVO',
      icon: 'N/',
      subtitle: 'AI-POWERED NEWS',
      techBg: 'rgba(212, 43, 43, 0.8)'
    };
  }
  if (title.includes('corps') || title.includes('mart')) {
    return {
      className: 'spread-v-red',
      bgText: 'CORPS',
      icon: 'CM',
      subtitle: 'MARKETPLACE',
      techBg: 'var(--ink)'
    };
  }
  if (title.includes('rant')) {
    return {
      className: 'spread-v-cream',
      bgText: 'RANT',
      icon: '!!',
      subtitle: 'SOCIAL FEEDBACK',
      techBg: 'var(--ink)'
    };
  }
  if (title.includes('3d') || title.includes('todo') || title.includes('spatial')) {
    return {
      className: 'spread-v-dark',
      bgText: '3D',
      icon: '3D',
      subtitle: 'SPATIAL INTERFACE',
      techBg: 'rgba(255, 255, 255, 0.12)'
    };
  }
  // Generic dynamic preset
  const presets = [
    { className: 'spread-v-dark', bgText: 'DEV', icon: '</>', subtitle: 'DEVELOPMENT', techBg: 'rgba(212, 43, 43, 0.8)' },
    { className: 'spread-v-red', bgText: 'DESIGN', icon: '🎨', subtitle: 'CREATIVE DESIGN', techBg: 'var(--ink)' },
    { className: 'spread-v-cream', bgText: 'PROD', icon: '⚡', subtitle: 'PRODUCT LAUNCH', techBg: 'var(--ink)' }
  ];
  const preset = presets[idx % presets.length];
  return {
    ...preset,
    bgText: project.title?.toUpperCase().slice(0, 8) || preset.bgText,
    icon: project.title?.slice(0, 2).toUpperCase() || preset.icon,
  };
};

const Projects = () => {
  const sectionRef = useRef(null);
  const [revealed, setRevealed] = useState({});
  const { data } = useRealtimeQuery('projects', fetchProjects, mockFallback);

  const projects = Array.isArray(data) && data.length > 0 ? data : mockFallback;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.dataset.id;
            setRevealed((prev) => ({ ...prev, [id]: true }));
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('.spread, .projects-intro');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [projects]);

  return (
    <section id="projects" ref={sectionRef}>
      <div className="section-header">
        <span className="section-label">Selected Work</span>
        <span className="section-num">§ 02</span>
      </div>

      <div className="projects-intro" data-id="intro">
        <h2 className={`projects-intro-title reveal-left ${revealed['intro'] ? 'in' : ''}`}>
          Four<br />
          <span className="accent">Products.</span><br />
          One Vision.
        </h2>
        <p className={`projects-intro-meta reveal-right ${revealed['intro'] ? 'in' : ''}`}>
          Each project here is a fully realised product — not a tutorial exercise.
          From AI-powered news platforms to social tools and 3D experiments,
          everything ships with design intention and technical rigour.
        </p>
      </div>

      {projects.map((project, idx) => {
        const isSpreadA = idx % 2 === 0;
        const preset = getProjectPreset(project, idx);
        const pid = `proj-${project.id || idx}`;
        
        // Parse skills/tech array
        const techList = Array.isArray(project.technologies) 
          ? project.technologies 
          : typeof project.technologies === 'string' 
            ? project.technologies.split(',').map(t => t.trim())
            : [];

        // Parse custom highlights/bullet list
        const highlights = Array.isArray(project.highlights)
          ? project.highlights
          : typeof project.highlights === 'string'
            ? project.highlights.split(',').map(h => h.trim())
            : [
                'Custom brand design system',
                'Mobile-first UI implementation',
                'Fully production-ready'
              ];

        const visualPanel = (
          <div className={`spread-visual ${preset.className}`}>
            <div className="spread-bg-text">{preset.bgText}</div>
            <div className="spread-visual-inner">
              <div 
                className="spread-icon" 
                style={{ 
                  color: preset.className.includes('red') ? 'var(--red)' : preset.className.includes('dark') ? '#ffffff' : 'var(--ink)',
                  fontStyle: 'italic',
                  fontFamily: 'var(--font-display)'
                }}
              >
                {preset.icon}
              </div>
              <div 
                style={{ 
                  fontFamily: 'var(--font-mono)', 
                  fontSize: '10px', 
                  color: preset.className.includes('dark') ? 'rgba(255, 255, 255, 0.4)' : preset.className.includes('red') ? 'var(--red)' : 'var(--muted)',
                  opacity: preset.className.includes('red') ? 0.7 : 1,
                  letterSpacing: '0.15em', 
                  marginTop: '8px'
                }}
              >
                {preset.subtitle}
              </div>
              <div className="spread-tech-row">
                {techList.slice(0, 4).map((tech, tIdx) => (
                  <span 
                    key={tIdx} 
                    className="spread-tech" 
                    style={{ background: preset.techBg }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        );

        const infoPanel = (
          <div className="spread-info">
            <div className="spread-num">Project {String(idx + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}</div>
            <h3 className="spread-title">{project.title}</h3>
            <div className="spread-type">{project.type || 'Full Stack Product'}</div>
            <p className="spread-desc">
              {project.description}
            </p>
            <ul className="spread-highlights">
              {highlights.slice(0, 4).map((highlight, hIdx) => (
                <li key={hIdx}>{highlight}</li>
              ))}
            </ul>
            <Link className="spread-link" to={`/work/${project.slug || project.id}`}>
              View case study →
            </Link>
          </div>
        );

        return (
          <div 
            key={project.id || idx} 
            data-id={pid}
            className={`spread ${isSpreadA ? 'spread-a' : 'spread-b'} reveal ${revealed[pid] ? 'in' : ''}`}
          >
            {isSpreadA ? (
              <>
                {visualPanel}
                {infoPanel}
              </>
            ) : (
              <>
                {infoPanel}
                {visualPanel}
              </>
            )}
          </div>
        );
      })}
    </section>
  );
};

export default Projects;
