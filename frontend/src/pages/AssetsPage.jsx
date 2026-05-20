import React, { useState, useMemo, useEffect } from 'react';
import { Download, ExternalLink } from 'lucide-react';
import { fetchAssets } from '../services/api';
import { supabase } from '../lib/supabase';
import { usePageMeta } from '../hooks/usePageMeta';
import { buildStaticPageMeta } from '../lib/routeMeta';
import { useRealtimeQuery } from '../hooks/useRealtimeQuery';

const ASSET_TYPE_LABELS = {
  file: 'File',
  link: 'Link',
  other: 'Other',
};

const FILTER_OPTIONS = [
  { label: 'All', value: 'all' },
  { label: 'File', value: 'file' },
  { label: 'Link', value: 'link' },
  { label: 'Other', value: 'other' },
];

const BEYOND_POP_URL = 'http://beyondpop.surge.sh';

function isBeyondPopAsset(asset) {
  const title = String(asset?.title || '').toLowerCase();
  const url = String(asset?.external_url || '').toLowerCase();
  return title.includes('beyond p.o.p') || url.includes('beyond_pop') || url.includes('beyondpop');
}

function normalizeAsset(asset) {
  if (!isBeyondPopAsset(asset)) return asset;
  return {
    ...asset,
    external_url: BEYOND_POP_URL,
  };
}

function getFileUrl(filePath) {
  if (!filePath) return null;
  const { data } = supabase.storage.from('assets').getPublicUrl(filePath);
  return data?.publicUrl ?? null;
}

const AssetCard = ({ asset }) => {
  const isFile = asset.asset_type === 'file';
  const isLink = asset.asset_type === 'link';

  const href = isFile
    ? getFileUrl(asset.file_path)
    : isLink
    ? asset.external_url?.trim() || null
    : null;
  const label = asset.button_label || (isFile ? asset.file_name || asset.title : isLink ? 'Open Link' : null);
  const openInNewTab = isLink && !asset.open_in_same_tab;

  return (
    <div
      style={{
        border: '1px solid var(--ink)',
        padding: '24px',
        background: 'var(--surface)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        height: '100%',
      }}
    >
      <div className="flex justify-between items-start">
        <div>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '8px',
              color: 'var(--red)',
              textTransform: 'uppercase',
              fontWeight: 'bold',
            }}
          >
            § {ASSET_TYPE_LABELS[asset.asset_type] || asset.asset_type}
          </span>
          <h3
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '16px',
              fontWeight: 'bold',
              marginTop: '4px',
            }}
          >
            {asset.title}
          </h3>
        </div>
      </div>

      {asset.description && (
        <p className="hero-desc" style={{ fontSize: '13px', lineHeight: 1.6 }}>
          {asset.description}
        </p>
      )}

      {href && (
        <a
          href={href}
          target={openInNewTab ? '_blank' : undefined}
          rel={openInNewTab ? 'noopener noreferrer' : undefined}
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '9px',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: 'var(--ink)',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            marginTop: 'auto',
            fontWeight: 'bold',
          }}
        >
          {isFile ? <Download size={12} /> : <ExternalLink size={12} />}
          <span>{label || 'Access Asset'}</span>
        </a>
      )}
    </div>
  );
};

export default function AssetsPage() {
  const [typeFilter, setTypeFilter] = useState('all');
  const [revealed, setRevealed] = useState(false);
  const { data: fetchedAssets } = useRealtimeQuery('assets', fetchAssets, []);

  useEffect(() => {
    const timer = setTimeout(() => setRevealed(true), 100);
    return () => clearTimeout(timer);
  }, []);

  usePageMeta(buildStaticPageMeta('/assets'));

  const assets = useMemo(() => {
    return Array.isArray(fetchedAssets) ? fetchedAssets.map(normalizeAsset) : [];
  }, [fetchedAssets]);

  const filtered = useMemo(() => {
    if (typeFilter === 'all') return assets;
    return assets.filter((a) => a.asset_type === typeFilter);
  }, [assets, typeFilter]);

  const sorted = useMemo(() => {
    return filtered.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
  }, [filtered]);

  return (
    <div className="page-content">
      {/* Page Header */}
      <section style={{ borderBottom: 'var(--rule)', padding: '56px 0 40px' }}>
        <div className={`reveal ${revealed ? 'in' : ''}`}>
          <div className="hero-kicker">
            <span className="hero-kicker-dot"></span>
            Visual &amp; Code Packages
          </div>
          <h1 className="hero-title" style={{ fontSize: 'clamp(52px, 8vw, 100px)', lineHeight: 0.9 }}>
            Shared <em>Assets</em>
          </h1>
          <div className="hero-rule" style={{ margin: '24px 0 20px' }}>
            <div className="hero-rule-line"></div>
            <span className="hero-rule-label">DON_GENIUS — DOWNLOADS</span>
            <div className="hero-rule-line"></div>
          </div>
          <p className="hero-desc" style={{ maxWidth: '620px' }}>
            Design systems, templates, blueprints, and engineering files free to download and use in production.
          </p>
        </div>
      </section>

      {/* Type Filters */}
      <section style={{ borderBottom: 'var(--rule)', padding: '24px 0' }}>
        <div className="flex flex-wrap gap-2">
          {FILTER_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setTypeFilter(opt.value)}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '9px',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                padding: '6px 12px',
                border: '1px solid var(--ink)',
                background: typeFilter === opt.value ? 'var(--ink)' : 'transparent',
                color: typeFilter === opt.value ? 'var(--cream)' : 'var(--ink)',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </section>

      {/* Catalog Grid */}
      <section style={{ padding: '48px 0 80px' }}>
        {sorted.length === 0 ? (
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
            No catalog items found matching this filter selection.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sorted.map((asset, idx) => (
              <div key={asset.id || idx}>
                <AssetCard asset={asset} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
