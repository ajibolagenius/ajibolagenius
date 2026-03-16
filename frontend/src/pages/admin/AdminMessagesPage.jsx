import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Copy, Check, Mail, User, FileText } from 'lucide-react';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import ListPagination from '../../components/portfolio/ListPagination';
import { paginate } from '../../lib/paginate';
import { adminEndpoints } from '../../services/adminApi';

const ADMIN_PAGE_SIZE = 12;

function formatDate(createdAt) {
  if (!createdAt) return '—';
  try {
    const d = new Date(createdAt);
    return d.toLocaleString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch {
    return '—';
  }
}

export default function AdminMessagesPage() {
  const [list, setList] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    setLoading(true);
    adminEndpoints.contactMessages.list().then(setList).catch(() => setList([])).finally(() => setLoading(false));
  }, []);

  const { items: paginatedList, totalPages, start, end, total } = useMemo(
    () => paginate(list, page, ADMIN_PAGE_SIZE),
    [list, page]
  );

  const copyEmail = (email, id) => {
    navigator.clipboard?.writeText(email)?.then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    })?.catch(() => {});
  };

  const toggleExpand = (id) => setExpandedId((prev) => (prev === id ? null : id));

  return (
    <div>
      <AdminPageHeader
        kicker="Engagement"
        title="Contact messages"
        subtitle="Form submissions from the contact page."
      />

      {loading ? (
        <p className="text-[var(--muted)] font-mono text-sm">Loading…</p>
      ) : list.length === 0 ? (
        <div className="border border-[var(--border)] border-dashed rounded p-12 text-center relative">
          <div className="absolute -top-px -left-px w-3 h-3 border-t border-l border-[var(--stardust)] opacity-40" />
          <MessageSquare className="w-12 h-12 mx-auto mb-4 text-[var(--muted)]" />
          <p className="text-[var(--muted)] font-body mb-1">No messages yet.</p>
          <p className="font-mono text-[11px] text-[var(--subtle)]">Messages from /contact will appear here.</p>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2 mb-4">
            <span className="font-mono text-[11px] text-[var(--subtle)] uppercase">Total</span>
            <span className="font-display text-[18px] font-bold text-[var(--stardust)]">{list.length}</span>
            <span className="font-mono text-[11px] text-[var(--muted)]">messages</span>
          </div>
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-4"
            initial="hidden"
            animate="visible"
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.06 } } }}
          >
            {paginatedList.map((m) => {
              const isExpanded = expandedId === m.id;
              const messagePreview = (m.message || '').slice(0, 120);
              const showExpand = (m.message || '').length > 120;
              return (
                <motion.div
                  key={m.id}
                  variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
                  className="group flex flex-col p-4 border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--stardust)]/30 hover:shadow-[var(--shadow-sharp-sm)] transition-all duration-200 relative"
                >
                  {/* Corner accent */}
                  <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[var(--stardust)] opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
                  <div className="flex items-start gap-3 mb-2">
                    <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-[var(--elevated)] border border-[var(--border)]">
                      <MessageSquare className="w-4 h-4 text-[var(--stardust)]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-body text-sm font-medium text-[var(--white)] flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-[var(--muted)] shrink-0" />
                        {m.name || '—'}
                      </p>
                      <p className="font-mono text-[11px] text-[var(--subtle)] mt-0.5 flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate" title={m.email}>{m.email}</span>
                        <button
                          type="button"
                          onClick={() => copyEmail(m.email, m.id)}
                          className="flex-shrink-0 p-1 rounded border border-transparent hover:border-[var(--border)] text-[var(--muted)] hover:text-[var(--stardust)] transition-colors"
                          title="Copy email"
                          aria-label="Copy email"
                        >
                          {copiedId === m.id ? <Check className="w-3.5 h-3.5 text-[var(--stardust)]" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </p>
                    </div>
                  </div>
                  {m.subject != null && m.subject !== '' && (
                    <p className="font-body text-xs text-[var(--muted)] flex items-center gap-2 mb-2">
                      <FileText className="w-3.5 h-3.5 shrink-0" />
                      {m.subject}
                    </p>
                  )}
                  <div className="mt-2 pt-2 border-t border-[var(--border)]">
                    <p className="font-body text-[13px] text-[var(--white)] whitespace-pre-wrap">
                      {isExpanded ? (m.message || '—') : (messagePreview + (showExpand ? '…' : ''))}
                    </p>
                    {showExpand && (
                      <button
                        type="button"
                        onClick={() => toggleExpand(m.id)}
                        className="mt-2 font-mono text-[11px] text-[var(--stardust)] hover:underline"
                      >
                        {isExpanded ? 'Show less' : 'Show more'}
                      </button>
                    )}
                  </div>
                  <p className="font-mono text-[10px] text-[var(--subtle)] mt-3">{formatDate(m.created_at)}</p>
                </motion.div>
              );
            })}
          </motion.div>
          <ListPagination page={page} totalPages={totalPages} onPageChange={setPage} range={{ start, end, total }} />
        </>
      )}
    </div>
  );
}
