import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Checkbox } from '../../components/ui/checkbox';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../../components/ui/alert-dialog';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import ListPagination from '../../components/portfolio/ListPagination';
import { paginate } from '../../lib/paginate';
import { adminEndpoints } from '../../services/adminApi';

const ADMIN_PAGE_SIZE = 10;

export default function AdminBlogPage() {
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [search, setSearch] = useState('');
  const [bulkDeleting, setBulkDeleting] = useState(false);

  const load = () => {
    setLoading(true);
    adminEndpoints.blogPosts.list().then(setList).catch(() => setList([])).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const filteredList = useMemo(() => {
    if (!search.trim()) return list;
    const q = search.trim().toLowerCase();
    return list.filter((p) =>
      (p.title || '').toLowerCase().includes(q) ||
      (p.slug || '').toLowerCase().includes(q) ||
      (p.excerpt || '').toLowerCase().includes(q) ||
      (p.date || '').toLowerCase().includes(q)
    );
  }, [list, search]);

  const { items: paginatedList, totalPages, start, end, total } = useMemo(
    () => paginate(filteredList, page, ADMIN_PAGE_SIZE),
    [filteredList, page]
  );

  const openDelete = (p) => { setToDelete(p); setDeleteOpen(true); };

  const handleDelete = async () => {
    if (!toDelete) return;
    try {
      await adminEndpoints.blogPosts.delete(toDelete.id);
      setDeleteOpen(false);
      setToDelete(null);
      setSelectedIds((s) => { const n = new Set(s); n.delete(toDelete.id); return n; });
      load();
    } catch (e) { console.error(e); }
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
    const onPage = paginatedList.map((p) => p.id);
    const allSelected = onPage.every((id) => selectedIds.has(id));
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
        await adminEndpoints.blogPosts.delete(id);
      }
      setSelectedIds(new Set());
      load();
    } catch (e) { console.error(e); } finally { setBulkDeleting(false); }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <AdminPageHeader kicker="Content" title="Blog posts" subtitle="Shown on Writing list and article page (/writing/[slug]). Unpublished posts are hidden from the site." />
        <Button onClick={() => navigate('/admin/blog/new')} className="self-start sm:self-center h-11 font-display font-semibold text-[13px] bg-[var(--sungold)] text-[var(--void)] rounded-none hover:shadow-[var(--shadow-sharp-gold)] hover:-translate-y-0.5">Add post</Button>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <Input
          type="search"
          placeholder="Search by title, slug, excerpt, date…"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="max-w-sm bg-[var(--elevated)] border-[var(--border-md)] font-mono text-[13px]"
          aria-label="Search blog posts"
        />
        {selectedIds.size > 0 && (
          <Button variant="outline" size="sm" onClick={handleBulkDelete} disabled={bulkDeleting} className="border-[var(--terracotta)] text-[var(--terracotta)] hover:bg-[var(--terracotta)]/10">
            {bulkDeleting ? 'Deleting…' : `Delete ${selectedIds.size} selected`}
          </Button>
        )}
      </div>
      {loading ? <p className="text-[var(--muted)] font-mono text-sm">Loading…</p> : (
        <div className="border border-[var(--border)] overflow-x-auto">
          <table className="w-full text-left min-w-[600px]">
            <thead className="bg-[var(--surface)] border-b border-[var(--border)]">
              <tr>
                <th className="w-10 px-2 py-3">
                  <Checkbox
                    aria-label="Select all on page"
                    checked={paginatedList.length > 0 && paginatedList.every((p) => selectedIds.has(p.id))}
                    onCheckedChange={toggleSelectAll}
                    className="border-[var(--border-md)] data-[state=checked]:bg-[var(--sungold)]"
                  />
                </th>
                <th className="px-4 py-3 font-mono text-[11px] text-[var(--subtle)] uppercase">Title</th>
                <th className="px-4 py-3 font-mono text-[11px] text-[var(--subtle)] uppercase">Date</th>
                <th className="px-4 py-3 font-mono text-[11px] text-[var(--subtle)] uppercase w-20">Status</th>
                <th className="px-4 py-3 font-mono text-[11px] text-[var(--subtle)] uppercase w-28">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {paginatedList.map((p) => (
                <tr key={p.id} className="bg-[var(--elevated)]/50 hover:bg-[var(--elevated)]">
                  <td className="w-10 px-2 py-3">
                    <Checkbox
                      aria-label={`Select ${p.title}`}
                      checked={selectedIds.has(p.id)}
                      onCheckedChange={() => toggleSelect(p.id)}
                      className="border-[var(--border-md)] data-[state=checked]:bg-[var(--sungold)]"
                    />
                  </td>
                  <td className="px-4 py-3 font-body text-sm text-[var(--white)]">{p.title}</td>
                  <td className="px-4 py-3 font-mono text-[12px] text-[var(--muted)]">{p.date}</td>
                  <td className="px-4 py-3">
                    {p.published === false ? <span className="font-mono text-[11px] text-[var(--terracotta)]">Draft</span> : <span className="font-mono text-[11px] text-[var(--stardust)]">Published</span>}
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => navigate(`/admin/blog/edit/${p.id}`)}>Edit</Button>
                    <Button variant="ghost" size="sm" className="text-[var(--terracotta)]" onClick={() => openDelete(p)}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {filteredList.length > 0 && (
        <ListPagination page={page} totalPages={totalPages} onPageChange={setPage} range={{ start, end, total: filteredList.length }} />
      )}

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent className="border-[var(--border)] bg-[var(--surface)]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[var(--white)]">Delete post?</AlertDialogTitle>
            <AlertDialogDescription className="text-[var(--muted)]">{toDelete?.title} will be removed.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-[var(--border)] text-[var(--white)]">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-[var(--terracotta)] text-white">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
