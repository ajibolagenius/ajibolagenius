import React, { useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { adminEndpoints } from '../../services/adminApi';

const defaultInfo = {
  name: '', tagline: '', tagline_suffix: '', description: '', role: '', email: '', location: '', availability: '',
  social: { github: '', twitter: '', linkedin: '', whatsapp: '' },
};

export default function AdminPersonalInfoPage() {
  const [form, setForm] = useState(defaultInfo);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    adminEndpoints.personalInfo.get().then((d) => setForm(d || defaultInfo)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));
  const updateSocial = (key, value) => setForm((f) => ({ ...f, social: { ...f.social, [key]: value } }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await adminEndpoints.personalInfo.update(form);
    } catch (e) { console.error(e); } finally { setSaving(false); }
  };

  if (loading) return <p className="text-[var(--muted)] font-mono text-sm">Loading…</p>;

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-[var(--white)] mb-6">Personal info</h1>
      <div className="max-w-2xl space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2"><Label>Name</Label><Input value={form.name} onChange={(e) => update('name', e.target.value)} className="bg-[var(--elevated)] border-[var(--border-md)]" /></div>
          <div className="space-y-2"><Label>Email</Label><Input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} className="bg-[var(--elevated)] border-[var(--border-md)]" /></div>
        </div>
        <div className="space-y-2"><Label>Tagline</Label><Input value={form.tagline} onChange={(e) => update('tagline', e.target.value)} className="bg-[var(--elevated)] border-[var(--border-md)]" /></div>
        <div className="space-y-2"><Label>Tagline suffix</Label><Input value={form.tagline_suffix} onChange={(e) => update('tagline_suffix', e.target.value)} className="bg-[var(--elevated)] border-[var(--border-md)]" /></div>
        <div className="space-y-2"><Label>Role (subtitle)</Label><Input value={form.role} onChange={(e) => update('role', e.target.value)} className="bg-[var(--elevated)] border-[var(--border-md)]" /></div>
        <div className="space-y-2"><Label>Description</Label><Textarea value={form.description} onChange={(e) => update('description', e.target.value)} rows={3} className="bg-[var(--elevated)] border-[var(--border-md)]" /></div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2"><Label>Location</Label><Input value={form.location} onChange={(e) => update('location', e.target.value)} className="bg-[var(--elevated)] border-[var(--border-md)]" /></div>
          <div className="space-y-2"><Label>Availability</Label><Input value={form.availability} onChange={(e) => update('availability', e.target.value)} className="bg-[var(--elevated)] border-[var(--border-md)]" /></div>
        </div>
        <div className="pt-4 border-t border-[var(--border)]">
          <span className="font-mono text-[11px] text-[var(--sungold)] uppercase">Social</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
            {['github', 'twitter', 'linkedin', 'whatsapp'].map((key) => (
              <div key={key} className="space-y-2">
                <Label className="capitalize">{key}</Label>
                <Input value={form.social?.[key] || ''} onChange={(e) => updateSocial(key, e.target.value)} className="bg-[var(--elevated)] border-[var(--border-md)]" />
              </div>
            ))}
          </div>
        </div>
        <Button onClick={handleSave} disabled={saving} className="bg-[var(--sungold)] text-[var(--void)] font-display font-semibold mt-4">{saving ? 'Saving…' : 'Save'}</Button>
      </div>
    </div>
  );
}
