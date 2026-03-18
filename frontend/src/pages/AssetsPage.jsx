import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Download, ExternalLink } from 'lucide-react';
import { fetchAssets } from '../services/api';
import { supabase } from '../lib/supabase';
import SectionKicker from '../components/portfolio/SectionKicker';
import FilterButtons from '../components/portfolio/FilterButtons';
import { usePageMeta } from '../hooks/usePageMeta';
import { useRealtimeQuery } from '../hooks/useRealtimeQuery';
import { byNumber, applySort } from '../lib/sortHelpers';

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

function getFileUrl(filePath) {
  if (!filePath) return null;
  const { data } = supabase.storage.from('assets').getPublicUrl(filePath);
  return data?.publicUrl ?? null;
}

function AssetCard({ asset }) {
  const isFile = asset.asset_type === 'file';
  const isLink = asset.asset_type === 'link';
  const isOther = asset.asset_type === 'other';

  const href = isFile
    ? getFileUrl(asset.file_path)
    : isLink
      ? (asset.external_url?.trim() || null)
      : null;
  const label = isFile ? (asset.file_name || asset.title) : isLink ? 'Open link' : null;
  const openInNewTab = isLink;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="group relative flex flex-col h-full min-h-0 border border-[var(--border)] bg-[var(--surface)] p-4 md:p-5 transition-all duration-200 hover:border-[var(--sungold)]/30 hover:shadow-[var(--shadow-sharp-sm)]"
      aria-labelledby={`asset-title-${asset.id}`}
    >
      <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-[var(--sungold)] opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 pointer-events-none" />
      <div className="flex flex-col gap-3 relative z-0 flex-1 min-h-0">
        <div className="flex items-start justify-between gap-2 min-w-0">
          <div className="min-w-0 flex-1">
            <h2 id={`asset-title-${asset.id}`} className="font-display font-bold text-[var(--white)] text-[15px] leading-tight truncate" title={asset.title}>
              {asset.title}
            </h2>
            {asset.category && (
              <p className="font-mono text-[11px] tracking-[0.08em] uppercase text-[var(--sungold)] mt-1">
                {asset.category}
              </p>
            )}
          </div>
          <span className="font-mono text-[10px] tracking-[0.1em] uppercase text-[var(--subtle)] shrink-0">
            {ASSET_TYPE_LABELS[asset.asset_type] || asset.asset_type}
          </span>
        </div>
        {asset.description && (
          <p className="font-body text-[13px] text-[var(--muted)] leading-relaxed line-clamp-3">
            {asset.description}
          </p>
        )}
        {isOther && !asset.external_url && !asset.file_path && (
          <p className="font-mono text-[12px] text-[var(--subtle)] italic line-clamp-2">
            Not a digital file — see description or contact for details.
          </p>
        )}
        <div className="mt-auto pt-1">
          {href && (
            <a
              href={href}
              target={openInNewTab ? '_blank' : undefined}
              rel={openInNewTab ? 'noopener noreferrer' : undefined}
              className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.1em] uppercase text-[var(--sungold)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sungold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--void)] w-fit"
            >
              {isFile ? (
                <>
                  <Download className="h-4 w-4 shrink-0" aria-hidden />
                  <span className="truncate">{label || 'Download'}</span>
                </>
              ) : (
                <>
                  <ExternalLink className="h-4 w-4 shrink-0" aria-hidden />
                  {label || 'Open link'}
                </>
              )}
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
}

export default function AssetsPage() {
  const [typeFilter, setTypeFilter] = useState('all');
  const { data: assets, loading, error } = useRealtimeQuery('assets', fetchAssets, []);

  usePageMeta({
    title: 'Assets & Downloads',
    description: 'Design files, resources, and links shared by Ajibola Akelebe.',
    canonical: '/assets',
  });

  const filtered = useMemo(() => {
    const list = Array.isArray(assets) ? assets : [];
    if (typeFilter === 'all') return list;
    return list.filter((a) => a.asset_type === typeFilter);
  }, [assets, typeFilter]);

  const sorted = useMemo(
    () => applySort(filtered, byNumber('sort_order', 'asc')),
    [filtered]
  );

  return (
    <>
      <section className="relative pt-12 pb-8 md:pt-24 md:pb-16 border-b border-[var(--border)] overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[120%] bg-[var(--nebula)] opacity-[0.05] blur-[160px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[80%] bg-[var(--sungold)] opacity-[0.03] blur-[140px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-[1160px] mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <SectionKicker label="Resources" accent="sungold" />
            <h1 className="font-display font-extrabold leading-[1.05] tracking-[-0.03em] mb-6 text-[var(--white)] max-w-[800px]" style={{ fontSize: 'clamp(40px, 8vw, 80px)' }}>
              Assets &amp; Downloads
            </h1>
            <p className="font-body text-[17px] leading-[1.7] max-w-[600px] text-[var(--muted)]">
              Design files, toolkits, and external links I share. Some items are not digital — check the description.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ top: '-10%' }}
          animate={{ top: '110%' }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          className="absolute left-0 w-full h-px bg-gradient-to-r from-transparent via-[var(--sungold)]/10 to-transparent pointer-events-none z-0"
        />
      </section>

      <section className="py-12 md:py-20 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.15] pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        <div className="relative z-10 max-w-[1160px] mx-auto px-4 md:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
            <FilterButtons options={FILTER_OPTIONS} value={typeFilter} onChange={setTypeFilter} label="Type" />
          </div>

          {loading && (!assets || assets.length === 0) ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-40 md:h-44 bg-[var(--surface)] border border-[var(--border)] animate-pulse" />
              ))}
            </div>
          ) : error ? (
            <p role="alert" className="font-body text-[var(--terracotta)] text-sm py-4">
              {error.message || 'Failed to load assets.'}
            </p>
          ) : sorted.length === 0 ? (
            <p className="font-body text-[17px] text-[var(--muted)] leading-relaxed">
              {typeFilter === 'all' ? 'No assets yet.' : `No ${typeFilter} assets.`}
            </p>
          ) : (
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 list-none p-0 m-0" aria-label="Asset list">
              {sorted.map((asset) => (
                <li key={asset.id} className="min-h-[180px]">
                  <AssetCard asset={asset} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  );
}
