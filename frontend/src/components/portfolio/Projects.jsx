import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { fetchProjects } from '../../services/api';
import { projects as fallbackProjects } from '../../data/mock';

const ProjectCard = ({ project, index, visible }) => {
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();

  return (
    <div
      className="group cursor-pointer bg-[var(--elevated)] border overflow-hidden rounded-none transition-all duration-300"
      style={{
        borderColor: hovered ? 'rgba(232,160,32,0.25)' : 'var(--border)',
        opacity: visible ? 1 : 0,
        transform: visible ? `translateY(${hovered ? '-4px' : '0px'})` : 'translateY(30px)',
        transitionDelay: visible ? `${index * 120}ms` : '0ms',
        boxShadow: hovered ? '0 24px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(232,160,32,0.1)' : 'none'
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => navigate(`/work/${project.slug || project.id}`)}
    >
      <div
        className="h-[160px] flex items-center justify-center relative overflow-hidden bg-[var(--surface)]"
        style={{ backgroundImage: `repeating-linear-gradient(45deg, rgba(255,255,255,0.02) 0px, rgba(255,255,255,0.02) 1px, transparent 1px, transparent 12px)` }}
      >
        <span className="font-display text-[11px] tracking-[0.15em] uppercase text-[var(--subtle)]">
          {project.label}
        </span>
      </div>
      <div className="p-5">
        <div className="font-mono text-[10px] tracking-[0.12em] uppercase mb-2 text-[var(--sungold)]">{project.category}</div>
        <h3 className="font-display text-[18px] font-bold leading-[1.2] mb-2 text-[var(--white)]">{project.name}</h3>
        <p className="font-body text-[13px] leading-[1.6] mb-4 text-[var(--muted)]">{project.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            {project.tags.map((tag, j) => (
              <span key={j} className="font-mono text-[10px] px-2 py-[3px] bg-[var(--overlay)] text-[var(--subtle)] border border-[var(--border)] rounded-none">
                {tag}
              </span>
            ))}
          </div>
          <ArrowUpRight
            size={18} className="transition-transform duration-200 text-[var(--sungold)]"
            style={{ transform: hovered ? 'translate(3px, -3px)' : 'translate(0, 0)' }}
          />
        </div>
      </div>
    </div>
  );
};

const Projects = () => {
  const [visible, setVisible] = useState(false);
  const [filter, setFilter] = useState('all');
  const [projects, setProjects] = useState([]);
  const sectionRef = useRef(null);

  useEffect(() => {
    fetchProjects()
      .then(setProjects)
      .catch(() => setProjects(fallbackProjects));
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const featured = projects.filter(p => p.featured);
  const filteredProjects = filter === 'all'
    ? featured.length > 0 ? featured : projects.slice(0, 3)
    : projects.filter((p) => p.type === filter);

  const filters = [
    { label: 'Featured', value: 'all' },
    { label: 'Development', value: 'dev' },
    { label: 'Design', value: 'design' }
  ];

  return (
    <section id="projects" ref={sectionRef} className="py-20 border-b border-[var(--border)]">
      <div className="max-w-[1160px] mx-auto px-8">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-5 h-px bg-[var(--sungold)]" />
          <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-[var(--sungold)]">02 — Selected Work</span>
        </div>
        <h2 className="font-display font-extrabold leading-[1.1] tracking-[-0.02em] mb-3 text-[var(--white)]" style={{ fontSize: 'clamp(28px, 4vw, 42px)' }}>
          Selected Projects
        </h2>
        <p className="font-body text-[15px] leading-[1.7] mb-8 max-w-[520px] text-[var(--muted)]">
          A selection of products and experiments I've built — from social platforms to creative coding explorations.
        </p>
        <div className="flex gap-2 mb-10">
          {filters.map((f) => (
            <button key={f.value} onClick={() => setFilter(f.value)}
              className="font-mono text-[11px] tracking-[0.1em] uppercase px-4 py-2 cursor-pointer transition-all duration-200 rounded-none"
              style={{
                background: filter === f.value ? 'rgba(232,160,32,0.15)' : 'transparent',
                color: filter === f.value ? 'var(--sungold)' : 'var(--subtle)',
                border: `1px solid ${filter === f.value ? 'rgba(232,160,32,0.3)' : 'var(--border)'}`
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, i) => (
            <ProjectCard key={project.slug || project.id} project={project} index={i} visible={visible} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
