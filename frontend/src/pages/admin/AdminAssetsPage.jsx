import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../../components/ui/alert-dialog';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import { adminEndpoints, uploadAssetFile } from '../../services/adminApi';
import { Download, ExternalLink, FileText, Pencil, Trash2, Upload, X, Link as LinkIcon } from 'lucide-react';

const ASSET_TYPES = [
  { value: 'file', label: 'File upload' },
  { value: 'link', label: 'External link' },
  { value: 'other', label: 'Other (not a file or link)' },
];

const UPLOAD_ACCEPT = 'image/jpeg,image/png,image/webp,image/gif,application/pdf,application/zip,application/x-zip-compressed,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/plain,text/csv,application/json,application/octet-stream';

const emptyItem = () => ({
  title: '',
  description: '',
  asset_type: 'file',
  file_path: '',
  file_name: '',
  external_url: '',
  category: '',
  sort_order: 0,
});

export default function AdminAssetsPage() {
  const [list, setList] = useState([]);
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
    adminEndpoints.assets.list().then(setList).catch(() => setList([])).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyItem());
    setUploadError(null);
    setDialogOpen(true);
  };
  const openEdit = (item) => {
    setEditing(item);
    setForm({
      title: item.title ?? '',
      description: item.description ?? '',
      asset_type: item.asset_type ?? 'file',
      file_path: item.file_path ?? '',
      file_name: item.file_name ?? '',
      external_url: item.external_url ?? '',
      category: item.category ?? '',
      sort_order: typeof item.sort_order === 'number' ? item.sort_order : 0,
    });
    setUploadError(null);
    setDialogOpen(true);
  };
  const openDelete = (item) => {
    setToDelete(item);
    setDeleteOpen(true);
  };

  const handleUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError(null);
    setUploading(true);
    uploadAssetFile(file)
      .then(({ path, fileName }) => setForm((f) => ({ ...f, file_path: path, file_name: fileName })))
      .catch((err) => setUploadError(err.message || 'Upload failed.'))
      .finally(() => {
        setUploading(false);
        e.target.value = '';
      });
  };

  const clearFile = () => setForm((f) => ({ ...f, file_path: '', file_name: '' }));

  const handleSave = async () => {
    const payload = {
      title: form.title.trim(),
      description: form.description.trim() || null,
      asset_type: form.asset_type,
      category: form.category.trim() || null,
      sort_order: form.sort_order,
    };
    if (form.asset_type === 'file') {
      payload.file_path = form.file_path || null;
      payload.file_name = form.file_name || null;
      payload.external_url = null;
    } else if (form.asset_type === 'link') {
      payload.external_url = form.external_url?.trim() || null;
      payload.file_path = null;
      payload.file_name = null;
    } else {
      payload.file_path = null;
      payload.file_name = null;
      payload.external_url = form.external_url?.trim() || null;
    }
    setSaving(true);
    try {
      if (editing) await adminEndpoints.assets.update(editing.id, payload);
      else await adminEndpoints.assets.create(payload);
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
      await adminEndpoints.assets.delete(toDelete.id);
      setDeleteOpen(false);
      setToDelete(null);
      load();
    } catch (e) {
      console.error(e);
    }
  };

  const typeIcon = (t) => (t === 'file' ? FileText : t === 'link' ? ExternalLink : Download);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <AdminPageHeader
          kicker="Content"
          title="Assets & Downloads"
          subtitle="Share files (upload), external links, or other items (e.g. physical products). Public page: /assets"
        />
        <Button onClick={openCreate} className="self-start sm:self-center h-11 font-display font-semibold text-[13px] bg-[var(--sungold)] text-[var(--void)] rounded-none hover:shadow-[var(--shadow-sharp-gold)] hover:-translate-y-0.5">
          Add asset
        </Button>
      </div>

      {loading ? (
        <p className="text-[var(--muted)] font-mono text-sm">Loading…</p>
      ) : list.length === 0 ? (
        <div className="border border-[var(--border)] border-dashed rounded p-12 text-center">
          <p className="text-[var(--muted)] font-body mb-4">No assets yet.</p>
          <Button onClick={openCreate} variant="outline" className="border-[var(--border)] text-[var(--white)]">Add first asset</Button>
        </div>
      ) : (
        <ul className="space-y-3 list-none p-0 m-0">
          {list.map((item) => {
            const Icon = typeIcon(item.asset_type);
            return (
              <li key={item.id} className="border border-[var(--border)] bg-[var(--surface)] p-4 flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0 flex-1 flex items-center gap-3">
                  <Icon className="h-5 w-5 text-[var(--sungold)] shrink-0" aria-hidden />
                  <div className="min-w-0">
                    <p className="font-body text-sm text-[var(--white)] truncate">{item.title}</p>
                    <p className="font-mono text-[11px] text-[var(--muted)]">
                      {item.asset_type}
                      {item.category && ` · ${item.category}`}
                    </p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button variant="secondary" size="icon" className="h-8 w-8 bg-[var(--void)]/90 text-[var(--white)]" onClick={() => openEdit(item)} aria-label="Edit">
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="secondary" size="icon" className="h-8 w-8 bg-[var(--terracotta)]/90 text-white" onClick={() => openDelete(item)} aria-label="Delete">
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg border-[var(--border)] bg-[var(--surface)] text-[var(--white)]">
          <DialogDescription className="sr-only">Add or edit an asset: file upload, external link, or other.</DialogDescription>
          <DialogHeader><DialogTitle>{editing ? 'Edit asset' : 'New asset'}</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4" role="form">
            <div className="space-y-2">
              <Label htmlFor="asset-title">Title</Label>
              <Input id="asset-title" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="e.g. Brand guidelines PDF" className="bg-[var(--elevated)] border-[var(--border-md)]" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="asset-description">Description (optional)</Label>
              <Input id="asset-description" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="Short description" className="bg-[var(--elevated)] border-[var(--border-md)]" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="asset-type">Type</Label>
              <Select value={form.asset_type} onValueChange={(v) => setForm((f) => ({ ...f, asset_type: v }))}>
                <SelectTrigger id="asset-type" className="bg-[var(--elevated)] border-[var(--border-md)] text-[var(--white)]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-[var(--border)] bg-[var(--surface)]">
                  {ASSET_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value} className="text-[var(--white)] focus:bg-[var(--elevated)] flex items-center gap-2">
                      {t.value === 'file' ? <FileText className="h-4 w-4" /> : t.value === 'link' ? <LinkIcon className="h-4 w-4" /> : <Download className="h-4 w-4" />}
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="asset-category">Category (optional)</Label>
              <Input id="asset-category" value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} placeholder="e.g. Branding, Templates" className="bg-[var(--elevated)] border-[var(--border-md)]" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="asset-sort">Sort order</Label>
              <Input id="asset-sort" type="number" min={0} value={form.sort_order} onChange={(e) => setForm((f) => ({ ...f, sort_order: parseInt(e.target.value, 10) || 0 }))} className="bg-[var(--elevated)] border-[var(--border-md)] w-24" />
            </div>

            {form.asset_type === 'file' && (
              <div className="space-y-2">
                <Label>File</Label>
                <div className="flex flex-wrap items-center gap-2">
                  <input ref={fileInputRef} type="file" accept={UPLOAD_ACCEPT} className="hidden" onChange={handleUpload} aria-label="Upload file" />
                  <Button type="button" variant="outline" size="sm" className="border-[var(--border)] text-[var(--white)]" disabled={uploading} onClick={() => fileInputRef.current?.click()}>
                    <Upload className="h-4 w-4 mr-2" />
                    {uploading ? 'Uploading…' : 'Upload file'}
                  </Button>
                  {form.file_name && (
                    <>
                      <span className="font-mono text-[12px] text-[var(--muted)] truncate max-w-[200px]" title={form.file_name}>{form.file_name}</span>
                      <Button type="button" variant="ghost" size="sm" className="text-[var(--muted)]" onClick={clearFile} aria-label="Clear file"><X className="h-4 w-4" /></Button>
                    </>
                  )}
                </div>
                <p className="text-[11px] text-[var(--muted)]">PDF, images, ZIP, Excel, CSV, JSON, etc.</p>
                {uploadError && <p className="font-mono text-[11px] text-[var(--terracotta)]">{uploadError}</p>}
              </div>
            )}

            {(form.asset_type === 'link' || form.asset_type === 'other') && (
              <div className="space-y-2">
                <Label htmlFor="asset-url">{form.asset_type === 'link' ? 'External URL' : 'Optional URL (e.g. more info)'}</Label>
                <Input id="asset-url" type="url" value={form.external_url} onChange={(e) => setForm((f) => ({ ...f, external_url: e.target.value }))} placeholder="https://…" className="bg-[var(--elevated)] border-[var(--border-md)] font-mono text-sm" />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} className="border-[var(--border)] text-[var(--white)]">Cancel</Button>
            <Button onClick={handleSave} disabled={saving || !form.title.trim() || (form.asset_type === 'file' && !form.file_path) || (form.asset_type === 'link' && !form.external_url?.trim())} className="bg-[var(--sungold)] text-[var(--void)]">{saving ? 'Saving…' : 'Save'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent className="border-[var(--border)] bg-[var(--surface)]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[var(--white)]">Delete asset?</AlertDialogTitle>
            <AlertDialogDescription className="text-[var(--muted)]">{toDelete?.title} will be removed. Uploaded file in storage is not deleted.</AlertDialogDescription>
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
