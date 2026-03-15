import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../components/ui/dialog';
import { Checkbox } from '../../components/ui/checkbox';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../../components/ui/alert-dialog';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import ListPagination from '../../components/portfolio/ListPagination';
import { paginate } from '../../lib/paginate';
import RichTextEditor from '../../components/admin/RichTextEditor';
import { adminEndpoints } from '../../services/adminApi';

const ADMIN_PAGE_SIZE = 10;

const BLOG_CATEGORIES = [
  'Design',
  'Education',
  'Engineering',
  'Technical',
  'Opinion',
  'Tutorial',
  'Case Study',
  'News',
];

/** Radix Select reserves empty string for "clear"; use sentinel for "None" and map to ''. */
const CATEGORY_NONE = '__none__';

const emptyPost = () => ({ slug: '', title: '', date: '', tags: [], category: '', excerpt: '', body: '', read_time: '', published: true, published_at: '', meta_description: '', og_image: '' });

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

  const openCreate = () => { setEditing(null); setForm(emptyPost()); setDialogOpen(true); };
  const openEdit = (p) => {
    setEditing(p);
    setForm({
      ...p,
      tags: Array.isArray(p.tags) ? p.tags.join(', ') : '',
      published: p.published !== false,
      published_at: p.published_at || '',
      meta_description: p.meta_description ?? '',
      og_image: p.og_image ?? '',
    });
    setDialogOpen(true);
  };
  const openDelete = (p) => { setToDelete(p); setDeleteOpen(true); };

  const handleSave = async () => {
    const readTime = computeReadTime(form.body);
    const tagsArr = typeof form.tags === 'string' ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : form.tags;
    const published = form.published !== false;
    const payload = {
      ...form,
      tags: tagsArr,
      read_time: readTime,
      published,
      published_at: published && !editing?.published_at && !form.published_at ? new Date().toISOString() : (form.published_at || editing?.published_at || null),
      meta_description: form.meta_description ?? '',
      og_image: form.og_image ?? '',
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
        <AdminPageHeader kicker="Content" title="Blog posts" subtitle="Shown on Writing list and article page (/writing/[slug]). Unpublished posts are hidden from the site." />
        <Button onClick={openCreate} className="self-start sm:self-center h-11 font-display font-semibold text-[13px] bg-[var(--sungold)] text-[var(--void)] rounded-none hover:shadow-[var(--shadow-sharp-gold)] hover:-translate-y-0.5">Add post</Button>
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
                    <Button variant="ghost" size="sm" onClick={() => openEdit(p)}>Edit</Button>
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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto border-[var(--border)] bg-[var(--surface)] text-[var(--white)]">
          <DialogDescription className="sr-only">Form to create or edit a blog post: title, slug, excerpt, body, date, and read time.</DialogDescription>
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit post' : 'New post'}</DialogTitle>
          </DialogHeader>
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
              <Select value={form.category || CATEGORY_NONE} onValueChange={(v) => update('category', v === CATEGORY_NONE ? '' : v)}>
                <SelectTrigger id="blog-category" className="bg-[var(--elevated)] border-[var(--border-md)] text-[var(--white)]">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="border-[var(--border)] bg-[var(--surface)]">
                  <SelectItem value={CATEGORY_NONE} className="text-[var(--muted)] focus:bg-[var(--elevated)] focus:text-[var(--white)]">— None —</SelectItem>
                  {[...BLOG_CATEGORIES, ...(form.category && !BLOG_CATEGORIES.includes(form.category) ? [form.category] : [])].map((c) => (
                    <SelectItem key={c} value={c} className="text-[var(--white)] focus:bg-[var(--elevated)] focus:text-[var(--white)]">
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
            <div className="flex items-center gap-2 pt-2 border-t border-[var(--border)]">
              <Checkbox id="blog-published" checked={form.published !== false} onCheckedChange={(v) => update('published', v !== false)} className="border-[var(--border-md)] data-[state=checked]:bg-[var(--sungold)]" />
              <Label htmlFor="blog-published" className="font-mono text-[12px] text-[var(--muted)]">Published (visible on /writing)</Label>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="blog-meta-description">Meta description (SEO)</Label>
                <Textarea id="blog-meta-description" value={form.meta_description || ''} onChange={(e) => update('meta_description', e.target.value)} rows={2} placeholder="Override for search/social; else excerpt used" className="bg-[var(--elevated)] border-[var(--border-md)]" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="blog-og-image">OG image URL</Label>
                <Input id="blog-og-image" value={form.og_image || ''} onChange={(e) => update('og_image', e.target.value)} placeholder="/og-image.png or full URL" className="bg-[var(--elevated)] border-[var(--border-md)]" />
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
