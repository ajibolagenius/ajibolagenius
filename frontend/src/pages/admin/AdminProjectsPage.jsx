import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
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
import ListPagination from '../../components/portfolio/ListPagination';
import { paginate } from '../../lib/paginate';
import { adminEndpoints, uploadProjectScreenshot } from '../../services/adminApi';
import OptimizedImage from '../../components/portfolio/OptimizedImage';
import { ChevronDown, ChevronUp, ImagePlus, Trash2 } from 'lucide-react';

const ADMIN_PAGE_SIZE = 10;
const MAX_PROJECT_SCREENSHOTS = 6;

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
  tech_details: '',
  screenshots: [],
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
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyProject());
  const [saving, setSaving] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const fileInputRef = React.useRef(null);
  // screenshotItems: { id, kind: 'url'|'file', url?, file?, previewUrl? }
  const [screenshotItems, setScreenshotItems] = useState([]);
  const [search, setSearch] = useState('');

  const load = () => {
    setLoading(true);
    adminEndpoints.projects.list().then(setList).catch(() => setList([])).finally(() => setLoading(false));
  };

  useEffect(load, []);

  function safeId() {
    // Browser: crypto.randomUUID exists in modern runtimes.
    if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function revokeScreenshotPreviews(items) {
    (items || []).forEach((it) => {
      if (it?.kind === 'file' && it?.previewUrl) {
        try {
          URL.revokeObjectURL(it.previewUrl);
        } catch (_) {
          // ignore
        }
      }
    });
  }

  const filteredList = useMemo(() => {
    if (!search.trim()) return list;
    const q = search.trim().toLowerCase();
    return list.filter(
      (p) =>
        (p.name || '').toLowerCase().includes(q) ||
        (p.slug || '').toLowerCase().includes(q) ||
        (p.category || '').toLowerCase().includes(q) ||
        (p.label || '').toLowerCase().includes(q) ||
        (p.description || '').toLowerCase().includes(q)
    );
  }, [list, search]);

  const { items: paginatedList, totalPages, start, end, total } = useMemo(
    () => paginate(filteredList, page, ADMIN_PAGE_SIZE),
    [filteredList, page]
  );

  const openCreate = () => {
    setEditing(null);
    setForm(emptyProject());
    setUploadError(null);
    revokeScreenshotPreviews(screenshotItems);
    setScreenshotItems([]);
    setDialogOpen(true);
  };

  const openEdit = (p) => {
    setEditing(p);
    setUploadError(null);
    revokeScreenshotPreviews(screenshotItems);
    setScreenshotItems([]);
    const screenshots = Array.isArray(p.screenshots)
      ? p.screenshots.map((s) => (typeof s === 'string' ? s : s?.url)).filter(Boolean)
      : [];
    setForm({
      ...p,
      tags: Array.isArray(p.tags) ? p.tags.join(', ') : '',
      tech_details: formatTechDetails(p.tech_details),
      screenshots,
    });
    setScreenshotItems(
      (screenshots || []).map((url) => ({
        id: safeId(),
        kind: 'url',
        url,
      }))
    );
    setDialogOpen(true);
  };

  const openDelete = (p) => {
    setToDelete(p);
    setDeleteOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    setUploading(true);
    setUploadError(null);
    try {
      if (editing) {
        if ((screenshotItems || []).length > MAX_PROJECT_SCREENSHOTS) {
          throw new Error(`Select up to ${MAX_PROJECT_SCREENSHOTS} images.`);
        }

        const uploaded = new Map();
        // Upload in the UI order, so we can map results back to the right index.
        for (const item of screenshotItems || []) {
          if (item?.kind !== 'file') continue;
          const url = await uploadProjectScreenshot(editing.id, item.file);
          uploaded.set(item.id, url);
        }

        const finalScreenshots = (screenshotItems || [])
          .map((item) => {
            if (item?.kind === 'url') return item.url;
            return uploaded.get(item.id);
          })
          .filter(Boolean);

        const payload = {
          ...form,
          tags: typeof form.tags === 'string' ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : form.tags,
          tech_details: parseTechDetails(form.tech_details),
          screenshots: finalScreenshots,
        };

        await adminEndpoints.projects.update(editing.id, payload);
      } else {
        if ((screenshotItems || []).length > MAX_PROJECT_SCREENSHOTS) {
          throw new Error(`Select up to ${MAX_PROJECT_SCREENSHOTS} images.`);
        }

        const createPayload = {
          ...form,
          tags: typeof form.tags === 'string' ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : form.tags,
          tech_details: parseTechDetails(form.tech_details),
          screenshots: [],
        };

        const created = await adminEndpoints.projects.create(createPayload);
        const createdId = created?.id;
        if (!createdId) throw new Error('Project created, but no id was returned.');

        const uploaded = new Map();
        for (const item of screenshotItems || []) {
          if (item?.kind !== 'file') continue;
          const url = await uploadProjectScreenshot(createdId, item.file);
          uploaded.set(item.id, url);
        }

        const finalScreenshots = (screenshotItems || [])
          .map((item) => {
            if (item?.kind === 'url') return item.url;
            return uploaded.get(item.id);
          })
          .filter(Boolean);

        await adminEndpoints.projects.update(createdId, { screenshots: finalScreenshots });
      }
      setDialogOpen(false);
      load();
    } catch (e) {
      console.error(e);
      setUploadError(e?.message || 'Save failed.');
    } finally {
      setSaving(false);
      setUploading(false);
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

  const handleScreenshotFilesSelected = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    const firstInvalid = files.find((f) => !allowed.includes(f.type));
    if (firstInvalid) {
      setUploadError('Use JPEG, PNG, WebP or GIF.');
      return;
    }
    setUploadError(null);

    const remainingSlots = MAX_PROJECT_SCREENSHOTS - (screenshotItems || []).length;
    if (remainingSlots <= 0) {
      setUploadError(`You can add up to ${MAX_PROJECT_SCREENSHOTS} images.`);
      return;
    }

    const toAdd = files.slice(0, remainingSlots);
    if (files.length > toAdd.length) {
      setUploadError(`Only ${toAdd.length} image(s) added (max ${MAX_PROJECT_SCREENSHOTS}).`);
    }

    const newItems = toAdd.map((file) => ({
      id: safeId(),
      kind: 'file',
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    setScreenshotItems((prev) => [...(prev || []), ...newItems]);
    e.target.value = '';
  };

  const removeScreenshot = (index) => {
    setScreenshotItems((prev) => {
      const item = prev?.[index];
      if (item?.kind === 'file' && item?.previewUrl) {
        try {
          URL.revokeObjectURL(item.previewUrl);
        } catch (_) {
          // ignore
        }
      }
      return (prev || []).filter((_, i) => i !== index);
    });
  };

  const moveScreenshot = (index, delta) => {
    setScreenshotItems((prev) => {
      const next = [...(prev || [])];
      const target = index + delta;
      if (target < 0 || target >= next.length) return next;
      const [item] = next.splice(index, 1);
      next.splice(target, 0, item);
      return next;
    });
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <AdminPageHeader kicker="Content" title="Projects" subtitle="Shown on Home, Work list, and project detail (/work/[slug])." />
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            onClick={openCreate}
            className="self-start sm:self-center h-11 font-display font-semibold text-[13px] tracking-[0.04em] bg-[var(--sungold)] text-[var(--void)] rounded-none hover:shadow-[var(--shadow-sharp-gold)] hover:-translate-y-0.5 transition-all duration-200"
          >
            Add project
          </Button>
        </motion.div>
      </div>
      {!loading && (
        <Input
          type="search"
          placeholder="Search by name, slug, category, label…"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="max-w-sm mb-4 bg-[var(--elevated)] border-[var(--border-md)] font-mono text-[13px]"
          aria-label="Search projects"
        />
      )}
      {loading ? (
        <p className="text-[var(--muted)] font-mono text-sm">Loading…</p>
      ) : (
        <div className="border border-[var(--border)] bg-[var(--surface)] overflow-x-auto relative">
          <div className="absolute -top-px -left-px w-3 h-3 border-t border-l border-[var(--sungold)] opacity-40" />
          <table className="w-full text-left min-w-[600px]">
            <thead className="bg-[var(--elevated)] border-b border-[var(--border)]">
              <tr>
                <th className="px-4 py-3 font-mono text-[11px] text-[var(--subtle)] uppercase">Label</th>
                <th className="px-4 py-3 font-mono text-[11px] text-[var(--subtle)] uppercase">Name</th>
                <th className="px-4 py-3 font-mono text-[11px] text-[var(--subtle)] uppercase">Category</th>
                <th className="px-4 py-3 font-mono text-[11px] text-[var(--subtle)] uppercase w-28">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {paginatedList.map((p) => (
                <tr key={p.id} className="bg-[var(--elevated)]/50 hover:bg-[var(--elevated)] hover:border-l-2 hover:border-l-[var(--sungold)] transition-all duration-150">
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

      {filteredList.length > 0 && (
        <ListPagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          range={{ start, end, total }}
        />
      )}

      <Dialog
        open={dialogOpen}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) {
            revokeScreenshotPreviews(screenshotItems);
            setScreenshotItems([]);
          }
          setDialogOpen(nextOpen);
        }}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto border-[var(--border)] bg-[var(--surface)] text-[var(--white)]">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit project' : 'New project'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4" role="form" aria-label={editing ? 'Edit project' : 'New project'}>
            <fieldset className="grid gap-4 border-0 p-0 m-0">
              <legend className="flex items-center gap-2 mb-2 font-mono text-[10px] tracking-[0.12em] uppercase text-[var(--sungold)]">
                <span className="w-5 h-px bg-[var(--sungold)]" aria-hidden /> Card & listing
              </legend>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="proj-slug">Slug</Label>
                  <Input id="proj-slug" value={form.slug} onChange={(e) => update('slug', e.target.value)} placeholder="e.g. my-project → /work/my-project" className="bg-[var(--elevated)] border-[var(--border-md)]" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="proj-label">Label</Label>
                  <Input id="proj-label" value={form.label} onChange={(e) => update('label', e.target.value)} placeholder="e.g. RANT" className="bg-[var(--elevated)] border-[var(--border-md)]" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="proj-name">Name</Label>
                <Input id="proj-name" value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="e.g. Rant — Anonymous Expression" className="bg-[var(--elevated)] border-[var(--border-md)]" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="proj-category">Category</Label>
                <Input id="proj-category" value={form.category} onChange={(e) => update('category', e.target.value)} placeholder="e.g. Platform · Social" className="bg-[var(--elevated)] border-[var(--border-md)]" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="proj-description">Description</Label>
                <Textarea id="proj-description" value={form.description} onChange={(e) => update('description', e.target.value)} rows={2} placeholder="Short summary for cards and detail page" className="bg-[var(--elevated)] border-[var(--border-md)]" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="proj-tags">Tags</Label>
                  <Input id="proj-tags" value={form.tags} onChange={(e) => update('tags', e.target.value)} placeholder="React, Node" aria-describedby="proj-tags-hint" className="bg-[var(--elevated)] border-[var(--border-md)]" />
                  <span id="proj-tags-hint" className="font-mono text-[11px] text-[var(--subtle)]">Separate multiple with commas.</span>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="proj-type">Type</Label>
                  <Input id="proj-type" value={form.type} onChange={(e) => update('type', e.target.value)} placeholder="dev or design (Work filter)" className="bg-[var(--elevated)] border-[var(--border-md)]" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="featured" checked={form.featured} onChange={(e) => update('featured', e.target.checked)} className="rounded border-[var(--border-md)]" />
                <Label htmlFor="featured">Featured</Label>
              </div>
            </fieldset>

            <fieldset className="grid gap-4 border-0 p-0 m-0">
              <legend className="flex items-center gap-2 mb-2 font-mono text-[10px] tracking-[0.12em] uppercase text-[var(--sungold)]">
                <span className="w-5 h-px bg-[var(--sungold)]" aria-hidden /> Links
              </legend>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="proj-live-url">Live URL</Label>
                  <Input id="proj-live-url" type="text" inputMode="url" value={form.live_url} onChange={(e) => update('live_url', e.target.value)} placeholder="https://... or #" className="bg-[var(--elevated)] border-[var(--border-md)]" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="proj-github-url">GitHub URL</Label>
                  <Input id="proj-github-url" type="text" inputMode="url" value={form.github_url} onChange={(e) => update('github_url', e.target.value)} placeholder="https://github.com/... or #" className="bg-[var(--elevated)] border-[var(--border-md)]" />
                </div>
              </div>
            </fieldset>

            <fieldset className="grid gap-4 border-0 p-0 m-0">
              <legend className="flex items-center gap-2 mb-2 font-mono text-[10px] tracking-[0.12em] uppercase text-[var(--sungold)]">
                <span className="w-5 h-px bg-[var(--sungold)]" aria-hidden /> Detail page
              </legend>
              <div className="space-y-2">
                <Label htmlFor="proj-role-title">Role title</Label>
                <Input id="proj-role-title" value={form.role_title} onChange={(e) => update('role_title', e.target.value)} placeholder="e.g. Lead Developer & Designer" className="bg-[var(--elevated)] border-[var(--border-md)]" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="proj-duration">Duration</Label>
                  <Input id="proj-duration" value={form.duration} onChange={(e) => update('duration', e.target.value)} placeholder="e.g. 3 months" className="bg-[var(--elevated)] border-[var(--border-md)]" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="proj-year">Year</Label>
                  <Input id="proj-year" type="number" min="1990" max="2100" value={form.year} onChange={(e) => update('year', e.target.value)} placeholder="e.g. 2024" className="bg-[var(--elevated)] border-[var(--border-md)]" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="proj-problem">Problem</Label>
                <Textarea id="proj-problem" value={form.problem} onChange={(e) => update('problem', e.target.value)} rows={2} placeholder="The challenge or context..." className="bg-[var(--elevated)] border-[var(--border-md)]" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="proj-solution">Solution</Label>
                <Textarea id="proj-solution" value={form.solution} onChange={(e) => update('solution', e.target.value)} rows={2} placeholder="What you built and how it helped..." className="bg-[var(--elevated)] border-[var(--border-md)]" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="proj-tech-details">Tech details (one per line: name|role)</Label>
                <Textarea id="proj-tech-details" value={form.tech_details} onChange={(e) => update('tech_details', e.target.value)} rows={4} placeholder={"Next.js|Framework\nTailwind|Styling"} className="bg-[var(--elevated)] border-[var(--border-md)] font-mono text-sm" />
              </div>
            </fieldset>

            <fieldset className="grid gap-4 border-0 p-0 m-0">
              <legend className="flex items-center gap-2 mb-2 font-mono text-[10px] tracking-[0.12em] uppercase text-[var(--sungold)]">
                <span className="w-5 h-px bg-[var(--sungold)]" aria-hidden /> Screenshots
              </legend>
              <p className="font-mono text-[11px] text-[var(--subtle)]">
                Up to {MAX_PROJECT_SCREENSHOTS} images. First image = hero on work/[slug]. Selected images are uploaded when you click <span className="text-[var(--sungold)]">Save</span>.
              </p>
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleScreenshotFilesSelected}
                  className="hidden"
                  aria-label="Select screenshots"
                />
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="border-[var(--border-md)] text-[var(--white)]"
                  >
                    <ImagePlus className="w-4 h-4 mr-1" aria-hidden />
                    {uploading ? 'Uploading…' : 'Add images'}
                  </Button>
                  {uploadError && <span className="font-mono text-[11px] text-[var(--terracotta)]">{uploadError}</span>}
                </div>

                {(screenshotItems || []).length > 0 && (
                  <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2 list-none p-0 m-0">
                    {(screenshotItems || []).map((item, i) => {
                      const src = item?.kind === 'url' ? item.url : item?.previewUrl;
                      return (
                        <li
                          key={item.id}
                          className="relative group border border-[var(--border)] bg-[var(--elevated)] overflow-hidden aspect-video"
                        >
                          <OptimizedImage src={src} alt="" className="w-full h-full object-cover" />

                          <div className="absolute top-1 left-1 flex gap-1">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => moveScreenshot(i, -1)}
                              disabled={uploading || i === 0}
                              className="bg-[var(--void)]/70 hover:bg-[var(--void)]/70 text-[var(--sungold)] hover:text-white"
                              aria-label={`Move screenshot ${i + 1} up`}
                            >
                              <ChevronUp className="w-4 h-4" aria-hidden />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => moveScreenshot(i, 1)}
                              disabled={uploading || i === (screenshotItems || []).length - 1}
                              className="bg-[var(--void)]/70 hover:bg-[var(--void)]/70 text-[var(--sungold)] hover:text-white"
                              aria-label={`Move screenshot ${i + 1} down`}
                            >
                              <ChevronDown className="w-4 h-4" aria-hidden />
                            </Button>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeScreenshot(i)}
                            className="absolute top-1 right-1 p-1 rounded-none bg-[var(--void)]/90 text-[var(--terracotta)] hover:bg-[var(--terracotta)] hover:text-white transition-colors"
                            aria-label={`Remove screenshot ${i + 1}`}
                            disabled={uploading}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>

                          {i === 0 && (
                            <span className="absolute bottom-1 left-1 font-mono text-[9px] px-1.5 py-0.5 bg-[var(--void)]/90 text-[var(--sungold)]">
                              Hero
                            </span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </>
            </fieldset>
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
