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
import RichTextEditor from '../../components/admin/RichTextEditor';
import { adminEndpoints } from '../../services/adminApi';

const ADMIN_PAGE_SIZE = 10;

const emptyPost = () => ({ slug: '', title: '', date: '', tags: [], category: '', excerpt: '', body: '', read_time: '' });

/** Words per minute for read time; ~200 is average. */
const WPM = 200;
/** Strip HTML tags and count words; return "N min" for body content. */
function computeReadTime(body) {
  if (!body || typeof body !== 'string') return '1 min';
  const text = body.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const words = text ? text.split(' ').filter(Boolean).length : 0;
  const mins = Math.max(1, Math.ceil(words / WPM));
  return `${mins} min`;
}

export default function AdminBlogPage() {
  const [list, setList] = useState([]);
  const [page, setPage] = useState(1);
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

  const { items: paginatedList, totalPages, start, end, total } = useMemo(
    () => paginate(list, page, ADMIN_PAGE_SIZE),
    [list, page]
  );

  const openCreate = () => { setEditing(null); setForm(emptyPost()); setDialogOpen(true); };
  const openEdit = (p) => {
    setEditing(p);
    setForm({ ...p, tags: Array.isArray(p.tags) ? p.tags.join(', ') : '' });
    setDialogOpen(true);
  };
  const openDelete = (p) => { setToDelete(p); setDeleteOpen(true); };

  const handleSave = async () => {
    const readTime = computeReadTime(form.body);
    const payload = {
      ...form,
      tags: typeof form.tags === 'string' ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : form.tags,
      read_time: readTime,
    };
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

  const update = (key, value) => {
    setForm((f) => {
      const next = { ...f, [key]: value };
      if (key === 'body') next.read_time = computeReadTime(value);
      return next;
    });
  };

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
              {paginatedList.map((p) => (
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

      {list.length > 0 && (
        <ListPagination page={page} totalPages={totalPages} onPageChange={setPage} range={{ start, end, total }} />
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto border-[var(--border)] bg-[var(--surface)] text-[var(--white)]">
          <DialogHeader><DialogTitle>{editing ? 'Edit post' : 'New post'}</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4" role="form" aria-label={editing ? 'Edit post' : 'New post'}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="blog-slug">Slug</Label>
                <Input id="blog-slug" value={form.slug} onChange={(e) => update('slug', e.target.value)} placeholder="e.g. my-post → /writing/my-post" className="bg-[var(--elevated)] border-[var(--border-md)]" />
              </div>
<div className="space-y-2">
              <Label htmlFor="blog-date">Date</Label>
                <Input id="blog-date" type="date" value={form.date} onChange={(e) => update('date', e.target.value)} className="bg-[var(--elevated)] border-[var(--border-md)]" />
              </div>
            </div>
            <p className="font-mono text-[11px] text-[var(--subtle)]">The newest post (by date) is shown as featured on /writing. No separate featured field.</p>
            <div className="space-y-2">
              <Label htmlFor="blog-title">Title</Label>
              <Input id="blog-title" value={form.title} onChange={(e) => update('title', e.target.value)} placeholder="e.g. How I Built X" className="bg-[var(--elevated)] border-[var(--border-md)]" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="blog-category">Category</Label>
              <Input id="blog-category" value={form.category} onChange={(e) => update('category', e.target.value)} placeholder="e.g. Engineering" className="bg-[var(--elevated)] border-[var(--border-md)]" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="blog-tags">Tags</Label>
              <Input id="blog-tags" value={form.tags} onChange={(e) => update('tags', e.target.value)} placeholder="React, Next.js" aria-describedby="blog-tags-hint" className="bg-[var(--elevated)] border-[var(--border-md)]" />
              <span id="blog-tags-hint" className="font-mono text-[11px] text-[var(--subtle)]">Separate multiple with commas.</span>
            </div>
            <div className="space-y-2">
              <Label htmlFor="blog-excerpt">Excerpt</Label>
              <Textarea id="blog-excerpt" value={form.excerpt} onChange={(e) => update('excerpt', e.target.value)} rows={2} placeholder="Short summary for listing and meta" className="bg-[var(--elevated)] border-[var(--border-md)]" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="blog-body">Body</Label>
              <RichTextEditor
                id="blog-body"
                value={form.body}
                onChange={(v) => update('body', v)}
                placeholder="Write your article…"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="blog-read-time">Read time</Label>
              <Input id="blog-read-time" value={form.read_time || computeReadTime(form.body)} readOnly className="bg-[var(--elevated)] border-[var(--border-md)] cursor-default opacity-90" aria-describedby="blog-read-time-hint" />
              <span id="blog-read-time-hint" className="font-mono text-[11px] text-[var(--subtle)]">Auto-calculated from body (~200 words/min).</span>
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
