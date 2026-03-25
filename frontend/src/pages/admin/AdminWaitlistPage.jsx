import React, { useState, useEffect, useMemo } from 'react';
import { Bell, Copy, Check, Download, Trash2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Checkbox } from '../../components/ui/checkbox';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../../components/ui/alert-dialog';
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
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const load = () => {
    setLoading(true);
    adminEndpoints.courseWaitlist
      .list()
      .then((data) => setList(Array.isArray(data) ? data : []))
      .catch(() => setList([]))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const { items: paginatedList, totalPages, start, end, total } = useMemo(
    () => paginate(list, page, ADMIN_PAGE_SIZE),
    [list, page]
  );

  const copyEmail = (email, id) => {
    if (!email || !navigator.clipboard?.writeText) return;
    navigator.clipboard
      .writeText(email)
      .then(() => {
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
      })
      .catch(() => {});
  };

  const handleExport = () => {
    if (list.length === 0) return;
    const csv = exportWaitlistCSV(list);
    downloadCSV(csv, `course-waitlist-${new Date().toISOString().slice(0, 10)}.csv`);
  };

  const toggleSelect = (id) => {
    setSelectedIds((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  };

  const toggleSelectAll = () => {
    const onPage = paginatedList.map((r) => r.id);
    const allSelected = onPage.length > 0 && onPage.every((id) => selectedIds.has(id));
    setSelectedIds((s) => {
      const n = new Set(s);
      if (allSelected) onPage.forEach((id) => n.delete(id));
      else onPage.forEach((id) => n.add(id));
      return n;
    });
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    setBulkDeleting(true);
    try {
      for (const id of selectedIds) {
        await adminEndpoints.courseWaitlist.delete(id);
      }
      setSelectedIds(new Set());
      setDeleteOpen(false);
      load();
    } catch (e) { console.error(e); } finally { setBulkDeleting(false); }
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
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Checkbox
                  aria-label="Select all on page"
                  checked={paginatedList.length > 0 && paginatedList.every((r) => selectedIds.has(r.id))}
                  onCheckedChange={toggleSelectAll}
                  className="border-[var(--border-md)] data-[state=checked]:bg-[var(--nebula)]"
                />
                <span className="font-mono text-[11px] text-[var(--subtle)]">Select all</span>
              </div>
              <span className="font-mono text-[11px] text-[var(--subtle)] uppercase">Total</span>
              <span className="font-display text-[18px] font-bold text-[var(--nebula)]">{list.length}</span>
            </div>
            <div className="flex items-center gap-2">
              {selectedIds.size > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDeleteOpen(true)}
                  disabled={bulkDeleting}
                  className="border-[var(--terracotta)] text-[var(--terracotta)] hover:bg-[var(--terracotta)]/10 gap-2"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  {bulkDeleting ? 'Deleting…' : `Delete ${selectedIds.size}`}
                </Button>
              )}
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
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedList.map((r) => {
              const isSelected = selectedIds.has(r.id);
              return (
                <div
                  key={r.id}
                  className={`group flex items-center gap-4 p-4 border bg-[var(--surface)] transition-colors ${isSelected ? 'border-[var(--nebula)] bg-[var(--nebula)]/5' : 'border-[var(--border)] hover:border-[var(--border-md)]'}`}
                >
                  <Checkbox
                    aria-label={`Select ${r.email}`}
                    checked={isSelected}
                    onCheckedChange={() => toggleSelect(r.id)}
                    className="border-[var(--border-md)] data-[state=checked]:bg-[var(--nebula)]"
                  />
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
              );
            })}
          </div>
          <ListPagination page={page} totalPages={totalPages} onPageChange={setPage} range={{ start, end, total }} />
        </>
      )}

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent className="border-[var(--border)] bg-[var(--surface)]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[var(--white)]">Delete {selectedIds.size} waitlist entr{selectedIds.size !== 1 ? 'ies' : 'y'}?</AlertDialogTitle>
            <AlertDialogDescription className="text-[var(--muted)]">This action cannot be undone. The selected entries will be permanently removed.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-[var(--border)] text-[var(--white)]">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleBulkDelete} disabled={bulkDeleting} className="bg-[var(--terracotta)] text-white">
              {bulkDeleting ? 'Deleting…' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
