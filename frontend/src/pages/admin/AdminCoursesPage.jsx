import React, { useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../../components/ui/alert-dialog';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import { adminEndpoints } from '../../services/adminApi';

const emptyCourse = () => ({ slug: '', name: '', duration: '', price: '', badge: '', description: '', curriculum: [] });

export default function AdminCoursesPage() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyCourse());
  const [saving, setSaving] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  const load = () => {
    setLoading(true);
    adminEndpoints.courses.list().then(setList).catch(() => setList([])).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openCreate = () => { setEditing(null); setForm(emptyCourse()); setDialogOpen(true); };
  const openEdit = (p) => {
    setEditing(p);
    setForm({ ...p, curriculum: Array.isArray(p.curriculum) ? p.curriculum.join('\n') : '' });
    setDialogOpen(true);
  };
  const openDelete = (p) => { setToDelete(p); setDeleteOpen(true); };

  const handleSave = async () => {
    const payload = {
      ...form,
      curriculum: typeof form.curriculum === 'string' ? form.curriculum.split('\n').map((s) => s.trim()).filter(Boolean) : form.curriculum,
    };
    setSaving(true);
    try {
      if (editing) await adminEndpoints.courses.update(editing.id, payload);
      else await adminEndpoints.courses.create(payload);
      setDialogOpen(false);
      load();
    } catch (e) { console.error(e); } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!toDelete) return;
    try {
      await adminEndpoints.courses.delete(toDelete.id);
      setDeleteOpen(false);
      setToDelete(null);
      load();
    } catch (e) { console.error(e); }
  };

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <AdminPageHeader kicker="Content" title="Courses" subtitle="Shown on Teach page and home Courses section. Enroll links use WhatsApp from Personal info." />
        <Button onClick={openCreate} className="self-start sm:self-center h-11 font-display font-semibold text-[13px] bg-[var(--sungold)] text-[var(--void)] rounded-none hover:shadow-[var(--shadow-sharp-gold)] hover:-translate-y-0.5">Add course</Button>
      </div>
      {loading ? <p className="text-[var(--muted)] font-mono text-sm">Loading…</p> : (
        <div className="border border-[var(--border)] overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-[var(--surface)] border-b border-[var(--border)]">
              <tr>
                <th className="px-4 py-3 font-mono text-[11px] text-[var(--subtle)] uppercase">Name</th>
                <th className="px-4 py-3 font-mono text-[11px] text-[var(--subtle)] uppercase">Badge</th>
                <th className="px-4 py-3 font-mono text-[11px] text-[var(--subtle)] uppercase w-28">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {list.map((p) => (
                <tr key={p.id} className="bg-[var(--elevated)]/50 hover:bg-[var(--elevated)]">
                  <td className="px-4 py-3 font-body text-sm text-[var(--white)]">{p.name}</td>
                  <td className="px-4 py-3 font-mono text-[12px] text-[var(--muted)]">{p.badge}</td>
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
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto border-[var(--border)] bg-[var(--surface)] text-[var(--white)]">
          <DialogHeader><DialogTitle>{editing ? 'Edit course' : 'New course'}</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Slug</Label><Input value={form.slug} onChange={(e) => update('slug', e.target.value)} placeholder="e.g. nextjs-basics" className="bg-[var(--elevated)] border-[var(--border-md)]" /></div>
              <div className="space-y-2"><Label>Badge</Label><Input value={form.badge} onChange={(e) => update('badge', e.target.value)} placeholder="e.g. 2 Weeks" className="bg-[var(--elevated)] border-[var(--border-md)]" /></div>
            </div>
            <div className="space-y-2"><Label>Name</Label><Input value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="e.g. Next.js Basics" className="bg-[var(--elevated)] border-[var(--border-md)]" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Duration</Label><Input value={form.duration} onChange={(e) => update('duration', e.target.value)} placeholder="2 Weeks" className="bg-[var(--elevated)] border-[var(--border-md)]" /></div>
              <div className="space-y-2"><Label>Price</Label><Input value={form.price} onChange={(e) => update('price', e.target.value)} placeholder="₦100K" className="bg-[var(--elevated)] border-[var(--border-md)]" /></div>
            </div>
            <div className="space-y-2"><Label>Description</Label><Textarea value={form.description} onChange={(e) => update('description', e.target.value)} rows={2} placeholder="Course overview for Teach page" className="bg-[var(--elevated)] border-[var(--border-md)]" /></div>
            <div className="space-y-2"><Label>Curriculum (one topic per line)</Label><Textarea value={Array.isArray(form.curriculum) ? form.curriculum.join('\n') : (form.curriculum || '')} onChange={(e) => update('curriculum', e.target.value)} rows={6} placeholder={"Module 1: Intro\nModule 2: Build"} className="bg-[var(--elevated)] border-[var(--border-md)]" /></div>
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
            <AlertDialogTitle className="text-[var(--white)]">Delete course?</AlertDialogTitle>
            <AlertDialogDescription className="text-[var(--muted)]">{toDelete?.name} will be removed.</AlertDialogDescription>
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
