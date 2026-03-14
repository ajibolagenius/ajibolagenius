import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../../components/ui/alert-dialog';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import ListPagination from '../../components/portfolio/ListPagination';
import { paginate } from '../../lib/paginate';
import { adminEndpoints } from '../../services/adminApi';
import { Quote, Pencil, Trash2 } from 'lucide-react';

const ADMIN_PAGE_SIZE = 12;

const emptyItem = () => ({ name: '', role: '', text: '', approved: true });

function truncate(str, max = 80) {
  if (!str || str.length <= max) return str;
  return str.slice(0, max).trim() + '…';
}

export default function AdminTestimonialsPage() {
  const [list, setList] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyItem());
  const [saving, setSaving] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  const load = () => {
    setLoading(true);
    adminEndpoints.testimonials.list().then(setList).catch(() => setList([])).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const { items: paginatedList, totalPages, start, end, total } = useMemo(
    () => paginate(list, page, ADMIN_PAGE_SIZE),
    [list, page]
  );

  const openCreate = () => {
    setEditing(null);
    setForm(emptyItem());
    setDialogOpen(true);
  };
  const openEdit = (p) => {
    setEditing(p);
    setForm({ name: p.name ?? '', role: p.role ?? '', text: p.text ?? '', approved: p.approved !== false });
    setDialogOpen(true);
  };
  const openDelete = (p) => {
    setToDelete(p);
    setDeleteOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editing) await adminEndpoints.testimonials.update(editing.id, form);
      else await adminEndpoints.testimonials.create(form);
      setDialogOpen(false);
      load();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!toDelete) return;
    try {
      await adminEndpoints.testimonials.delete(toDelete.id);
      setDeleteOpen(false);
      setToDelete(null);
      load();
    } catch (e) {
      console.error(e);
    }
  };

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <AdminPageHeader
          kicker="Content"
          title="Testimonials"
          subtitle="Quotes shown on the Teach page. Add student or client testimonials."
        />
        <Button
          onClick={openCreate}
          className="self-start sm:self-center h-11 font-display font-semibold text-[13px] bg-[var(--sungold)] text-[var(--void)] rounded-none hover:shadow-[var(--shadow-sharp-gold)] hover:-translate-y-0.5"
        >
          Add testimonial
        </Button>
      </div>

      {loading ? (
        <p className="text-[var(--muted)] font-mono text-sm">Loading…</p>
      ) : list.length === 0 ? (
        <div className="border border-[var(--border)] border-dashed rounded p-12 text-center">
          <Quote className="w-12 h-12 mx-auto mb-4 text-[var(--muted)]" />
          <p className="text-[var(--muted)] font-body mb-4">No testimonials yet.</p>
          <Button onClick={openCreate} variant="outline" className="border-[var(--border)] text-[var(--white)]">
            Add first testimonial
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedList.map((t) => (
              <div
                key={t.id}
                className="group relative p-5 border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--border-md)] transition-colors"
              >
                <Quote size={18} className="mb-3 text-[var(--sungold)] opacity-60" />
                <p className="font-body text-[13px] leading-[1.6] text-[var(--muted)] mb-4 line-clamp-3">
                  &ldquo;{truncate(t.text, 120)}&rdquo;
                </p>
                <div className="mb-4 flex items-center justify-between gap-2">
                  <div>
                    <p className="font-display text-[13px] font-semibold text-[var(--white)]">{t.name}</p>
                    <p className="font-mono text-[10px] text-[var(--sungold)]">{t.role}</p>
                  </div>
                  <span
                    className={`font-mono text-[10px] px-2 py-0.5 shrink-0 ${t.approved !== false ? 'bg-[var(--nebula)]/20 text-[var(--nebula)]' : 'bg-[var(--muted)]/20 text-[var(--muted)]'}`}
                  >
                    {t.approved !== false ? 'Approved' : 'Pending'}
                  </span>
                </div>
                <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-8 w-8 bg-[var(--void)]/90 text-[var(--white)]"
                    onClick={() => openEdit(t)}
                    aria-label="Edit"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-8 w-8 bg-[var(--terracotta)]/90 text-white"
                    onClick={() => openDelete(t)}
                    aria-label="Delete"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <ListPagination page={page} totalPages={totalPages} onPageChange={setPage} range={{ start, end, total }} />
        </>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg border-[var(--border)] bg-[var(--surface)] text-[var(--white)]">
          <DialogDescription className="sr-only">
            Form to add or edit a testimonial: name, role, and quote text.
          </DialogDescription>
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit testimonial' : 'New testimonial'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4" role="form" aria-label={editing ? 'Edit testimonial' : 'New testimonial'}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="testimonial-name">Name</Label>
                <Input
                  id="testimonial-name"
                  value={form.name}
                  onChange={(e) => update('name', e.target.value)}
                  placeholder="e.g. Jane Doe"
                  className="bg-[var(--elevated)] border-[var(--border-md)]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="testimonial-role">Role</Label>
                <Input
                  id="testimonial-role"
                  value={form.role}
                  onChange={(e) => update('role', e.target.value)}
                  placeholder="e.g. Student — React Course"
                  className="bg-[var(--elevated)] border-[var(--border-md)]"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="testimonial-text">Quote</Label>
              <Textarea
                id="testimonial-text"
                value={form.text}
                onChange={(e) => update('text', e.target.value)}
                rows={4}
                placeholder="Student or client quote…"
                className="bg-[var(--elevated)] border-[var(--border-md)]"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="testimonial-approved"
                checked={form.approved !== false}
                onChange={(e) => update('approved', e.target.checked)}
                className="rounded border-[var(--border-md)] bg-[var(--elevated)] text-[var(--sungold)] focus:ring-[var(--sungold)]"
              />
              <Label htmlFor="testimonial-approved" className="font-body text-[13px] cursor-pointer">
                Approved (show on Teach page)
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} className="border-[var(--border)] text-[var(--white)]">
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving} className="bg-[var(--sungold)] text-[var(--void)]">
              {saving ? 'Saving…' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent className="border-[var(--border)] bg-[var(--surface)]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[var(--white)]">Delete testimonial?</AlertDialogTitle>
            <AlertDialogDescription className="text-[var(--muted)]">
              {toDelete?.name} will be removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-[var(--border)] text-[var(--white)]">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-[var(--terracotta)] text-white">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
