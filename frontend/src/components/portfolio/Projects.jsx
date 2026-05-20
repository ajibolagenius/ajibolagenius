import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { DataErrorBanner, DataLoadingSkeleton } from './DataStateMessage';

const getProjectPreset = (project, idx) => {
  const title = (project.name || project.title || '').toLowerCase();
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
    { className: 'spread-v-red', bgText: 'DESIGN', icon: 'UI', subtitle: 'CREATIVE DESIGN', techBg: 'var(--ink)' },
    { className: 'spread-v-cream', bgText: 'PROD', icon: 'PX', subtitle: 'PRODUCT LAUNCH', techBg: 'var(--ink)' }
  ];
  const preset = presets[idx % presets.length];
  const name = project.name || project.title || '';
  return {
    ...preset,
    bgText: name.toUpperCase().slice(0, 8) || preset.bgText,
    icon: name.slice(0, 2).toUpperCase() || preset.icon,
  };
};

const asList = (value) => {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') return value.split(',').map((item) => item.trim()).filter(Boolean);
  return [];
};

const getScreenshotUrl = (project) => {
  const first = Array.isArray(project.screenshots) ? project.screenshots[0] : null;
  if (!first) return '';
  return typeof first === 'string' ? first : first.url || '';
};

const Projects = ({ query }) => {
  const sectionRef = useRef(null);
  const [revealed, setRevealed] = useState({});
  const { data, loading, error, refetch } = query ?? {};
  const projects = Array.isArray(data) ? data : [];

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
          {loading ? 'Loading' : projects.length || 'No'}<br />
          <span className="accent">Products.</span><br />
          One Vision.
        </h2>
        <p className={`projects-intro-meta reveal-right ${revealed['intro'] ? 'in' : ''}`}>
          {loading
            ? 'Fetching selected work from Supabase.'
            : projects.length > 0
              ? `${projects.length} project${projects.length === 1 ? '' : 's'} currently published for the homepage.`
              : 'No selected work is available from Supabase right now.'}
        </p>
      </div>
      <DataErrorBanner error={error} onRetry={refetch} className="mx-6 md:mx-12 my-4" />
      {loading && (
        <div className="spread spread-a reveal in">
          <div className="spread-visual spread-v-dark">
            <div className="spread-bg-text">LOAD</div>
          </div>
          <div className="spread-info">
            <DataLoadingSkeleton lines={5} />
          </div>
        </div>
      )}

      {projects.map((project, idx) => {
        const isSpreadA = idx % 2 === 0;
        const preset = getProjectPreset(project, idx);
        const pid = `proj-${project.id || idx}`;
        const projectName = project.name || project.title || 'Untitled project';
        const screenshotUrl = getScreenshotUrl(project);

        const techList = asList(project.technologies).length > 0
          ? asList(project.technologies)
          : asList(project.tags).length > 0
            ? asList(project.tags)
            : asList(project.tech_details).map((tech) => tech.name || tech).filter(Boolean);

        const highlights = asList(project.highlights).length > 0
          ? asList(project.highlights)
          : [project.problem, project.solution, project.role_title || project.role, project.year]
              .filter(Boolean);

        const visualPanel = (
          <div className={`spread-visual ${preset.className}`}>
            {screenshotUrl && (
              <img className="spread-image" src={screenshotUrl} alt="" loading="lazy" />
            )}
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
            <h3 className="spread-title">{projectName}</h3>
            <div className="spread-type">{project.category || project.type || 'Full Stack Product'}</div>
            <p className="spread-desc">
              {project.description}
            </p>
            {highlights.length > 0 && (
              <ul className="spread-highlights">
                {highlights.slice(0, 4).map((highlight, hIdx) => (
                  <li key={hIdx}>{highlight}</li>
                ))}
              </ul>
            )}
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
