import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../../components/ui/alert-dialog';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import ListPagination from '../../components/portfolio/ListPagination';
import { paginate } from '../../lib/paginate';
import { adminEndpoints } from '../../services/adminApi';

const ADMIN_PAGE_SIZE = 10;

const emptyEntry = () => ({ year: '', title: '', body: '', accent: 'sungold', order: 0 });

export default function AdminTimelinePage() {
  const [list, setList] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyEntry());
  const [saving, setSaving] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  const load = () => {
    setLoading(true);
    adminEndpoints.timeline.list().then(setList).catch(() => setList([])).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const { items: paginatedList, totalPages, start, end, total } = useMemo(
    () => paginate(list, page, ADMIN_PAGE_SIZE),
    [list, page]
  );

  const openCreate = () => { setEditing(null); setForm(emptyEntry()); setDialogOpen(true); };
  const openEdit = (p) => { setEditing(p); setForm({ year: p.year, title: p.title, body: p.body, accent: p.accent || 'sungold', order: p.order ?? 0 }); setDialogOpen(true); };
  const openDelete = (p) => { setToDelete(p); setDeleteOpen(true); };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editing) await adminEndpoints.timeline.update(editing.id, form);
      else await adminEndpoints.timeline.create(form);
      setDialogOpen(false);
      load();
    } catch (e) { console.error(e); } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!toDelete) return;
    try {
      await adminEndpoints.timeline.delete(toDelete.id);
      setDeleteOpen(false);
      setToDelete(null);
      load();
    } catch (e) { console.error(e); }
  };

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <AdminPageHeader kicker="Content" title="Timeline (CV)" subtitle="Shown on Home timeline and CV page. Lower order = higher in list." />
        <Button onClick={openCreate} className="self-start sm:self-center h-11 font-display font-semibold text-[13px] bg-[var(--sungold)] text-[var(--void)] rounded-none hover:shadow-[var(--shadow-sharp-gold)] hover:-translate-y-0.5">Add entry</Button>
      </div>
      {loading ? <p className="text-[var(--muted)] font-mono text-sm">Loading…</p> : (
        <div className="border border-[var(--border)] overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-[var(--surface)] border-b border-[var(--border)]">
              <tr>
                <th className="px-4 py-3 font-mono text-[11px] text-[var(--subtle)] uppercase">Year</th>
                <th className="px-4 py-3 font-mono text-[11px] text-[var(--subtle)] uppercase">Title</th>
                <th className="px-4 py-3 font-mono text-[11px] text-[var(--subtle)] uppercase w-28">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {paginatedList.map((p) => (
                <tr key={p.id} className="bg-[var(--elevated)]/50 hover:bg-[var(--elevated)]">
                  <td className="px-4 py-3 font-mono text-[12px] text-[var(--sungold)]">{p.year}</td>
                  <td className="px-4 py-3 font-body text-sm text-[var(--white)]">{p.title}</td>
                  <td className="px-4 py-3 flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => openEdit(p)}>Edit</Button>
                    <Button variant="ghost" size="sm" className="text-[var(--terracotta)]" onClick={() => openDelete(p)}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {list.length > 0 && (
        <ListPagination page={page} totalPages={totalPages} onPageChange={setPage} range={{ start, end, total }} />
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="border-[var(--border)] bg-[var(--surface)] text-[var(--white)]">
          <DialogHeader><DialogTitle>{editing ? 'Edit entry' : 'New entry'}</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4" role="form" aria-label={editing ? 'Edit entry' : 'New entry'}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="timeline-year">Year</Label>
                <Input id="timeline-year" type="number" min={1900} max={2100} value={form.year} onChange={(e) => update('year', e.target.value)} placeholder="e.g. 2024" className="bg-[var(--elevated)] border-[var(--border-md)]" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timeline-order">Order</Label>
                <Input id="timeline-order" type="number" value={form.order} onChange={(e) => update('order', parseInt(e.target.value, 10) || 0)} placeholder="0 = first" className="bg-[var(--elevated)] border-[var(--border-md)]" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="timeline-title">Title</Label>
              <Input id="timeline-title" value={form.title} onChange={(e) => update('title', e.target.value)} placeholder="e.g. Senior Developer at X" className="bg-[var(--elevated)] border-[var(--border-md)]" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timeline-body">Body</Label>
              <Textarea id="timeline-body" value={form.body} onChange={(e) => update('body', e.target.value)} rows={4} placeholder="Responsibilities and achievements..." className="bg-[var(--elevated)] border-[var(--border-md)]" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timeline-accent">Accent (theme color)</Label>
              <Input id="timeline-accent" value={form.accent} onChange={(e) => update('accent', e.target.value)} placeholder="sungold, nebula, stardust, terracotta" className="bg-[var(--elevated)] border-[var(--border-md)]" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving} className="bg-[var(--sungold)] text-[var(--void)]">{saving ? 'Saving…' : 'Save'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent className="border-[var(--border)] bg-[var(--surface)]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[var(--white)]">Delete entry?</AlertDialogTitle>
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
