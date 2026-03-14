import React, { useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../../components/ui/alert-dialog';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import { adminEndpoints } from '../../services/adminApi';

const emptyItem = () => ({ title: '', type: 'UI', color: '#E8A020' });

export default function AdminGalleryPage() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyItem());
  const [saving, setSaving] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  const load = () => {
    setLoading(true);
    adminEndpoints.gallery.list().then(setList).catch(() => setList([])).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openCreate = () => { setEditing(null); setForm(emptyItem()); setDialogOpen(true); };
  const openEdit = (p) => { setEditing(p); setForm({ title: p.title, type: p.type, color: p.color || '#E8A020' }); setDialogOpen(true); };
  const openDelete = (p) => { setToDelete(p); setDeleteOpen(true); };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editing) await adminEndpoints.gallery.update(editing.id, form);
      else await adminEndpoints.gallery.create(form);
      setDialogOpen(false);
      load();
    } catch (e) { console.error(e); } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!toDelete) return;
    try {
      await adminEndpoints.gallery.delete(toDelete.id);
      setDeleteOpen(false);
      setToDelete(null);
      load();
    } catch (e) { console.error(e); }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <AdminPageHeader kicker="Content" title="Gallery" subtitle="Shown on Gallery page. Type drives filter: All, UI, 3D, Graphic." />
        <Button onClick={openCreate} className="self-start sm:self-center h-11 font-display font-semibold text-[13px] bg-[var(--sungold)] text-[var(--void)] rounded-none hover:shadow-[var(--shadow-sharp-gold)] hover:-translate-y-0.5">Add item</Button>
      </div>
      {loading ? <p className="text-[var(--muted)] font-mono text-sm">Loading…</p> : (
        <div className="border border-[var(--border)] overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-[var(--surface)] border-b border-[var(--border)]">
              <tr>
                <th className="px-4 py-3 font-mono text-[11px] text-[var(--subtle)] uppercase">Title</th>
                <th className="px-4 py-3 font-mono text-[11px] text-[var(--subtle)] uppercase">Type</th>
                <th className="px-4 py-3 font-mono text-[11px] text-[var(--subtle)] uppercase">Color</th>
                <th className="px-4 py-3 font-mono text-[11px] text-[var(--subtle)] uppercase w-28">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {list.map((p) => (
                <tr key={p.id} className="bg-[var(--elevated)]/50 hover:bg-[var(--elevated)]">
                  <td className="px-4 py-3 font-body text-sm text-[var(--white)]">{p.title}</td>
                  <td className="px-4 py-3 font-mono text-[12px] text-[var(--muted)]">{p.type}</td>
                  <td className="px-4 py-3 flex items-center gap-2">
                    <span className="w-4 h-4 rounded-none border border-[var(--border)]" style={{ backgroundColor: p.color }} />
                    <span className="font-mono text-[12px] text-[var(--muted)]">{p.color}</span>
                  </td>
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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="border-[var(--border)] bg-[var(--surface)] text-[var(--white)]">
          <DialogHeader><DialogTitle>{editing ? 'Edit item' : 'New item'}</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4" role="form" aria-label={editing ? 'Edit item' : 'New item'}>
            <div className="space-y-2">
              <Label htmlFor="gallery-title">Title</Label>
              <Input id="gallery-title" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="e.g. Dashboard UI" className="bg-[var(--elevated)] border-[var(--border-md)]" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gallery-type">Type</Label>
              <Input id="gallery-type" value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))} placeholder="UI, 3D, or Graphic" className="bg-[var(--elevated)] border-[var(--border-md)]" list="gallery-type-list" />
              <datalist id="gallery-type-list">
                <option value="UI" /><option value="3D" /><option value="Graphic" />
              </datalist>
            </div>
            <div className="space-y-2">
              <Label htmlFor="gallery-color">Color</Label>
              <div className="flex gap-2 items-center">
                <Input id="gallery-color" type="color" value={/^#[0-9A-Fa-f]{6}$/.test(form.color) ? form.color : '#E8A020'} onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))} className="h-10 w-14 p-1 cursor-pointer bg-[var(--elevated)] border-[var(--border-md)]" title="Pick color" />
                <Input type="text" value={form.color} onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))} placeholder="#E8A020" className="flex-1 bg-[var(--elevated)] border-[var(--border-md)] font-mono text-sm" aria-label="Color hex value" />
              </div>
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
            <AlertDialogTitle className="text-[var(--white)]">Delete item?</AlertDialogTitle>
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
