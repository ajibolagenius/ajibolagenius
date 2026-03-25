import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight, ExternalLink, Github, X } from 'lucide-react';
import { fetchProject } from '../services/api';
import Badge from '../components/portfolio/Badge';
import { BADGE_VARIANTS } from '../constants';
import { usePageMeta } from '../hooks/usePageMeta';
import { buildOgImageUrl, DEFAULT_OG_IMAGE_PATH } from '../lib/siteConfig';
import { absolutizeUrl } from '../lib/pageMeta';
import OptimizedImage from '../components/portfolio/OptimizedImage';
import { track } from '../services/analytics';
import { ProjectsSkeleton } from '../components/portfolio/SkeletonLayouts';

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
        setError(true);
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

  const projectOgImage =
    project &&
    (() => {
      const shots = (project.screenshots || [])
        .map((s) => (typeof s === 'string' ? s : s?.url))
        .filter(Boolean);
      const hero = shots[0];
      if (hero) return absolutizeUrl(hero);
      return buildOgImageUrl(project.name, 'Project');
    })();

  usePageMeta(
    project
      ? {
          title: project.name,
          description: project.description || 'Project by Ajibola Akelebe.',
          image: projectOgImage || DEFAULT_OG_IMAGE_PATH,
          canonical: `/work/${project.slug || slug}`,
        }
      : {
          title: 'Project',
          description: 'Project by Ajibola Akelebe.',
          canonical: `/work/${slug}`,
        }
  );

  if (loading) {
    return (
      <div className="py-32 px-4 max-w-[1160px] mx-auto">
        <ProjectsSkeleton count={1} />
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
      {/* Hero Section with Nebula Backdrop */}
      <section className="relative border-b border-[var(--border)] overflow-hidden">
        <button
          type="button"
          onClick={() => navigate('/work')}
          className="absolute top-6 left-6 z-20 inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.1em] uppercase cursor-pointer bg-[var(--void)]/70 backdrop-blur-md border border-[var(--border)] px-4 py-2 text-[var(--muted)] hover:text-[var(--sungold)] transition-all hover:border-[var(--sungold)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sungold)]"
          aria-label="Back to projects"
        >
          <ArrowLeft size={14} /> Back to Projects
        </button>

        <div className="relative min-h-[320px] md:min-h-[480px] flex items-center justify-center bg-[var(--surface)] overflow-hidden">
          {/* Nebula Glow Backdrop */}
          <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
             <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[70%] bg-[var(--nebula)] blur-[120px] rounded-full" />
             <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[60%] bg-[var(--violet)] blur-[100px] rounded-full opacity-60" />
          </div>

          <div className="relative z-10 w-full h-full max-w-[1240px] px-4 md:px-8 flex items-center justify-center">
            {heroImage ? (
              <button
                type="button"
                onClick={() => { setLightboxIndex(0); setLightboxOpen(true); }}
                className="w-full max-h-[400px] md:max-h-[560px] block cursor-zoom-in focus:outline-none group"
                aria-label="Open image in lightbox"
              >
                <div className="relative overflow-hidden border border-[var(--border-md)] shadow-2xl">
                  <OptimizedImage
                    src={heroImage}
                    alt={project.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--void)]/40 to-transparent group-hover:opacity-0 transition-opacity" />
                </div>
              </button>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <div className="w-24 h-px bg-[var(--border-md)]" />
                <span className="font-display text-[14px] tracking-[0.3em] uppercase text-[var(--subtle)]">
                  {project.label || project.name}
                </span>
                <div className="w-24 h-px bg-[var(--border-md)]" />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightboxOpen && screenshots.length > 0 && screenshots[lightboxSafeIndex] && (
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-[var(--void)]/95 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Image gallery"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            className="absolute top-6 right-6 z-10 p-3 text-[var(--white)] hover:text-[var(--sungold)] transition-colors focus:outline-none"
            aria-label="Close lightbox"
          >
            <X size={28} />
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); goPrev(); }}
            className="absolute left-6 top-1/2 -translate-y-1/2 z-10 p-4 text-[var(--white)] hover:text-[var(--sungold)] transition-all hover:scale-110 focus:outline-none"
            aria-label="Previous image"
          >
            <ChevronLeft size={48} strokeWidth={1.5} />
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); goNext(); }}
            className="absolute right-6 top-1/2 -translate-y-1/2 z-10 p-4 text-[var(--white)] hover:text-[var(--sungold)] transition-all hover:scale-110 focus:outline-none"
            aria-label="Next image"
          >
            <ChevronRight size={48} strokeWidth={1.5} />
          </button>
          <div
            className="relative max-w-[95vw] max-h-[85vh] flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <OptimizedImage
              src={screenshots[lightboxSafeIndex]}
              alt={`${project.name} screenshot ${lightboxSafeIndex + 1}`}
              className="max-w-full max-h-[80vh] w-auto h-auto object-contain border border-[var(--border)] shadow-[0_0_50px_rgba(0,0,0,0.5)]"
              loading="eager"
            />
          </div>
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-4">
             <span className="font-mono text-[12px] tracking-widest text-[var(--subtle)]">
               {String(lightboxSafeIndex + 1).padStart(2, '0')} // {String(screenshots.length).padStart(2, '0')}
             </span>
          </div>
        </div>
      )}

      {/* Content Section */}
      <section className="py-12 md:py-20 border-b border-[var(--border)]">
        <div className="max-w-[1160px] mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-12 lg:gap-24">
            {/* Left Column: Info */}
            <div>
              <div className="font-mono text-[11px] tracking-[0.2em] uppercase mb-4 text-[var(--sungold)] flex items-center gap-2">
                <span className="w-4 h-px bg-[var(--sungold)]" />
                {project.category}
              </div>
              <h1 className="font-display font-extrabold leading-[1.1] tracking-[-0.03em] mb-6 text-[var(--white)]" style={{ fontSize: 'clamp(32px, 5.5vw, 56px)' }}>
                {project.name}
              </h1>
              <p className="font-body text-[18px] leading-[1.8] mb-8 text-[var(--muted)]">
                {project.description}
              </p>

              <div className="flex flex-wrap items-center gap-4 mb-10">
                <a
                  href={liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary inline-flex items-center gap-3 font-display text-[13px] font-bold tracking-[0.06em] px-8 py-3.5 no-underline bg-[var(--sungold)] text-[var(--void)] border-0 rounded-none transition-all hover:scale-[1.02] active:scale-[0.98] uppercase"
                >
                  View Project <ExternalLink size={14} />
                </a>
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost inline-flex items-center gap-3 font-display text-[13px] font-bold tracking-[0.06em] px-8 py-3.5 no-underline bg-transparent text-[var(--white)] border border-[var(--border-md)] rounded-none transition-all hover:bg-[var(--overlay)] uppercase"
                >
                  <Github size={16} /> Repository
                </a>
              </div>

              <div className="flex flex-wrap gap-2">
                {(project.tags || []).map((tag, j) => (
                  <Badge key={j} variant={BADGE_VARIANTS[j % BADGE_VARIANTS.length]}>
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Right Column: Meta Grid */}
            <div className="flex flex-col gap-1 w-full max-w-[400px]">
              {[
                { label: 'Role', value: roleTitle },
                { label: 'Duration', value: project.duration },
                { label: 'Year', value: project.year }
              ].filter(m => m.value).map((meta, i) => (
                <div key={i} className="group p-6 bg-[var(--surface)] border border-[var(--border)] relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-0 bg-[var(--sungold)] group-hover:h-full transition-all duration-300" />
                  <div className="font-mono text-[10px] tracking-[0.2em] uppercase mb-2 text-[var(--subtle)]">{meta.label}</div>
                  <div className="font-display text-[15px] font-bold text-[var(--white)] tracking-wide">{meta.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Narrative Section */}
      {(project.problem || project.solution) && (
        <section className="py-16 md:py-24 border-b border-[var(--border)] bg-[var(--void)]">
          <div className="max-w-[1160px] mx-auto px-4 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
              {project.problem && (
                <div className="relative">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="font-mono text-[11px] font-bold text-[var(--terracotta)]">01.</span>
                    <span className="font-mono text-[11px] tracking-[0.3em] uppercase text-[var(--terracotta)]">The Challenge</span>
                    <div className="flex-1 h-px bg-[var(--border)]" />
                  </div>
                  <p className="font-body text-[16px] leading-[1.8] text-[var(--muted)] whitespace-pre-line">{project.problem}</p>
                </div>
              )}
              {project.solution && (
                <div className="relative">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="font-mono text-[11px] font-bold text-[var(--sungold)]">02.</span>
                    <span className="font-mono text-[11px] tracking-[0.3em] uppercase text-[var(--sungold)]">The Execution</span>
                    <div className="flex-1 h-px bg-[var(--border)]" />
                  </div>
                  <p className="font-body text-[16px] leading-[1.8] text-[var(--muted)] whitespace-pre-line">{project.solution}</p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Technical Architecture */}
      {techDetails.length > 0 && (
        <section className="py-16 md:py-24 border-b border-[var(--border)]">
          <div className="max-w-[1160px] mx-auto px-4 md:px-8">
            <div className="flex items-center gap-3 mb-10">
              <span className="font-mono text-[11px] tracking-[0.3em] uppercase text-[var(--stardust)]">Architecture</span>
              <div className="flex-1 h-px bg-[var(--border)]" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {techDetails.map((tech, i) => (
                <div key={i} className="group p-6 bg-[var(--surface)] border border-[var(--border)] transition-all hover:border-[rgba(232,160,32,0.2)]">
                  <div className="flex justify-between items-start mb-4">
                    <Badge variant={BADGE_VARIANTS[i % BADGE_VARIANTS.length]}>
                      {tech.name}
                    </Badge>
                  </div>
                  <div className="font-mono text-[11px] leading-relaxed text-[var(--subtle)] uppercase tracking-tight">
                    {tech.role}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Screenshots Gallery */}
      <section className="py-16 md:py-24 bg-[var(--surface)]/30">
        <div className="max-w-[1160px] mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between gap-3 mb-12">
            <div className="flex items-center gap-3">
              <span className="font-mono text-[11px] tracking-[0.3em] uppercase text-[var(--violet)]">Visions</span>
            </div>
            <div className="font-mono text-[10px] text-[var(--subtle)] uppercase tracking-tighter">
              Project Archive // Gallery_Mode
            </div>
          </div>
          
          {screenshots.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {screenshots.map((url, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => { setLightboxIndex(i); setLightboxOpen(true); }}
                  className="group relative border border-[var(--border)] overflow-hidden bg-[var(--elevated)] aspect-video cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sungold)]"
                  aria-label={`View screenshot ${i + 1}`}
                >
                  <OptimizedImage
                    src={url}
                    alt={`${project.name} screenshot ${i + 1}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-[var(--void)]/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="aspect-video flex items-center justify-center bg-[var(--void)]/20 border border-[var(--border)] border-dashed"
                >
                  <span className="font-mono text-[10px] tracking-widest uppercase text-[var(--subtle)] opacity-30">NO_PREVIEW_{i}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer Navigation */}
      <section className="py-20 text-center border-t border-[var(--border)]">
        <div className="max-w-[1160px] mx-auto px-4 md:px-8">
          <div className="inline-flex flex-col items-center gap-6">
            <div className="w-12 h-px bg-[var(--border-hi)]" />
            <button
              onClick={() => navigate('/work')}
              className="group font-display text-[16px] md:text-[20px] font-bold text-[var(--white)] no-underline flex items-center gap-3 hover:text-[var(--sungold)] transition-colors"
            >
              <ArrowLeft size={20} className="transition-transform group-hover:-translate-x-2" />
              View Other Projects
            </button>
            <span className="font-mono text-[10px] text-[var(--subtle)] uppercase tracking-[0.3em]">
              Exploring Cosmos // Returning Home
            </span>
          </div>
        </div>
      </section>
    </>
  );
};

export default WorkDetailPage;
