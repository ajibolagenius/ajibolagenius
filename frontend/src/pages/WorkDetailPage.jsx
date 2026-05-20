import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight, ExternalLink, Github, X } from 'lucide-react';
import { fetchProject } from '../services/api';
import { usePageMeta } from '../hooks/usePageMeta';
import { buildOgImageUrl, DEFAULT_OG_IMAGE_PATH } from '../lib/siteConfig';
import { absolutizeUrl } from '../lib/pageMeta';
import { buildCreativeWorkSchema } from '../lib/structuredData';
import OptimizedImage from '../components/portfolio/OptimizedImage';
import { track } from '../services/analytics';
import { projects as mockFallback } from '../data/mock';

const WorkDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    setLoading(true);
    fetchProject(slug)
      .then((data) => {
        setProject(data);
        setLoading(false);
      })
      .catch(() => {
        // Find in mock fallback
        const matched = mockFallback.find((p) => p.slug === slug || p.id === slug);
        if (matched) {
          setProject(matched);
        } else {
          setError(true);
        }
        setLoading(false);
      });
  }, [slug]);

  useEffect(() => {
    if (project?.slug || project?.name) {
      track('project_view', { slug: project.slug, title: project.name, path: `/work/${project.slug}` });
    }
  }, [project]);

  const screenshots = project
    ? (project.screenshots || []).map((s) => (typeof s === 'string' ? s : s?.url)).filter(Boolean)
    : [];

  const goPrev = useCallback(() => {
    setLightboxIndex((i) => (screenshots.length <= 0 ? 0 : i <= 0 ? screenshots.length - 1 : i - 1));
  }, [screenshots]);

  const goNext = useCallback(() => {
    setLightboxIndex((i) => (screenshots.length <= 0 ? 0 : i >= screenshots.length - 1 ? 0 : i + 1));
  }, [screenshots]);

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

  const projectOgImage =
    project &&
    (() => {
      const hero = screenshots[0];
      if (hero) return absolutizeUrl(hero);
      return buildOgImageUrl(project.name, 'Project', project.description || 'Project by Ajibola Akelebe');
    })();

  usePageMeta(
    project
      ? {
          title: project.name,
          description: project.description || 'Project by Ajibola Akelebe.',
          image: projectOgImage || DEFAULT_OG_IMAGE_PATH,
          canonical: `/work/${project.slug || slug}`,
          structuredData: buildCreativeWorkSchema(project),
        }
      : {
          title: 'Project',
          description: 'Project by Ajibola Akelebe.',
          canonical: `/work/${slug}`,
        }
  );

  if (loading) {
    return (
      <div className="page-content" style={{ padding: '120px 0', textAlign: 'center', fontFamily: 'var(--font-mono)' }}>
        Loading Case Study Archive...
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="page-content" style={{ padding: '120px 0', textAlign: 'center' }}>
        <h1 className="hero-title" style={{ fontSize: '32px', marginBottom: '24px' }}>Archive Not Found</h1>
        <button
          onClick={() => navigate('/work')}
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            textTransform: 'uppercase',
            padding: '10px 20px',
            background: 'var(--ink)',
            color: 'var(--cream)',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Return to Selected Work
        </button>
      </div>
    );
  }

  const roleTitle = project.role_title || project.role || 'Creator';
  const techDetails = project.tech_details || project.techDetails || [];
  const liveUrl = project.live_url || project.liveUrl || '#';
  const githubUrl = project.github_url || project.githubUrl || '#';
  const heroImage = screenshots[0];

  return (
    <div className="page-content">
      {/* Editorial Header */}
      <section style={{ borderBottom: 'var(--rule)', padding: '56px 0 32px' }}>
        <button
          onClick={() => navigate('/work')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--ink)',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            marginBottom: '28px',
          }}
        >
          <ArrowLeft size={10} /> Back to Archive
        </button>

        <div>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              display: 'block',
              marginBottom: '16px',
            }}
          >
            § {project.category || 'System'}
          </span>
          <h1 className="hero-title" style={{ fontSize: 'clamp(42px, 6.5vw, 76px)', lineHeight: 0.95, marginBottom: '24px' }}>
            {project.name}
          </h1>

          <div className="hero-rule" style={{ margin: '24px 0' }}>
            <div className="hero-rule-line"></div>
            <span className="hero-rule-label">{project.year || '2024'} Archive</span>
            <div className="hero-rule-line"></div>
          </div>

          <p className="hero-desc" style={{ fontSize: '18px', lineHeight: 1.6, maxWidth: '820px' }}>
            {project.description}
          </p>
        </div>
      </section>

      {/* Hero Showcase Frame */}
      {heroImage && (
        <section style={{ borderBottom: 'var(--rule)', padding: '40px 0' }}>
          <div
            onClick={() => {
              setLightboxIndex(0);
              setLightboxOpen(true);
            }}
            style={{
              cursor: 'zoom-in',
              border: '1px solid var(--ink)',
              background: 'var(--surface)',
              padding: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <OptimizedImage
              src={heroImage}
              alt={project.name}
              style={{ width: '100%', maxHeight: '480px', objectFit: 'contain' }}
            />
          </div>
        </section>
      )}

      {/* Grid Meta Details */}
      <section style={{ borderBottom: 'var(--rule)', padding: '40px 0' }}>
        <div className="grid grid-cols-1 lg:grid-cols-[1.8fr_1fr] gap-12">
          {/* Narrative Summary */}
          <div>
            <h3
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                marginBottom: '16px',
              }}
            >
              Summary &amp; Coordinates
            </h3>
            <p className="hero-desc" style={{ marginBottom: '28px' }}>
              Designed and engineered to bridge complex functionality with high-impact visuals. This case study breaks down our primary technical parameters, constraints, and results.
            </p>

            <div className="flex flex-wrap gap-4">
              <a
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  padding: '12px 24px',
                  background: 'var(--red)',
                  color: 'var(--cream)',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontWeight: 'bold',
                }}
              >
                Launch Application <ExternalLink size={10} />
              </a>

              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  padding: '12px 24px',
                  border: '1px solid var(--ink)',
                  color: 'var(--ink)',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'transparent',
                }}
              >
                Code Repository <Github size={12} />
              </a>
            </div>
          </div>

          {/* Key Parameters */}
          <div style={{ borderLeft: 'var(--rule-thin)', paddingLeft: '24px' }}>
            <h3
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                marginBottom: '16px',
              }}
            >
              Parameters
            </h3>
            {[
              { label: 'Role & Scope', value: roleTitle },
              { label: 'Timeline Duration', value: project.duration },
              { label: 'Production Year', value: project.year },
            ]
              .filter((m) => m.value)
              .map((meta, i) => (
                <div key={i} style={{ marginBottom: '16px' }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '8px',
                      textTransform: 'uppercase',
                      color: 'var(--muted)',
                      display: 'block',
                    }}
                  >
                    {meta.label}
                  </span>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 'bold' }}>
                    {meta.value}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* Narrative Section (Problem / Solution) */}
      {(project.problem || project.solution) && (
        <section style={{ borderBottom: 'var(--rule)', padding: '56px 0' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {project.problem && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 'bold' }}>01 //</span>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '10px',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                    }}
                  >
                    The Constraint
                  </span>
                </div>
                <p className="hero-desc" style={{ fontSize: '15px', lineHeight: 1.7 }}>
                  {project.problem}
                </p>
              </div>
            )}
            {project.solution && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 'bold' }}>02 //</span>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '10px',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                    }}
                  >
                    The Resolution
                  </span>
                </div>
                <p className="hero-desc" style={{ fontSize: '15px', lineHeight: 1.7 }}>
                  {project.solution}
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Technical Architecture */}
      {techDetails.length > 0 && (
        <section style={{ borderBottom: 'var(--rule)', padding: '56px 0' }}>
          <h3
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              marginBottom: '32px',
            }}
          >
            Technical Stack Architecture
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {techDetails.map((tech, i) => (
              <div
                key={i}
                style={{
                  border: '1px solid var(--ink)',
                  padding: '20px',
                  background: 'var(--surface)',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '9px',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: 'bold',
                    color: 'var(--red)',
                  }}
                >
                  {tech.name}
                </span>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '12px', lineHeight: 1.4, display: 'block' }}>
                  {tech.role}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Gallery Showcase */}
      {screenshots.length > 1 && (
        <section style={{ padding: '56px 0 80px' }}>
          <h3
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              marginBottom: '32px',
            }}
          >
            Exhibition Grid
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {screenshots.slice(1).map((url, i) => (
              <div
                key={i}
                onClick={() => {
                  setLightboxIndex(i + 1);
                  setLightboxOpen(true);
                }}
                style={{
                  border: '1px solid var(--ink)',
                  padding: '12px',
                  background: 'var(--surface)',
                  cursor: 'zoom-in',
                }}
              >
                <OptimizedImage src={url} alt={`${project.name} preview ${i + 2}`} style={{ width: '100%' }} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Lightbox Modal */}
      {lightboxOpen && screenshots.length > 0 && screenshots[lightboxIndex] && (
        <div
          onClick={() => setLightboxOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(12, 12, 12, 0.98)',
            padding: '24px',
          }}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            style={{
              position: 'absolute',
              top: '24px',
              right: '24px',
              background: 'transparent',
              border: 'none',
              color: '#ffffff',
              fontSize: '24px',
              cursor: 'pointer',
            }}
          >
            <X size={24} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              goPrev();
            }}
            style={{
              position: 'absolute',
              left: '24px',
              background: 'transparent',
              border: 'none',
              color: '#ffffff',
              cursor: 'pointer',
            }}
          >
            <ChevronLeft size={40} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              goNext();
            }}
            style={{
              position: 'absolute',
              right: '24px',
              background: 'transparent',
              border: 'none',
              color: '#ffffff',
              cursor: 'pointer',
            }}
          >
            <ChevronRight size={40} />
          </button>

          <div onClick={(e) => e.stopPropagation()}>
            <OptimizedImage
              src={screenshots[lightboxIndex]}
              alt="showcase preview"
              style={{ maxWidth: '90vw', maxHeight: '80vh', border: '1px solid #333333' }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkDetailPage;
