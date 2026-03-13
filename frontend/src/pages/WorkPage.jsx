import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { fetchProjects } from '../services/api';
import { projects as fallbackProjects } from '../data/mock';

const ProjectCard = ({ project }) => {
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();

  return (
    <div
      className="cursor-pointer transition-all duration-300"
      style={{
        background: '#17172E',
        border: `1px solid ${hovered ? 'rgba(232,160,32,0.25)' : 'rgba(255,255,255,0.06)'}`,
        borderRadius: 0, overflow: 'hidden',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hovered ? '0 6px 0 rgba(0,0,0,0.45), 0 0 0 1px rgba(232,160,32,0.15)' : 'none'
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => navigate(`/work/${project.slug || project.id}`)}
    >
      <div className="h-[200px] flex items-center justify-center relative overflow-hidden" style={{ background: `repeating-linear-gradient(45deg, rgba(255,255,255,0.01) 0px, rgba(255,255,255,0.01) 1px, transparent 1px, transparent 12px)`, backgroundColor: '#111126' }}>
        <span className="font-display text-[13px] tracking-[0.15em] uppercase" style={{ color: 'rgba(242,239,232,0.2)' }}>{project.label}</span>
        {project.featured && (
          <span className="absolute top-4 right-4 font-mono text-[10px] font-bold tracking-[0.1em] uppercase px-[10px] py-[4px]" style={{ background: 'rgba(232,160,32,0.15)', color: '#E8A020', border: '1px solid rgba(232,160,32,0.3)', borderRadius: 0 }}>
            ◆ Featured
          </span>
        )}
      </div>
      <div className="p-6">
        <div className="font-mono text-[10px] tracking-[0.12em] uppercase mb-2" style={{ color: '#E8A020' }}>{project.category}</div>
        <h3 className="font-display text-[20px] font-bold leading-[1.2] mb-2" style={{ color: '#F2EFE8' }}>{project.name}</h3>
        <p className="font-body text-[13px] leading-[1.6] mb-5" style={{ color: 'rgba(242,239,232,0.55)' }}>{project.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            {project.tags.map((tag, j) => (
              <span key={j} className="font-mono text-[10px] px-2 py-[3px]" style={{ background: '#1E1E3A', color: 'rgba(242,239,232,0.3)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 0 }}>{tag}</span>
            ))}
          </div>
          <ArrowUpRight size={18} className="transition-transform duration-200" style={{ color: '#E8A020', transform: hovered ? 'translate(3px, -3px)' : 'translate(0, 0)' }} />
        </div>
      </div>
    </div>
  );
};

const WorkPage = () => {
  const [filter, setFilter] = useState('all');
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects()
      .then(data => { setProjects(data); setLoading(false); })
      .catch(() => { setProjects(fallbackProjects); setLoading(false); });
  }, []);

  const filteredProjects = filter === 'all' ? projects : projects.filter((p) => p.type === filter);
  const filters = [{ label: 'All', value: 'all' }, { label: 'Development', value: 'dev' }, { label: 'Design', value: 'design' }];

  return (
    <>
      <section className="pt-12 pb-8 md:pt-20 md:pb-10" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-[1160px] mx-auto px-4 md:px-8">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-[1px]" style={{ background: '#E8A020' }} />
            <span className="font-mono text-[11px] tracking-[0.2em] uppercase" style={{ color: '#E8A020' }}>Projects</span>
          </div>
          <h1 className="font-display font-extrabold leading-[1.05] tracking-[-0.03em] mb-4" style={{ fontSize: 'clamp(36px, 6vw, 64px)' }}>Selected Work</h1>
          <p className="font-body text-[17px] leading-[1.7] max-w-[560px]" style={{ color: 'rgba(242,239,232,0.55)' }}>A collection of products and experiments — from social platforms to creative coding explorations.</p>
        </div>
      </section>
      <section className="py-12 md:py-16">
        <div className="max-w-[1160px] mx-auto px-4 md:px-8">
          <div className="flex gap-2 mb-10">
            {filters.map((f) => (
              <button key={f.value} onClick={() => setFilter(f.value)} className="font-mono text-[11px] tracking-[0.1em] uppercase px-4 py-2 cursor-pointer transition-all duration-200" style={{ background: filter === f.value ? 'rgba(232,160,32,0.15)' : 'transparent', color: filter === f.value ? '#E8A020' : 'rgba(242,239,232,0.3)', border: `1px solid ${filter === f.value ? 'rgba(232,160,32,0.3)' : 'rgba(255,255,255,0.06)'}`, borderRadius: 0 }}>
                {f.label}
              </button>
            ))}
          </div>
          {loading ? (
            <div className="font-mono text-[13px] py-20 text-center" style={{ color: 'rgba(242,239,232,0.3)' }}>Loading projects...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredProjects.map((project) => (<ProjectCard key={project.slug || project.id} project={project} />))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default WorkPage;
