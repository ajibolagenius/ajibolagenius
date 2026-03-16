import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../../components/ui/alert-dialog';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import ListPagination from '../../components/portfolio/ListPagination';
import { paginate } from '../../lib/paginate';
import { adminEndpoints } from '../../services/adminApi';
import { Wrench, Pencil, Trash2, GripVertical } from 'lucide-react';

const ADMIN_PAGE_SIZE = 12;

const emptyItem = () => ({ name: '', level: 50, order: 0 });

export default function AdminSkillsPage() {
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
    adminEndpoints.skills.list().then(setList).catch(() => setList([])).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const { items: paginatedList, totalPages, start, end, total } = useMemo(
    () => paginate(list, page, ADMIN_PAGE_SIZE),
    [list, page]
  );

  const openCreate = () => {
    setEditing(null);
    setForm({ ...emptyItem(), order: list.length + 1 });
    setDialogOpen(true);
  };
  const openEdit = (s) => {
    setEditing(s);
    setForm({ name: s.name ?? '', level: s.level ?? 50, order: s.order ?? 0 });
    setDialogOpen(true);
  };
  const openDelete = (s) => {
    setToDelete(s);
    setDeleteOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editing) await adminEndpoints.skills.update(editing.id, form);
      else await adminEndpoints.skills.create(form);
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
      await adminEndpoints.skills.delete(toDelete.id);
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
          title="Skills & Tools"
          subtitle="Manage skills displayed on the About and CV pages. Adjust names, proficiency levels, and display order."
        />
        <Button
          onClick={openCreate}
          className="self-start sm:self-center h-11 font-display font-semibold text-[13px] bg-[var(--sungold)] text-[var(--void)] rounded-none hover:shadow-[var(--shadow-sharp-gold)] hover:-translate-y-0.5"
        >
          Add skill
        </Button>
      </div>

      {loading ? (
        <p className="text-[var(--muted)] font-mono text-sm">Loading…</p>
      ) : list.length === 0 ? (
        <div className="border border-[var(--border)] border-dashed rounded p-12 text-center">
          <Wrench className="w-12 h-12 mx-auto mb-4 text-[var(--muted)]" />
          <p className="text-[var(--muted)] font-body mb-4">No skills added yet.</p>
          <Button onClick={openCreate} variant="outline" className="border-[var(--border)] text-[var(--white)]">
            Add first skill
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedList.map((s) => (
              <div
                key={s.id}
                className="group relative p-5 border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--border-md)] transition-colors"
              >
                <div className="flex items-center gap-2 mb-3">
                  <GripVertical size={14} className="text-[var(--subtle)]" />
                  <span className="font-mono text-[10px] text-[var(--subtle)]">#{s.order}</span>
                </div>
                <h3 className="font-display text-[15px] font-semibold text-[var(--white)] mb-2">{s.name}</h3>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-[3px] bg-[var(--elevated)] overflow-hidden">
                    <div
                      className="h-full bg-[var(--sungold)]"
                      style={{ width: `${s.level}%` }}
                    />
                  </div>
                  <span className="font-mono text-[11px] text-[var(--subtle)] shrink-0">{s.level}%</span>
                </div>
                <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-8 w-8 bg-[var(--void)]/90 text-[var(--white)]"
                    onClick={() => openEdit(s)}
                    aria-label="Edit"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-8 w-8 bg-[var(--terracotta)]/90 text-white"
                    onClick={() => openDelete(s)}
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
        <DialogContent className="max-w-md border-[var(--border)] bg-[var(--surface)] text-[var(--white)]">
          <DialogDescription className="sr-only">
            Form to add or edit a skill: name, proficiency level, and display order.
          </DialogDescription>
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit skill' : 'New skill'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4" role="form" aria-label={editing ? 'Edit skill' : 'New skill'}>
            <div className="space-y-2">
              <Label htmlFor="skill-name">Name</Label>
              <Input
                id="skill-name"
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                placeholder="e.g. React / Next.js"
                className="bg-[var(--elevated)] border-[var(--border-md)]"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="skill-level">Proficiency (%)</Label>
                <Input
                  id="skill-level"
                  type="number"
                  min={0}
                  max={100}
                  value={form.level}
                  onChange={(e) => update('level', parseInt(e.target.value, 10) || 0)}
                  className="bg-[var(--elevated)] border-[var(--border-md)]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="skill-order">Order</Label>
                <Input
                  id="skill-order"
                  type="number"
                  min={0}
                  value={form.order}
                  onChange={(e) => update('order', parseInt(e.target.value, 10) || 0)}
                  className="bg-[var(--elevated)] border-[var(--border-md)]"
                />
              </div>
            </div>
            {/* Live preview bar */}
            <div>
              <Label className="text-[var(--subtle)] text-[11px] mb-1 block">Preview</Label>
              <div className="h-[4px] bg-[var(--elevated)] overflow-hidden">
                <div className="h-full bg-[var(--sungold)] transition-all duration-300" style={{ width: `${form.level}%` }} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} className="border-[var(--border)] text-[var(--white)]">
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving || !form.name.trim()} className="bg-[var(--sungold)] text-[var(--void)]">
              {saving ? 'Saving…' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent className="border-[var(--border)] bg-[var(--surface)]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[var(--white)]">Delete skill?</AlertDialogTitle>
            <AlertDialogDescription className="text-[var(--muted)]">
              "{toDelete?.name}" will be permanently removed from the About and CV pages.
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
