import React, { useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../../components/ui/alert-dialog';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import { adminEndpoints } from '../../services/adminApi';

const emptyPost = () => ({ slug: '', title: '', date: '', tags: [], category: '', excerpt: '', body: '', read_time: '' });

export default function AdminBlogPage() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyPost());
  const [saving, setSaving] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  const load = () => {
    setLoading(true);
    adminEndpoints.blogPosts.list().then(setList).catch(() => setList([])).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openCreate = () => { setEditing(null); setForm(emptyPost()); setDialogOpen(true); };
  const openEdit = (p) => {
    setEditing(p);
    setForm({ ...p, tags: Array.isArray(p.tags) ? p.tags.join(', ') : '' });
    setDialogOpen(true);
  };
  const openDelete = (p) => { setToDelete(p); setDeleteOpen(true); };

  const handleSave = async () => {
    const payload = { ...form, tags: typeof form.tags === 'string' ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : form.tags };
    setSaving(true);
    try {
      if (editing) await adminEndpoints.blogPosts.update(editing.id, payload);
      else await adminEndpoints.blogPosts.create(payload);
      setDialogOpen(false);
      load();
    } catch (e) { console.error(e); } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!toDelete) return;
    try {
      await adminEndpoints.blogPosts.delete(toDelete.id);
      setDeleteOpen(false);
      setToDelete(null);
      load();
    } catch (e) { console.error(e); }
  };

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <AdminPageHeader kicker="Content" title="Blog posts" subtitle="Shown on Writing list and article page (/writing/[slug])." />
        <Button onClick={openCreate} className="self-start sm:self-center h-11 font-display font-semibold text-[13px] bg-[var(--sungold)] text-[var(--void)] rounded-none hover:shadow-[var(--shadow-sharp-gold)] hover:-translate-y-0.5">Add post</Button>
      </div>
      {loading ? <p className="text-[var(--muted)] font-mono text-sm">Loading…</p> : (
        <div className="border border-[var(--border)] overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-[var(--surface)] border-b border-[var(--border)]">
              <tr>
                <th className="px-4 py-3 font-mono text-[11px] text-[var(--subtle)] uppercase">Title</th>
                <th className="px-4 py-3 font-mono text-[11px] text-[var(--subtle)] uppercase">Date</th>
                <th className="px-4 py-3 font-mono text-[11px] text-[var(--subtle)] uppercase w-28">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {list.map((p) => (
                <tr key={p.id} className="bg-[var(--elevated)]/50 hover:bg-[var(--elevated)]">
                  <td className="px-4 py-3 font-body text-sm text-[var(--white)]">{p.title}</td>
                  <td className="px-4 py-3 font-mono text-[12px] text-[var(--muted)]">{p.date}</td>
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto border-[var(--border)] bg-[var(--surface)] text-[var(--white)]">
          <DialogHeader><DialogTitle>{editing ? 'Edit post' : 'New post'}</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Slug</Label><Input value={form.slug} onChange={(e) => update('slug', e.target.value)} placeholder="e.g. my-post → /writing/my-post" className="bg-[var(--elevated)] border-[var(--border-md)]" /></div>
              <div className="space-y-2"><Label>Date</Label><Input value={form.date} onChange={(e) => update('date', e.target.value)} placeholder="YYYY-MM-DD" className="bg-[var(--elevated)] border-[var(--border-md)]" /></div>
            </div>
            <div className="space-y-2"><Label>Title</Label><Input value={form.title} onChange={(e) => update('title', e.target.value)} className="bg-[var(--elevated)] border-[var(--border-md)]" /></div>
            <div className="space-y-2"><Label>Category</Label><Input value={form.category} onChange={(e) => update('category', e.target.value)} placeholder="e.g. Engineering" className="bg-[var(--elevated)] border-[var(--border-md)]" /></div>
            <div className="space-y-2"><Label>Tags (comma-separated)</Label><Input value={form.tags} onChange={(e) => update('tags', e.target.value)} placeholder="React, Next.js" className="bg-[var(--elevated)] border-[var(--border-md)]" /></div>
            <div className="space-y-2"><Label>Excerpt</Label><Textarea value={form.excerpt} onChange={(e) => update('excerpt', e.target.value)} rows={2} placeholder="Short summary for listing and meta" className="bg-[var(--elevated)] border-[var(--border-md)]" /></div>
            <div className="space-y-2"><Label>Body</Label><Textarea value={form.body} onChange={(e) => update('body', e.target.value)} rows={8} placeholder="Paragraphs separated by blank lines. Numbered lists as 1. Item" className="bg-[var(--elevated)] border-[var(--border-md)]" /></div>
            <div className="space-y-2"><Label>Read time</Label><Input value={form.read_time} onChange={(e) => update('read_time', e.target.value)} placeholder="5 min" className="bg-[var(--elevated)] border-[var(--border-md)]" /></div>
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
