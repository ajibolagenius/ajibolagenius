import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../../components/ui/alert-dialog';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import ListPagination from '../../components/portfolio/ListPagination';
import { paginate } from '../../lib/paginate';
import { adminEndpoints, uploadGalleryMedia } from '../../services/adminApi';
import { ImagePlus, Pencil, Trash2, Video, Upload, X } from 'lucide-react';

const UPLOAD_ACCEPT = 'image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime';
const VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];

const ADMIN_PAGE_SIZE = 12;

const GALLERY_TYPES = ['UI', '3D', 'Graphic', 'Illustration', 'Motion', 'Photography', 'Branding', 'Print', 'Other'];
const MEDIA_KINDS = [
  { value: 'image', label: 'Image' },
  { value: 'video', label: 'Video' },
];

const emptyItem = () => ({
  title: '',
  type: 'UI',
  color: '#E8A020',
  url: '',
  media_kind: 'image',
});

function MediaPreview({ item, className = '' }) {
  const url = item?.url?.trim();
  const kind = (item?.media_kind || 'image').toLowerCase();
  if (!url) {
    return (
      <div
        className={`flex flex-col items-center justify-center p-4 bg-[var(--surface)] ${className}`}
        style={{
          backgroundImage: item?.color
            ? `repeating-linear-gradient(45deg, ${item.color}12 0px, ${item.color}12 1px, transparent 1px, transparent 16px)`
            : undefined,
        }}
      >
        <ImagePlus className="w-10 h-10 text-[var(--muted)] mb-2" />
        <span className="font-mono text-[10px] text-[var(--subtle)]">No media</span>
      </div>
    );
  }
  if (kind === 'video') {
    return (
      <video
        src={url}
        className={`object-cover w-full h-full ${className}`}
        muted
        playsInline
        preload="metadata"
        onError={(e) => { e.target.style.display = 'none'; }}
      />
    );
  }
  return (
    <img
      src={url}
      alt=""
      className={`object-cover w-full h-full ${className}`}
      onError={(e) => { e.target.style.display = 'none'; }}
    />
  );
}

export default function AdminGalleryPage() {
  const [list, setList] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyItem());
  const [saving, setSaving] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const fileInputRef = useRef(null);

  const load = () => {
    setLoading(true);
    adminEndpoints.gallery.list().then(setList).catch(() => setList([])).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const { items: paginatedList, totalPages, start, end, total } = useMemo(
    () => paginate(list, page, ADMIN_PAGE_SIZE),
    [list, page]
  );

  const openCreate = () => {
    setEditing(null);
    setForm(emptyItem());
    setUploadError(null);
    setDialogOpen(true);
  };
  const openEdit = (p) => {
    setEditing(p);
    setForm({
      title: p.title ?? '',
      type: p.type ?? 'UI',
      color: /^#[0-9A-Fa-f]{6}$/.test(p.color) ? p.color : '#E8A020',
      url: p.url ?? '',
      media_kind: (p.media_kind || 'image').toLowerCase() === 'video' ? 'video' : 'image',
    });
    setUploadError(null);
    setDialogOpen(true);
  };
  const openDelete = (p) => { setToDelete(p); setDeleteOpen(true); };

  const handleUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError(null);
    const kind = VIDEO_TYPES.includes(file.type) ? 'video' : 'image';
    setUploading(true);
    uploadGalleryMedia(file)
      .then((url) => setForm((f) => ({ ...f, url, media_kind: kind })))
      .catch((err) => setUploadError(err.message || 'Upload failed.'))
      .finally(() => {
        setUploading(false);
        e.target.value = '';
      });
  };

  const clearMedia = () => setForm((f) => ({ ...f, url: '' }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        title: form.title.trim(),
        type: form.type,
        color: form.color || '#E8A020',
        url: form.url.trim() || null,
        media_kind: form.media_kind,
      };
      if (editing) await adminEndpoints.gallery.update(editing.id, payload);
      else await adminEndpoints.gallery.create(payload);
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
        <AdminPageHeader
          kicker="Content"
          title="Gallery"
          subtitle="Images and videos for the public gallery. Add a URL to show real media; leave URL empty for a placeholder card."
        />
        <Button onClick={openCreate} className="self-start sm:self-center h-11 font-display font-semibold text-[13px] bg-[var(--sungold)] text-[var(--void)] rounded-none hover:shadow-[var(--shadow-sharp-gold)] hover:-translate-y-0.5">
          Add item
        </Button>
      </div>

      {loading ? (
        <p className="text-[var(--muted)] font-mono text-sm">Loading…</p>
      ) : list.length === 0 ? (
        <div className="border border-[var(--border)] border-dashed rounded p-12 text-center">
          <p className="text-[var(--muted)] font-body mb-4">No gallery items yet.</p>
          <Button onClick={openCreate} variant="outline" className="border-[var(--border)] text-[var(--white)]">Add first item</Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {paginatedList.map((p) => (
              <div
                key={p.id}
                className="group relative border border-[var(--border)] overflow-hidden bg-[var(--surface)]"
              >
                <div className="aspect-square">
                  <MediaPreview item={p} className="w-full h-full min-h-[120px]" />
                </div>
                <div className="p-3 border-t border-[var(--border)]">
                  <p className="font-body text-sm text-[var(--white)] truncate" title={p.title}>{p.title}</p>
                  <p className="font-mono text-[11px] text-[var(--muted)] mt-0.5">{p.type}</p>
                </div>
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="secondary" size="icon" className="h-8 w-8 bg-[var(--void)]/90 text-[var(--white)]" onClick={() => openEdit(p)} aria-label="Edit">
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="secondary" size="icon" className="h-8 w-8 bg-[var(--terracotta)]/90 text-white" onClick={() => openDelete(p)} aria-label="Delete">
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
          <DialogDescription className="sr-only">Form to add or edit a gallery item: title, type, optional color, media URL and kind.</DialogDescription>
          <DialogHeader><DialogTitle>{editing ? 'Edit item' : 'New item'}</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4" role="form" aria-label={editing ? 'Edit item' : 'New item'}>
            <div className="space-y-2">
              <Label htmlFor="gallery-title">Title</Label>
              <Input id="gallery-title" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="e.g. Dashboard UI" className="bg-[var(--elevated)] border-[var(--border-md)]" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gallery-type">Type</Label>
              <Select value={form.type} onValueChange={(v) => setForm((f) => ({ ...f, type: v }))}>
                <SelectTrigger id="gallery-type" className="bg-[var(--elevated)] border-[var(--border-md)] text-[var(--white)]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-[var(--border)] bg-[var(--surface)]">
                  {GALLERY_TYPES.map((t) => (
                    <SelectItem key={t} value={t} className="text-[var(--white)] focus:bg-[var(--elevated)]">{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="gallery-color">Color (placeholder / accent)</Label>
              <div className="flex gap-2 items-center">
                <Input id="gallery-color" type="color" value={/^#[0-9A-Fa-f]{6}$/.test(form.color) ? form.color : '#E8A020'} onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))} className="h-10 w-14 p-1 cursor-pointer bg-[var(--elevated)] border-[var(--border-md)]" title="Pick color" />
                <Input type="text" value={form.color} onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))} placeholder="#E8A020" className="flex-1 bg-[var(--elevated)] border-[var(--border-md)] font-mono text-sm" aria-label="Color hex" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="gallery-media-kind">Media kind</Label>
              <Select value={form.media_kind} onValueChange={(v) => setForm((f) => ({ ...f, media_kind: v }))}>
                <SelectTrigger id="gallery-media-kind" className="bg-[var(--elevated)] border-[var(--border-md)] text-[var(--white)]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-[var(--border)] bg-[var(--surface)]">
                  {MEDIA_KINDS.map((k) => (
                    <SelectItem key={k.value} value={k.value} className="text-[var(--white)] focus:bg-[var(--elevated)] flex items-center gap-2">
                      {k.value === 'video' ? <Video className="h-4 w-4" /> : <ImagePlus className="h-4 w-4" />}
                      {k.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Media</Label>
              <div className="flex flex-wrap items-center gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={UPLOAD_ACCEPT}
                  className="hidden"
                  onChange={handleUpload}
                  aria-label="Upload image or video"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="border-[var(--border)] text-[var(--white)]"
                  disabled={uploading}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {uploading ? 'Uploading…' : 'Upload file'}
                </Button>
                {form.url ? (
                  <Button type="button" variant="ghost" size="sm" className="text-[var(--muted)]" onClick={clearMedia} aria-label="Clear media">
                    <X className="h-4 w-4 mr-1" />
                    Clear
                  </Button>
                ) : null}
              </div>
              <p className="text-[11px] text-[var(--muted)]">Image: JPEG, PNG, WebP, GIF. Video: MP4, WebM, MOV. Or paste a URL below.</p>
              {uploadError && <p className="font-mono text-[11px] text-[var(--terracotta)]">{uploadError}</p>}
              <div className="pt-1">
                <Label htmlFor="gallery-url" className="text-[var(--subtle)] font-normal">Or media URL</Label>
                <Input id="gallery-url" type="url" value={form.url} onChange={(e) => { setForm((f) => ({ ...f, url: e.target.value })); setUploadError(null); }} placeholder="https://… (image or video)" className="mt-1 bg-[var(--elevated)] border-[var(--border-md)] font-mono text-sm" />
              </div>
              <p className="text-[11px] text-[var(--muted)]">Leave empty for a placeholder card with title and type only.</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} className="border-[var(--border)] text-[var(--white)]">Cancel</Button>
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
