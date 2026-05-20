import React, { useState, useMemo, useEffect } from 'react';
import { X } from 'lucide-react';
import { fetchGallery } from '../services/api';
import { usePageMeta } from '../hooks/usePageMeta';
import { buildStaticPageMeta } from '../lib/routeMeta';
import { useRealtimeQuery } from '../hooks/useRealtimeQuery';
import { DataLoadingSkeleton, DataErrorBanner } from '../components/portfolio/DataStateMessage';
import { paginate } from '../lib/paginate';
import ListPagination from '../components/portfolio/ListPagination';
import OptimizedImage from '../components/portfolio/OptimizedImage';

const FILTER_OPTIONS = [
  { label: 'All', value: 'All' },
  { label: 'UI', value: 'UI' },
  { label: '3D', value: '3D' },
  { label: 'Graphic', value: 'Graphic' },
  { label: 'Illustration', value: 'Illustration' },
  { label: 'Motion', value: 'Motion' },
  { label: 'Photography', value: 'Photography' },
  { label: 'Branding', value: 'Branding' },
  { label: 'Print', value: 'Print' },
  { label: 'Other', value: 'Other' },
];

const GALLERY_PAGE_SIZE = 12;

const GalleryPage = () => {
  const [filter, setFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [lightbox, setLightbox] = useState(null);
  const [revealed, setRevealed] = useState(false);

  const { data, loading, error, refetch } = useRealtimeQuery('gallery_items', fetchGallery, []);
  const items = Array.isArray(data) ? data : [];

  useEffect(() => {
    const timer = setTimeout(() => setRevealed(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const filteredItems = useMemo(() => {
    if (filter === 'All') return items;
    return items.filter((item) => (item.type || '') === filter);
  }, [items, filter]);

  const { items: paginatedItems, totalPages, start, end, total } = useMemo(
    () => paginate(filteredItems, page, GALLERY_PAGE_SIZE),
    [filteredItems, page]
  );

  usePageMeta(buildStaticPageMeta('/gallery'));

  return (
    <div className="page-content">
      {/* Editorial Header */}
      <section style={{ borderBottom: 'var(--rule)', padding: '56px 0 40px' }}>
        <div className={`reveal ${revealed ? 'in' : ''}`}>
          <div className="hero-kicker">
            <span className="hero-kicker-dot"></span>
            Visual Collection
          </div>
          <h1 className="hero-title" style={{ fontSize: 'clamp(52px, 8vw, 100px)', lineHeight: 0.9 }}>
            The <em>Gallery</em>
          </h1>
          <div className="hero-rule" style={{ margin: '24px 0 20px' }}>
            <div className="hero-rule-line"></div>
            <span className="hero-rule-label">DON_GENIUS — ARCHIVE</span>
            <div className="hero-rule-line"></div>
          </div>
          <p className="hero-desc" style={{ maxWidth: '620px' }}>
            A curated grid of graphics, 3D renderings, interface blueprints, and visual layout parameters.
          </p>
        </div>
      </section>

      {/* Categories Filter Tabs */}
      <section style={{ borderBottom: 'var(--rule)', padding: '24px 0' }}>
        <div className="flex flex-wrap gap-2">
          {FILTER_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                setFilter(opt.value);
                setPage(1);
              }}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '9px',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                padding: '6px 12px',
                border: '1px solid var(--ink)',
                background: filter === opt.value ? 'var(--ink)' : 'transparent',
                color: filter === opt.value ? 'var(--cream)' : 'var(--ink)',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </section>

      {/* Dense ruled museum catalog grid */}
      <section style={{ padding: '48px 0 80px' }}>
        <DataErrorBanner error={error} onRetry={refetch} className="mb-6" />

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                style={{
                  border: '1px dashed var(--ink)',
                  padding: '12px',
                  background: 'var(--surface)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                <div
                  style={{
                    width: '100%',
                    aspectRatio: '4/3',
                    background: 'var(--elevated)',
                  }}
                  className="animate-pulse"
                />
                <div style={{ padding: '0 4px' }}>
                  <div style={{ width: '40%', height: '14px', background: 'var(--elevated)', marginBottom: '8px' }} className="animate-pulse" />
                  <div style={{ width: '80%', height: '10px', background: 'var(--elevated)' }} className="animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div
            style={{
              padding: '60px 0',
              textAlign: 'center',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              color: 'var(--muted)',
              border: '1px dashed var(--ink)',
            }}
          >
            No visual elements cataloged under this criteria.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedItems.map((item, idx) => (
                <div
                  key={item.id || idx}
                  onClick={() => setLightbox(item)}
                  style={{
                    border: '1px solid var(--ink)',
                    padding: '12px',
                    background: 'var(--surface)',
                    cursor: 'zoom-in',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  <div
                    style={{
                      width: '100%',
                      aspectRatio: '4/3',
                      overflow: 'hidden',
                      background: 'var(--elevated)',
                      border: '1px solid rgba(17,17,17,0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {item.url ? (
                      <OptimizedImage
                        src={item.url}
                        alt={item.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)' }}>
                        NO_IMAGE
                      </span>
                    )}
                  </div>

                  <div className="flex justify-between items-center">
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 'bold' }}>
                      {item.title}
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', color: 'var(--red)' }}>
                      § {item.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '48px' }}>
              <ListPagination
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
                range={{ start, end, total }}
              />
            </div>
          </>
        )}
      </section>

      {/* Lightbox Overlay */}
      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
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
            onClick={() => setLightbox(null)}
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

          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--ink)',
              padding: '24px',
              maxWidth: '820px',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <div
              style={{
                width: '100%',
                maxHeight: '60vh',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--elevated)',
                border: '1px solid rgba(17,17,17,0.1)',
              }}
            >
              {lightbox.url ? (
                <OptimizedImage
                  src={lightbox.url}
                  alt={lightbox.title}
                  style={{ maxWidth: '100%', maxHeight: '60vh', objectFit: 'contain' }}
                />
              ) : (
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>Placeholder Video/Image</span>
              )}
            </div>

            <div>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '9px',
                  color: 'var(--red)',
                  display: 'block',
                  marginBottom: '4px',
                  fontWeight: 'bold',
                }}
              >
                Category // {lightbox.type}
              </span>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 'bold' }}>
                {lightbox.title}
              </h3>
              {lightbox.description && (
                <p className="hero-desc" style={{ fontSize: '13px', marginTop: '8px' }}>
                  {lightbox.description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryPage;
