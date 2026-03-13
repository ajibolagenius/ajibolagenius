import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Github } from 'lucide-react';
import { fetchProject } from '../services/api';
import { projects as fallbackProjects } from '../data/mock';
import { KenteDivider } from '../components/portfolio/About';

const WorkDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchProject(slug)
      .then(data => { setProject(data); setLoading(false); })
      .catch(() => {
        const fb = fallbackProjects.find(p => p.id === slug || p.slug === slug);
        if (fb) { setProject(fb); } else { setError(true); }
        setLoading(false);
      });
  }, [slug]);

  if (loading) return <div className="py-32 text-center font-mono text-[13px]" style={{ color: 'rgba(242,239,232,0.3)' }}>Loading...</div>;
  if (error || !project) return (
    <section className="py-32"><div className="max-w-[1160px] mx-auto px-8 text-center">
      <h1 className="font-display text-[36px] font-extrabold mb-4">Project not found</h1>
      <button onClick={() => navigate('/work')} className="font-display text-[13px] font-semibold px-[22px] py-[11px] cursor-pointer" style={{ background: '#E8A020', color: '#07070F', border: 'none', borderRadius: 0 }}>Back to Projects</button>
    </div></section>
  );

  const roleTitleField = project.role_title || project.role || '';
  const techDetails = project.tech_details || project.techDetails || [];
  const liveUrl = project.live_url || project.liveUrl || '#';
  const githubUrl = project.github_url || project.githubUrl || '#';

  return (
    <>
      <section className="pt-16 pb-12" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-[1160px] mx-auto px-8">
          <button onClick={() => navigate('/work')} className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.08em] uppercase mb-10 cursor-pointer bg-transparent border-none transition-colors duration-200 hover:text-[#E8A020]" style={{ color: 'rgba(242,239,232,0.55)' }}>
            <ArrowLeft size={14} /> Back to Projects
          </button>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12">
            <div>
              <div className="font-mono text-[10px] tracking-[0.12em] uppercase mb-3" style={{ color: '#E8A020' }}>{project.category}</div>
              <h1 className="font-display font-extrabold leading-[1.05] tracking-[-0.02em] mb-4" style={{ fontSize: 'clamp(32px, 5vw, 56px)' }}>{project.name}</h1>
              <p className="font-body text-[17px] leading-[1.7] mb-8" style={{ color: 'rgba(242,239,232,0.55)' }}>{project.description}</p>
              <div className="flex gap-3 flex-wrap">
                <a href={liveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-display text-[13px] font-semibold px-[22px] py-[11px] no-underline" style={{ background: '#E8A020', color: '#07070F', borderRadius: 0 }}>
                  View Live <ExternalLink size={14} />
                </a>
                <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-display text-[13px] font-semibold px-[22px] py-[11px] no-underline" style={{ background: 'transparent', color: '#F2EFE8', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 0 }}>
                  <Github size={14} /> Source Code
                </a>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              {[{ label: 'Role', value: roleTitleField }, { label: 'Duration', value: project.duration }, { label: 'Year', value: project.year }].map((meta, i) => (
                <div key={i} className="p-4" style={{ background: '#111126', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 0 }}>
                  <div className="font-mono text-[10px] tracking-[0.12em] uppercase mb-1" style={{ color: 'rgba(242,239,232,0.3)' }}>{meta.label}</div>
                  <div className="font-display text-[14px] font-semibold" style={{ color: '#F2EFE8' }}>{meta.value}</div>
                </div>
              ))}
              <div className="p-4" style={{ background: '#111126', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 0 }}>
                <div className="font-mono text-[10px] tracking-[0.12em] uppercase mb-2" style={{ color: 'rgba(242,239,232,0.3)' }}>Stack</div>
                <div className="flex gap-2 flex-wrap">
                  {project.tags.map((tag, j) => (
                    <span key={j} className="font-mono text-[10px] px-2 py-[3px]" style={{ background: '#1E1E3A', color: '#E8A020', border: '1px solid rgba(232,160,32,0.2)', borderRadius: 0 }}>{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <KenteDivider />
      <section className="py-16">
        <div className="max-w-[1160px] mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <div className="flex items-center gap-2 mb-4"><div className="w-6 h-[1px]" style={{ background: '#C94B2D' }} /><span className="font-mono text-[11px] tracking-[0.2em] uppercase" style={{ color: '#C94B2D' }}>The Problem</span></div>
              <p className="font-body text-[15px] leading-[1.7]" style={{ color: 'rgba(242,239,232,0.55)' }}>{project.problem}</p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-4"><div className="w-6 h-[1px]" style={{ background: '#E8A020' }} /><span className="font-mono text-[11px] tracking-[0.2em] uppercase" style={{ color: '#E8A020' }}>The Solution</span></div>
              <p className="font-body text-[15px] leading-[1.7]" style={{ color: 'rgba(242,239,232,0.55)' }}>{project.solution}</p>
            </div>
          </div>
          {techDetails.length > 0 && (
            <div className="mt-16">
              <div className="flex items-center gap-2 mb-6"><div className="w-6 h-[1px]" style={{ background: '#1CB8D4' }} /><span className="font-mono text-[11px] tracking-[0.2em] uppercase" style={{ color: '#1CB8D4' }}>Technical Architecture</span></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {techDetails.map((tech, i) => (
                  <div key={i} className="p-5" style={{ background: '#111126', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 0 }}>
                    <div className="font-display text-[15px] font-bold mb-1" style={{ color: '#F2EFE8' }}>{tech.name}</div>
                    <div className="font-mono text-[11px]" style={{ color: 'rgba(242,239,232,0.4)' }}>{tech.role}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default WorkDetailPage;
