import React, { useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../../components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../components/ui/alert-dialog';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import { adminEndpoints } from '../../services/adminApi';

const emptyProject = () => ({
  slug: '',
  name: '',
  category: '',
  label: '',
  description: '',
  tags: [],
  type: 'dev',
  featured: false,
  live_url: '#',
  github_url: '#',
  problem: '',
  solution: '',
  role_title: '',
  duration: '',
  year: '',
  tech_details: [],
});

function parseTechDetails(s) {
  if (!s || typeof s !== 'string') return [];
  return s
    .split('\n')
    .map((line) => line.trim().split('|').map((x) => x.trim()))
    .filter(([a]) => a)
    .map(([name, role]) => ({ name: name || '', role: role || '' }));
}

function formatTechDetails(arr) {
  return (arr || []).map((t) => `${t.name}|${t.role || ''}`).join('\n');
}

export default function AdminProjectsPage() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyProject());
  const [saving, setSaving] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  const load = () => {
    setLoading(true);
    adminEndpoints.projects.list().then(setList).catch(() => setList([])).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyProject());
    setDialogOpen(true);
  };

  const openEdit = (p) => {
    setEditing(p);
    setForm({
      ...p,
      tags: Array.isArray(p.tags) ? p.tags.join(', ') : '',
      tech_details: formatTechDetails(p.tech_details),
    });
    setDialogOpen(true);
  };

  const openDelete = (p) => {
    setToDelete(p);
    setDeleteOpen(true);
  };

  const handleSave = async () => {
    const payload = {
      ...form,
      tags: typeof form.tags === 'string' ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : form.tags,
      tech_details: parseTechDetails(form.tech_details),
    };
    setSaving(true);
    try {
      if (editing) {
        await adminEndpoints.projects.update(editing.id, payload);
      } else {
        await adminEndpoints.projects.create(payload);
      }
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
      await adminEndpoints.projects.delete(toDelete.id);
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
        <AdminPageHeader kicker="Content" title="Projects" subtitle="Shown on Home, Work list, and project detail (/work/[slug])." />
        <Button
          onClick={openCreate}
          className="self-start sm:self-center h-11 font-display font-semibold text-[13px] tracking-[0.04em] bg-[var(--sungold)] text-[var(--void)] rounded-none hover:shadow-[var(--shadow-sharp-gold)] hover:-translate-y-0.5 transition-all duration-200"
        >
          Add project
        </Button>
      </div>
      {loading ? (
        <p className="text-[var(--muted)] font-mono text-sm">Loading…</p>
      ) : (
        <div className="border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-[var(--elevated)] border-b border-[var(--border)]">
              <tr>
                <th className="px-4 py-3 font-mono text-[11px] text-[var(--subtle)] uppercase">Label</th>
                <th className="px-4 py-3 font-mono text-[11px] text-[var(--subtle)] uppercase">Name</th>
                <th className="px-4 py-3 font-mono text-[11px] text-[var(--subtle)] uppercase">Category</th>
                <th className="px-4 py-3 font-mono text-[11px] text-[var(--subtle)] uppercase w-28">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {list.map((p) => (
                <tr key={p.id} className="bg-[var(--elevated)]/50 hover:bg-[var(--elevated)]">
                  <td className="px-4 py-3 font-mono text-[12px] text-[var(--white)]">{p.label}</td>
                  <td className="px-4 py-3 font-body text-sm text-[var(--white)]">{p.name}</td>
                  <td className="px-4 py-3 font-body text-sm text-[var(--muted)]">{p.category}</td>
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
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit project' : 'New project'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-5 h-px bg-[var(--sungold)]" aria-hidden />
              <span className="font-mono text-[10px] tracking-[0.12em] uppercase text-[var(--sungold)]">Card & listing</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Slug</Label>
                <Input value={form.slug} onChange={(e) => update('slug', e.target.value)} placeholder="e.g. my-project → /work/my-project" className="bg-[var(--elevated)] border-[var(--border-md)]" />
              </div>
              <div className="space-y-2">
                <Label>Label</Label>
                <Input value={form.label} onChange={(e) => update('label', e.target.value)} placeholder="e.g. RANT" className="bg-[var(--elevated)] border-[var(--border-md)]" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="e.g. Rant — Anonymous Expression" className="bg-[var(--elevated)] border-[var(--border-md)]" />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Input value={form.category} onChange={(e) => update('category', e)} placeholder="e.g. Platform · Social" className="bg-[var(--elevated)] border-[var(--border-md)]" />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={form.description} onChange={(e) => update('description', e.target.value)} rows={2} placeholder="Short summary for cards and detail page" className="bg-[var(--elevated)] border-[var(--border-md)]" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tags (comma-separated)</Label>
                <Input value={form.tags} onChange={(e) => update('tags', e.target.value)} placeholder="React, Node" className="bg-[var(--elevated)] border-[var(--border-md)]" />
              </div>
              <div className="space-y-2">
                <Label>Type</Label>
                <Input value={form.type} onChange={(e) => update('type', e.target.value)} placeholder="dev or design (Work filter)" className="bg-[var(--elevated)] border-[var(--border-md)]" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="featured" checked={form.featured} onChange={(e) => update('featured', e.target.checked)} className="rounded border-[var(--border-md)]" />
              <Label htmlFor="featured">Featured</Label>
            </div>
            <div className="flex items-center gap-2 mt-4 mb-1">
              <div className="w-5 h-px bg-[var(--sungold)]" aria-hidden />
              <span className="font-mono text-[10px] tracking-[0.12em] uppercase text-[var(--sungold)]">Links</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Live URL</Label>
                <Input value={form.live_url} onChange={(e) => update('live_url', e.target.value)} placeholder="https://..." className="bg-[var(--elevated)] border-[var(--border-md)]" />
              </div>
              <div className="space-y-2">
                <Label>GitHub URL</Label>
                <Input value={form.github_url} onChange={(e) => update('github_url', e.target.value)} placeholder="https://github.com/..." className="bg-[var(--elevated)] border-[var(--border-md)]" />
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4 mb-1">
              <div className="w-5 h-px bg-[var(--sungold)]" aria-hidden />
              <span className="font-mono text-[10px] tracking-[0.12em] uppercase text-[var(--sungold)]">Detail page</span>
            </div>
            <div className="space-y-2">
              <Label>Role title</Label>
              <Input value={form.role_title} onChange={(e) => update('role_title', e.target.value)} placeholder="e.g. Lead Developer & Designer" className="bg-[var(--elevated)] border-[var(--border-md)]" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Duration</Label>
                <Input value={form.duration} onChange={(e) => update('duration', e.target.value)} placeholder="e.g. 3 months" className="bg-[var(--elevated)] border-[var(--border-md)]" />
              </div>
              <div className="space-y-2">
                <Label>Year</Label>
                <Input value={form.year} onChange={(e) => update('year', e.target.value)} placeholder="e.g. 2024" className="bg-[var(--elevated)] border-[var(--border-md)]" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Problem</Label>
              <Textarea value={form.problem} onChange={(e) => update('problem', e.target.value)} rows={2} placeholder="The challenge or context..." className="bg-[var(--elevated)] border-[var(--border-md)]" />
            </div>
            <div className="space-y-2">
              <Label>Solution</Label>
              <Textarea value={form.solution} onChange={(e) => update('solution', e.target.value)} rows={2} placeholder="What you built and how it helped..." className="bg-[var(--elevated)] border-[var(--border-md)]" />
            </div>
            <div className="space-y-2">
              <Label>Tech details (one per line: name|role)</Label>
              <Textarea value={form.tech_details} onChange={(e) => update('tech_details', e.target.value)} rows={4} placeholder={"Next.js|Framework\nTailwind|Styling"} className="bg-[var(--elevated)] border-[var(--border-md)] font-mono text-sm" />
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
            <AlertDialogTitle className="text-[var(--white)]">Delete project?</AlertDialogTitle>
            <AlertDialogDescription className="text-[var(--muted)]">
              {toDelete?.name} will be removed. This cannot be undone.
            </AlertDialogDescription>
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
