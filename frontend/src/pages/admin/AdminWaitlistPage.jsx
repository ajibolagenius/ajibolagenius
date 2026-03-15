import React, { useState, useEffect, useMemo } from 'react';
import { Bell, Copy, Check, Download } from 'lucide-react';
import { Button } from '../../components/ui/button';
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

function exportWaitlistCSV(items) {
  const header = 'email,course_slug,created_at';
  const rows = items.map((r) => {
    const email = (r.email || '').replace(/"/g, '""');
    const slug = (r.course_slug || '').replace(/"/g, '""');
    const date = r.created_at ? new Date(r.created_at).toISOString() : '';
    return `"${email}","${slug}",${date ? `"${date}"` : ''}`;
  });
  return [header, ...rows].join('\n');
}

function downloadCSV(content, filename) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function AdminWaitlistPage() {
  const [list, setList] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    setLoading(true);
    adminEndpoints.courseWaitlist.list().then(setList).catch(() => setList([])).finally(() => setLoading(false));
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

  const handleExport = () => {
    if (list.length === 0) return;
    const csv = exportWaitlistCSV(list);
    downloadCSV(csv, `course-waitlist-${new Date().toISOString().slice(0, 10)}.csv`);
  };

  return (
    <div>
      <AdminPageHeader
        kicker="Engagement"
        title="Course waitlist"
        subtitle="Notify me when a course opens — signups from /teach."
      />

      {loading ? (
        <p className="text-[var(--muted)] font-mono text-sm">Loading…</p>
      ) : list.length === 0 ? (
        <div className="border border-[var(--border)] border-dashed rounded p-12 text-center">
          <Bell className="w-12 h-12 mx-auto mb-4 text-[var(--muted)]" />
          <p className="text-[var(--muted)] font-body mb-1">No waitlist signups yet.</p>
          <p className="font-mono text-[11px] text-[var(--subtle)]">Signups from the Teach page will appear here.</p>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] text-[var(--subtle)] uppercase">Total</span>
              <span className="font-display text-[18px] font-bold text-[var(--nebula)]">{list.length}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-[var(--border)] text-[var(--white)]"
              onClick={handleExport}
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedList.map((r) => (
              <div
                key={r.id}
                className="group flex items-center gap-4 p-4 border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--border-md)] transition-colors"
              >
                <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-[var(--elevated)] border border-[var(--border)]">
                  <Bell className="w-4 h-4 text-[var(--muted)]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-body text-sm text-[var(--white)] truncate" title={r.email}>
                    {r.email}
                  </p>
                  <p className="font-mono text-[10px] text-[var(--subtle)] mt-0.5">
                    {r.course_slug ? `Course: ${r.course_slug}` : 'Any course'} · {formatDate(r.created_at)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => copyEmail(r.email, r.id)}
                  className="flex-shrink-0 p-2 rounded border border-[var(--border)] bg-transparent text-[var(--muted)] hover:text-[var(--nebula)] hover:border-[var(--nebula)]/50 transition-colors"
                  title="Copy email"
                  aria-label="Copy email"
                >
                  {copiedId === r.id ? <Check className="w-4 h-4 text-[var(--nebula)]" /> : <Copy className="w-4 h-4" />}
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
