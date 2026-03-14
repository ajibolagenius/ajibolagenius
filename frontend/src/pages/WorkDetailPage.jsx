import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight, ExternalLink, Github, X } from 'lucide-react';
import { fetchProject } from '../services/api';
import { projects as fallbackProjects } from '../data/mock';
import Badge from '../components/portfolio/Badge';
import { BADGE_VARIANTS } from '../constants';
import { usePageMeta } from '../hooks/usePageMeta';
import OptimizedImage from '../components/portfolio/OptimizedImage';
import { track } from '../services/analytics';

const WorkDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const screenshotsLength = project
    ? (project.screenshots || []).map((s) => (typeof s === 'string' ? s : s?.url)).filter(Boolean).length
    : 0;
  const goPrev = useCallback(() => {
    setLightboxIndex((i) => (screenshotsLength <= 0 ? 0 : (i <= 0 ? screenshotsLength - 1 : i - 1)));
  }, [screenshotsLength]);
  const goNext = useCallback(() => {
    setLightboxIndex((i) => (screenshotsLength <= 0 ? 0 : (i >= screenshotsLength - 1 ? 0 : i + 1)));
  }, [screenshotsLength]);

  useEffect(() => {
    fetchProject(slug)
      .then(data => { setProject(data); setLoading(false); })
      .catch(() => {
        const fb = fallbackProjects.find(p => p.id === slug || p.slug === slug);
        if (fb) { setProject(fb); } else { setError(true); }
        setLoading(false);
      });
  }, [slug]);

  useEffect(() => {
    if (project?.slug || project?.name) {
      track('project_view', { slug: project.slug, title: project.name, path: `/work/${project.slug}` });
    }
  }, [project?.slug, project?.name]);

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setLightboxOpen(false);
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxOpen, goPrev, goNext]);

  useEffect(() => {
    if (screenshotsLength === 0) {
      setLightboxOpen(false);
      setLightboxIndex(0);
      return;
    }
    setLightboxIndex((i) => Math.min(i, Math.max(0, screenshotsLength - 1)));
  }, [screenshotsLength]);

  usePageMeta(
    project
      ? {
          title: project.name,
          description: typeof project.description === 'string' ? project.description : 'Project by Ajibola Akelebe.',
          image: (project.screenshots && project.screenshots[0]) ? (typeof project.screenshots[0] === 'string' ? project.screenshots[0] : project.screenshots[0].url) : undefined,
          canonical: `/work/${project.slug || slug}`,
        }
      : { title: 'Project', description: 'Project by Ajibola Akelebe.', canonical: slug ? `/work/${slug}` : '/work' }
  );

  if (loading) {
    return (
      <div className="py-32 text-center font-mono text-[13px] text-[var(--subtle)]">
        Loading…
      </div>
    );
  }

  if (error || !project) {
    return (
      <section className="py-16 md:py-32">
        <div className="max-w-[1160px] mx-auto px-4 md:px-8 text-center">
          <h1 className="font-display text-[36px] font-extrabold mb-4 text-[var(--white)]">Project not found</h1>
          <button
            onClick={() => navigate('/work')}
            className="btn-primary font-display text-[13px] font-semibold px-[22px] py-[11px] cursor-pointer bg-[var(--sungold)] text-[var(--void)] border-0 rounded-none"
          >
            Back to Projects
          </button>
        </div>
      </section>
    );
  }

  const roleTitle = project.role_title || project.role || '';
  const techDetails = project.tech_details || project.techDetails || [];
  const liveUrl = project.live_url || project.liveUrl || '#';
  const githubUrl = project.github_url || project.githubUrl || '#';
  const screenshots = (project.screenshots || []).map((s) => (typeof s === 'string' ? s : s?.url)).filter(Boolean);
  const heroImage = screenshots[0];
  const lightboxSafeIndex = screenshots.length > 0 ? Math.min(lightboxIndex, screenshots.length - 1) : 0;

  return (
    <>
      {/* Hero image / 3D preview */}
      <section className="relative border-b border-[var(--border)]">
        <button
          onClick={() => navigate('/work')}
          className="absolute top-4 left-4 z-10 inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.08em] uppercase cursor-pointer bg-[var(--void)]/80 border border-[var(--border)] px-3 py-2 text-[var(--muted)] hover:text-[var(--sungold)] transition-colors"
        >
          <ArrowLeft size={14} /> Back to Projects
        </button>
        <div
          className="min-h-[280px] md:min-h-[360px] flex items-center justify-center bg-[var(--surface)]"
          style={{
            backgroundImage: heroImage ? undefined : 'repeating-linear-gradient(45deg, rgba(255,255,255,0.02) 0px, rgba(255,255,255,0.02) 1px, transparent 1px, transparent 12px)'
          }}
        >
          {heroImage ? (
            <button
              type="button"
              onClick={() => { setLightboxIndex(0); setLightboxOpen(true); }}
              className="w-full h-full min-h-[280px] md:min-h-[360px] block cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sungold)] focus-visible:ring-offset-2"
              aria-label="Open image in lightbox"
            >
              <OptimizedImage
                src={heroImage}
                alt={project.name}
                className="w-full h-full object-cover min-h-[280px] md:min-h-[360px]"
                priority
              />
            </button>
          ) : (
            <span className="font-display text-[13px] tracking-[0.2em] uppercase text-[var(--subtle)]">
              {project.label || project.name}
            </span>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightboxOpen && screenshots.length > 0 && screenshots[lightboxSafeIndex] && (
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-[var(--void)]/95"
          role="dialog"
          aria-modal="true"
          aria-label="Image gallery"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 z-10 p-2 text-[var(--white)] hover:text-[var(--sungold)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sungold)] rounded-none"
            aria-label="Close lightbox"
          >
            <X size={24} />
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); goPrev(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 text-[var(--white)] hover:text-[var(--sungold)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sungold)] rounded-none"
            aria-label="Previous image"
          >
            <ChevronLeft size={32} />
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); goNext(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 text-[var(--white)] hover:text-[var(--sungold)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sungold)] rounded-none"
            aria-label="Next image"
          >
            <ChevronRight size={32} />
          </button>
          <div
            className="relative max-w-[90vw] max-h-[90vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <OptimizedImage
              src={screenshots[lightboxSafeIndex]}
              alt={`${project.name} screenshot ${lightboxSafeIndex + 1}`}
              className="max-w-full max-h-[90vh] w-auto h-auto object-contain"
              loading="eager"
            />
          </div>
          <span className="absolute bottom-4 left-1/2 -translate-x-1/2 font-mono text-[11px] text-[var(--subtle)]">
            {lightboxSafeIndex + 1} / {screenshots.length}
          </span>
        </div>
      )}

      {/* Title, description, meta, tech badges, Live + GitHub */}
      <section className="pt-8 pb-10 md:pt-12 md:pb-14 border-b border-[var(--border)]">
        <div className="max-w-[1160px] mx-auto px-4 md:px-8">
          <div className="font-mono text-[10px] tracking-[0.12em] uppercase mb-2 text-[var(--sungold)]">
            {project.category}
          </div>
          <h1 className="font-display font-extrabold leading-[1.05] tracking-[-0.02em] mb-4 text-[var(--white)]" style={{ fontSize: 'clamp(28px, 4.5vw, 48px)' }}>
            {project.name}
          </h1>
          <p className="font-body text-[17px] leading-[1.7] mb-6 text-[var(--muted)] max-w-[720px]">
            {project.description}
          </p>

          <div className="flex flex-wrap items-center gap-3 mb-8">
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex items-center gap-2 font-display text-[13px] font-semibold tracking-[0.04em] px-[22px] py-[11px] no-underline bg-[var(--sungold)] text-[var(--void)] border-0 rounded-none"
            >
              View Live <ExternalLink size={14} />
            </a>
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost inline-flex items-center gap-2 font-display text-[13px] font-semibold tracking-[0.04em] px-[22px] py-[11px] no-underline bg-transparent text-[var(--white)] border border-[var(--border-md)] rounded-none"
            >
              <Github size={14} /> Source Code
            </a>
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            {(project.tags || []).map((tag, j) => (
              <Badge key={j} variant={BADGE_VARIANTS[j % BADGE_VARIANTS.length]}>
                {tag}
              </Badge>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: 'Role', value: roleTitle },
              { label: 'Duration', value: project.duration },
              { label: 'Year', value: project.year }
            ].filter(m => m.value).map((meta, i) => (
              <div key={i} className="p-4 bg-[var(--surface)] border border-[var(--border)]">
                <div className="font-mono text-[10px] tracking-[0.12em] uppercase mb-1 text-[var(--subtle)]">{meta.label}</div>
                <div className="font-display text-[14px] font-semibold text-[var(--white)]">{meta.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem + Solution narrative */}
      {(project.problem || project.solution) && (
        <section className="py-12 md:py-16 border-b border-[var(--border)]">
          <div className="max-w-[1160px] mx-auto px-4 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12">
              {project.problem && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-px bg-[var(--terracotta)]" />
                    <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-[#E07060]">The Problem</span>
                  </div>
                  <p className="font-body text-[15px] leading-[1.7] text-[var(--muted)]">{project.problem}</p>
                </div>
              )}
              {project.solution && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-px bg-[var(--sungold)]" />
                    <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-[var(--sungold)]">The Solution</span>
                  </div>
                  <p className="font-body text-[15px] leading-[1.7] text-[var(--muted)]">{project.solution}</p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Technical Architecture — tech stack badges + role */}
      {techDetails.length > 0 && (
        <section className="py-12 md:py-16 border-b border-[var(--border)]">
          <div className="max-w-[1160px] mx-auto px-4 md:px-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-6 h-px bg-[var(--stardust)]" />
              <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-[var(--stardust)]">Technical Architecture</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {techDetails.map((tech, i) => (
                <div key={i} className="p-5 bg-[var(--surface)] border border-[var(--border)]">
                  <Badge variant={BADGE_VARIANTS[i % BADGE_VARIANTS.length]} className="mb-2">
                    {tech.name}
                  </Badge>
                  <div className="font-mono text-[11px] text-[var(--subtle)]">{tech.role}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Screenshots gallery */}
      <section className="py-12 md:py-16">
        <div className="max-w-[1160px] mx-auto px-4 md:px-8">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-6 h-px bg-[var(--violet)]" />
            <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-[var(--violet)]">Screenshots</span>
          </div>
          {screenshots.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {screenshots.map((url, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => { setLightboxIndex(i); setLightboxOpen(true); }}
                  className="border border-[var(--border)] overflow-hidden bg-[var(--elevated)] text-left cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sungold)] focus-visible:ring-offset-2"
                  aria-label={`View screenshot ${i + 1}`}
                >
                  <OptimizedImage
                    src={url}
                    alt={`${project.name} screenshot ${i + 1}`}
                    className="w-full aspect-video object-cover"
                  />
                </button>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="aspect-video flex items-center justify-center bg-[var(--surface)] border border-[var(--border)]"
                  style={{ backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.02) 0px, rgba(255,255,255,0.02) 1px, transparent 1px, transparent 12px)' }}
                >
                  <span className="font-mono text-[10px] tracking-[0.12em] uppercase text-[var(--subtle)]">Screenshot {i}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default WorkDetailPage;
