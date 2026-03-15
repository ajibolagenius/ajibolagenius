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
import { adminEndpoints } from '../../services/adminApi';

const ADMIN_PAGE_SIZE = 10;

const emptyEntry = () => ({ year: '', title: '', body: '', accent: 'sungold', order: 0 });
const emptyEduEntry = () => ({ year: '', degree: '', school: '', description: '', order: 0 });
const emptyCertEntry = () => ({ title: '', order: 0 });

export default function AdminTimelinePage() {
  const [list, setList] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyEntry());
  const [saving, setSaving] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  const [eduList, setEduList] = useState([]);
  const [eduPage, setEduPage] = useState(1);
  const [eduLoading, setEduLoading] = useState(true);
  const [eduDialogOpen, setEduDialogOpen] = useState(false);
  const [eduDeleteOpen, setEduDeleteOpen] = useState(false);
  const [editingEdu, setEditingEdu] = useState(null);
  const [eduForm, setEduForm] = useState(emptyEduEntry());
  const [eduSaving, setEduSaving] = useState(false);
  const [toDeleteEdu, setToDeleteEdu] = useState(null);

  const [certList, setCertList] = useState([]);
  const [certPage, setCertPage] = useState(1);
  const [certLoading, setCertLoading] = useState(true);
  const [certDialogOpen, setCertDialogOpen] = useState(false);
  const [certDeleteOpen, setCertDeleteOpen] = useState(false);
  const [editingCert, setEditingCert] = useState(null);
  const [certForm, setCertForm] = useState(emptyCertEntry());
  const [certSaving, setCertSaving] = useState(false);
  const [toDeleteCert, setToDeleteCert] = useState(null);

  const load = () => {
    setLoading(true);
    adminEndpoints.timeline.list().then(setList).catch(() => setList([])).finally(() => setLoading(false));
  };
  const loadEdu = () => {
    setEduLoading(true);
    adminEndpoints.education.list().then(setEduList).catch(() => setEduList([])).finally(() => setEduLoading(false));
  };
  const loadCert = () => {
    setCertLoading(true);
    adminEndpoints.certifications.list().then(setCertList).catch(() => setCertList([])).finally(() => setCertLoading(false));
  };
  useEffect(load, []);
  useEffect(loadEdu, []);
  useEffect(loadCert, []);

  const { items: paginatedList, totalPages, start, end, total } = useMemo(
    () => paginate(list, page, ADMIN_PAGE_SIZE),
    [list, page]
  );
  const { items: paginatedEduList, totalPages: eduTotalPages, start: eduStart, end: eduEnd, total: eduTotal } = useMemo(
    () => paginate(eduList, eduPage, ADMIN_PAGE_SIZE),
    [eduList, eduPage]
  );
  const { items: paginatedCertList, totalPages: certTotalPages, start: certStart, end: certEnd, total: certTotal } = useMemo(
    () => paginate(certList, certPage, ADMIN_PAGE_SIZE),
    [certList, certPage]
  );

  const openCreate = () => { setEditing(null); setForm(emptyEntry()); setDialogOpen(true); };
  const openEdit = (p) => { setEditing(p); setForm({ year: p.year, title: p.title, body: p.body, accent: p.accent || 'sungold', order: p.order ?? 0 }); setDialogOpen(true); };
  const openDelete = (p) => { setToDelete(p); setDeleteOpen(true); };

  const openCreateEdu = () => { setEditingEdu(null); setEduForm(emptyEduEntry()); setEduDialogOpen(true); };
  const openEditEdu = (p) => { setEditingEdu(p); setEduForm({ year: p.year, degree: p.degree, school: p.school, description: p.description ?? '', order: p.order ?? 0 }); setEduDialogOpen(true); };
  const openDeleteEdu = (p) => { setToDeleteEdu(p); setEduDeleteOpen(true); };

  const openCreateCert = () => { setEditingCert(null); setCertForm(emptyCertEntry()); setCertDialogOpen(true); };
  const openEditCert = (p) => { setEditingCert(p); setCertForm({ title: p.title ?? '', order: p.order ?? 0 }); setCertDialogOpen(true); };
  const openDeleteCert = (p) => { setToDeleteCert(p); setCertDeleteOpen(true); };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editing) await adminEndpoints.timeline.update(editing.id, form);
      else await adminEndpoints.timeline.create(form);
      setDialogOpen(false);
      load();
    } catch (e) { console.error(e); } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!toDelete) return;
    try {
      await adminEndpoints.timeline.delete(toDelete.id);
      setDeleteOpen(false);
      setToDelete(null);
      load();
    } catch (e) { console.error(e); }
  };

  const handleSaveEdu = async () => {
    setEduSaving(true);
    try {
      if (editingEdu) await adminEndpoints.education.update(editingEdu.id, eduForm);
      else await adminEndpoints.education.create(eduForm);
      setEduDialogOpen(false);
      loadEdu();
    } catch (e) { console.error(e); } finally { setEduSaving(false); }
  };

  const handleDeleteEdu = async () => {
    if (!toDeleteEdu) return;
    try {
      await adminEndpoints.education.delete(toDeleteEdu.id);
      setEduDeleteOpen(false);
      setToDeleteEdu(null);
      loadEdu();
    } catch (e) { console.error(e); }
  };

  const handleSaveCert = async () => {
    setCertSaving(true);
    try {
      if (editingCert) await adminEndpoints.certifications.update(editingCert.id, certForm);
      else await adminEndpoints.certifications.create(certForm);
      setCertDialogOpen(false);
      loadCert();
    } catch (e) { console.error(e); } finally { setCertSaving(false); }
  };

  const handleDeleteCert = async () => {
    if (!toDeleteCert) return;
    try {
      await adminEndpoints.certifications.delete(toDeleteCert.id);
      setCertDeleteOpen(false);
      setToDeleteCert(null);
      loadCert();
    } catch (e) { console.error(e); }
  };

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));
  const updateEdu = (key, value) => setEduForm((f) => ({ ...f, [key]: value }));
  const updateCert = (key, value) => setCertForm((f) => ({ ...f, [key]: value }));

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <AdminPageHeader kicker="Content" title="Timeline (CV)" subtitle="Shown on Home timeline and CV page. Lower order = higher in list." />
        <Button onClick={openCreate} className="self-start sm:self-center h-11 font-display font-semibold text-[13px] bg-[var(--sungold)] text-[var(--void)] rounded-none hover:shadow-[var(--shadow-sharp-gold)] hover:-translate-y-0.5">Add entry</Button>
      </div>
      {loading ? <p className="text-[var(--muted)] font-mono text-sm">Loading…</p> : (
        <div className="border border-[var(--border)] overflow-x-auto">
          <table className="w-full text-left min-w-[500px]">
            <thead className="bg-[var(--surface)] border-b border-[var(--border)]">
              <tr>
                <th className="px-4 py-3 font-mono text-[11px] text-[var(--subtle)] uppercase">Year</th>
                <th className="px-4 py-3 font-mono text-[11px] text-[var(--subtle)] uppercase">Title</th>
                <th className="px-4 py-3 font-mono text-[11px] text-[var(--subtle)] uppercase w-28">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {paginatedList.map((p) => (
                <tr key={p.id} className="bg-[var(--elevated)]/50 hover:bg-[var(--elevated)]">
                  <td className="px-4 py-3 font-mono text-[12px] text-[var(--sungold)]">{p.year}</td>
                  <td className="px-4 py-3 font-body text-sm text-[var(--white)]">{p.title}</td>
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

      {/* Education section */}
      <div className="mt-16 pt-12 border-t border-[var(--border)]">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
          <h2 className="font-display text-[18px] font-bold text-[var(--white)]">Education</h2>
          <Button onClick={openCreateEdu} variant="outline" className="self-start sm:self-center h-11 font-display font-semibold text-[13px] border-[var(--border)] text-[var(--white)] rounded-none">Add entry</Button>
        </div>
        {eduLoading ? <p className="text-[var(--muted)] font-mono text-sm">Loading…</p> : (
          <div className="border border-[var(--border)] overflow-x-auto">
            <table className="w-full text-left min-w-[500px]">
              <thead className="bg-[var(--surface)] border-b border-[var(--border)]">
                <tr>
                  <th className="px-4 py-3 font-mono text-[11px] text-[var(--subtle)] uppercase">Year</th>
                  <th className="px-4 py-3 font-mono text-[11px] text-[var(--subtle)] uppercase">Degree</th>
                  <th className="px-4 py-3 font-mono text-[11px] text-[var(--subtle)] uppercase">School</th>
                  <th className="px-4 py-3 font-mono text-[11px] text-[var(--subtle)] uppercase w-28">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {paginatedEduList.length === 0 ? (
                  <tr><td colSpan={4} className="px-4 py-8 text-center text-[var(--muted)] font-mono text-sm">No education entries yet.</td></tr>
                ) : (
                  paginatedEduList.map((p) => (
                    <tr key={p.id} className="bg-[var(--elevated)]/50 hover:bg-[var(--elevated)]">
                      <td className="px-4 py-3 font-mono text-[12px] text-[var(--stardust)]">{p.year}</td>
                      <td className="px-4 py-3 font-body text-sm text-[var(--white)]">{p.degree}</td>
                      <td className="px-4 py-3 font-body text-sm text-[var(--muted)]">{p.school}</td>
                      <td className="px-4 py-3 flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => openEditEdu(p)}>Edit</Button>
                        <Button variant="ghost" size="sm" className="text-[var(--terracotta)]" onClick={() => openDeleteEdu(p)}>Delete</Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
        {eduList.length > 0 && (
          <ListPagination page={eduPage} totalPages={eduTotalPages} onPageChange={setEduPage} range={{ start: eduStart, end: eduEnd, total: eduTotal }} />
        )}
      </div>

      {/* Certifications section */}
      <div className="mt-16 pt-12 border-t border-[var(--border)]">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
          <h2 className="font-display text-[18px] font-bold text-[var(--white)]">Certifications</h2>
          <Button onClick={openCreateCert} variant="outline" className="self-start sm:self-center h-11 font-display font-semibold text-[13px] border-[var(--border)] text-[var(--white)] rounded-none">Add entry</Button>
        </div>
        {certLoading ? <p className="text-[var(--muted)] font-mono text-sm">Loading…</p> : (
          <div className="border border-[var(--border)] overflow-x-auto">
            <table className="w-full text-left min-w-[400px]">
              <thead className="bg-[var(--surface)] border-b border-[var(--border)]">
                <tr>
                  <th className="px-4 py-3 font-mono text-[11px] text-[var(--subtle)] uppercase">Order</th>
                  <th className="px-4 py-3 font-mono text-[11px] text-[var(--subtle)] uppercase">Title</th>
                  <th className="px-4 py-3 font-mono text-[11px] text-[var(--subtle)] uppercase w-28">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {paginatedCertList.length === 0 ? (
                  <tr><td colSpan={3} className="px-4 py-8 text-center text-[var(--muted)] font-mono text-sm">No certifications yet.</td></tr>
                ) : (
                  paginatedCertList.map((p) => (
                    <tr key={p.id} className="bg-[var(--elevated)]/50 hover:bg-[var(--elevated)]">
                      <td className="px-4 py-3 font-mono text-[12px] text-[var(--sungold)]">{p.order}</td>
                      <td className="px-4 py-3 font-body text-sm text-[var(--white)]">{p.title}</td>
                      <td className="px-4 py-3 flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => openEditCert(p)}>Edit</Button>
                        <Button variant="ghost" size="sm" className="text-[var(--terracotta)]" onClick={() => openDeleteCert(p)}>Delete</Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
        {certList.length > 0 && (
          <ListPagination page={certPage} totalPages={certTotalPages} onPageChange={setCertPage} range={{ start: certStart, end: certEnd, total: certTotal }} />
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="border-[var(--border)] bg-[var(--surface)] text-[var(--white)]">
          <DialogHeader><DialogTitle>{editing ? 'Edit entry' : 'New entry'}</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4" role="form" aria-label={editing ? 'Edit entry' : 'New entry'}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="timeline-year">Year</Label>
                <Input id="timeline-year" type="number" min={1900} max={2100} value={form.year} onChange={(e) => update('year', e.target.value)} placeholder="e.g. 2024" className="bg-[var(--elevated)] border-[var(--border-md)]" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timeline-order">Order</Label>
                <Input id="timeline-order" type="number" value={form.order} onChange={(e) => update('order', parseInt(e.target.value, 10) || 0)} placeholder="0 = first" className="bg-[var(--elevated)] border-[var(--border-md)]" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="timeline-title">Title</Label>
              <Input id="timeline-title" value={form.title} onChange={(e) => update('title', e.target.value)} placeholder="e.g. Senior Developer at X" className="bg-[var(--elevated)] border-[var(--border-md)]" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timeline-body">Body</Label>
              <Textarea id="timeline-body" value={form.body} onChange={(e) => update('body', e.target.value)} rows={4} placeholder="Responsibilities and achievements..." className="bg-[var(--elevated)] border-[var(--border-md)]" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timeline-accent">Accent (theme color)</Label>
              <Input id="timeline-accent" value={form.accent} onChange={(e) => update('accent', e.target.value)} placeholder="sungold, nebula, stardust, terracotta" className="bg-[var(--elevated)] border-[var(--border-md)]" />
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
            <AlertDialogTitle className="text-[var(--white)]">Delete entry?</AlertDialogTitle>
            <AlertDialogDescription className="text-[var(--muted)]">{toDelete?.title} will be removed.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-[var(--border)] text-[var(--white)]">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-[var(--terracotta)] text-white">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={eduDialogOpen} onOpenChange={setEduDialogOpen}>
        <DialogContent className="border-[var(--border)] bg-[var(--surface)] text-[var(--white)]">
          <DialogHeader><DialogTitle>{editingEdu ? 'Edit education' : 'New education'}</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4" role="form" aria-label={editingEdu ? 'Edit education' : 'New education'}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edu-year">Year</Label>
                <Input id="edu-year" value={eduForm.year} onChange={(e) => updateEdu('year', e.target.value)} placeholder="e.g. 2024" className="bg-[var(--elevated)] border-[var(--border-md)]" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edu-order">Order</Label>
                <Input id="edu-order" type="number" value={eduForm.order} onChange={(e) => updateEdu('order', parseInt(e.target.value, 10) || 0)} placeholder="0 = first" className="bg-[var(--elevated)] border-[var(--border-md)]" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edu-degree">Degree</Label>
              <Input id="edu-degree" value={eduForm.degree} onChange={(e) => updateEdu('degree', e.target.value)} placeholder="e.g. B.Sc. Computer Science" className="bg-[var(--elevated)] border-[var(--border-md)]" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edu-school">School</Label>
              <Input id="edu-school" value={eduForm.school} onChange={(e) => updateEdu('school', e.target.value)} placeholder="e.g. University of Lagos" className="bg-[var(--elevated)] border-[var(--border-md)]" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edu-description">Description</Label>
              <Textarea id="edu-description" value={eduForm.description} onChange={(e) => updateEdu('description', e.target.value)} rows={2} placeholder="Optional" className="bg-[var(--elevated)] border-[var(--border-md)]" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEduDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveEdu} disabled={eduSaving} className="bg-[var(--sungold)] text-[var(--void)]">{eduSaving ? 'Saving…' : 'Save'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={eduDeleteOpen} onOpenChange={setEduDeleteOpen}>
        <AlertDialogContent className="border-[var(--border)] bg-[var(--surface)]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[var(--white)]">Delete education entry?</AlertDialogTitle>
            <AlertDialogDescription className="text-[var(--muted)]">{toDeleteEdu?.degree} will be removed.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-[var(--border)] text-[var(--white)]">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteEdu} className="bg-[var(--terracotta)] text-white">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={certDialogOpen} onOpenChange={setCertDialogOpen}>
        <DialogContent className="border-[var(--border)] bg-[var(--surface)] text-[var(--white)]">
          <DialogHeader><DialogTitle>{editingCert ? 'Edit certification' : 'New certification'}</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4" role="form" aria-label={editingCert ? 'Edit certification' : 'New certification'}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cert-order">Order</Label>
                <Input id="cert-order" type="number" value={certForm.order} onChange={(e) => updateCert('order', parseInt(e.target.value, 10) || 0)} placeholder="0 = first" className="bg-[var(--elevated)] border-[var(--border-md)]" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cert-title">Title</Label>
                <Input id="cert-title" value={certForm.title} onChange={(e) => updateCert('title', e.target.value)} placeholder="e.g. Meta Front-End Developer Certificate" className="bg-[var(--elevated)] border-[var(--border-md)]" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCertDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveCert} disabled={certSaving} className="bg-[var(--sungold)] text-[var(--void)]">{certSaving ? 'Saving…' : 'Save'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={certDeleteOpen} onOpenChange={setCertDeleteOpen}>
        <AlertDialogContent className="border-[var(--border)] bg-[var(--surface)]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[var(--white)]">Delete certification?</AlertDialogTitle>
            <AlertDialogDescription className="text-[var(--muted)]">{toDeleteCert?.title} will be removed.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-[var(--border)] text-[var(--white)]">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCert} className="bg-[var(--terracotta)] text-white">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
