import React, { useState, useEffect, useMemo } from 'react';
import { Mail, Copy, Check } from 'lucide-react';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import ListPagination from '../../components/portfolio/ListPagination';
import { paginate } from '../../lib/paginate';
import { adminEndpoints } from '../../services/adminApi';

const ADMIN_PAGE_SIZE = 12;

function formatDate(createdAt) {
  if (!createdAt) return '—';
  try {
    const d = new Date(createdAt);
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  } catch {
    return '—';
  }
}

export default function AdminNewsletterPage() {
  const [list, setList] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    setLoading(true);
    adminEndpoints.newsletterSubscribers.list().then(setList).catch(() => setList([])).finally(() => setLoading(false));
  }, []);

  const { items: paginatedList, totalPages, start, end, total } = useMemo(
    () => paginate(list, page, ADMIN_PAGE_SIZE),
    [list, page]
  );

  const copyEmail = (email, id) => {
    navigator.clipboard?.writeText(email).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  return (
    <div>
      <AdminPageHeader
        kicker="Engagement"
        title="Newsletter"
        subtitle="Subscribers from the signup on /writing. Total shown below."
      />

      {loading ? (
        <p className="text-[var(--muted)] font-mono text-sm">Loading…</p>
      ) : list.length === 0 ? (
        <div className="border border-[var(--border)] border-dashed rounded p-12 text-center">
          <Mail className="w-12 h-12 mx-auto mb-4 text-[var(--muted)]" />
          <p className="text-[var(--muted)] font-body mb-1">No subscribers yet.</p>
          <p className="font-mono text-[11px] text-[var(--subtle)]">Subscriptions from the blog /writing page will appear here.</p>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2 mb-4">
            <span className="font-mono text-[11px] text-[var(--subtle)] uppercase">Total</span>
            <span className="font-display text-[18px] font-bold text-[var(--sungold)]">{list.length}</span>
            <span className="font-mono text-[11px] text-[var(--muted)]">subscribers</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedList.map((s) => (
              <div
                key={s.id}
                className="group flex items-center gap-4 p-4 border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--border-md)] transition-colors"
              >
                <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-[var(--elevated)] border border-[var(--border)]">
                  <Mail className="w-4 h-4 text-[var(--muted)]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-body text-sm text-[var(--white)] truncate" title={s.email}>
                    {s.email}
                  </p>
                  <p className="font-mono text-[10px] text-[var(--subtle)] mt-0.5">{formatDate(s.created_at)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => copyEmail(s.email, s.id)}
                  className="flex-shrink-0 p-2 rounded border border-[var(--border)] bg-transparent text-[var(--muted)] hover:text-[var(--sungold)] hover:border-[var(--sungold)]/50 transition-colors"
                  title="Copy email"
                  aria-label="Copy email"
                >
                  {copiedId === s.id ? <Check className="w-4 h-4 text-[var(--sungold)]" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            ))}
          </div>
          <ListPagination page={page} totalPages={totalPages} onPageChange={setPage} range={{ start, end, total }} />
        </>
      )}
    </div>
  );
}
