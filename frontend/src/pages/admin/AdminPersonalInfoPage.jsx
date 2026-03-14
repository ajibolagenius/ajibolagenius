import React, { useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
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

  if (loading) return <p className="font-mono text-[13px] text-[var(--subtle)]">Loading…</p>;

  return (
    <div>
      <AdminPageHeader kicker="Settings" title="Personal info" subtitle="Hero headline (tagline + suffix), Contact page, and Teach WhatsApp link." />
      <div className="max-w-2xl space-y-4" role="form" aria-label="Personal info">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2"><Label htmlFor="info-name">Name</Label><Input id="info-name" value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="e.g. Ajibola Akelebe" className="bg-[var(--elevated)] border-[var(--border-md)]" /></div>
          <div className="space-y-2"><Label htmlFor="info-email">Email</Label><Input id="info-email" type="email" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="e.g. hello@example.com" className="bg-[var(--elevated)] border-[var(--border-md)]" /></div>
        </div>
        <div className="space-y-2"><Label htmlFor="info-tagline">Tagline (hero line 1)</Label><Input id="info-tagline" value={form.tagline} onChange={(e) => update('tagline', e.target.value)} placeholder="e.g. Design & Engineering," className="bg-[var(--elevated)] border-[var(--border-md)]" /></div>
        <div className="space-y-2"><Label htmlFor="info-tagline-suffix">Tagline suffix (hero line 2)</Label><Input id="info-tagline-suffix" value={form.tagline_suffix} onChange={(e) => update('tagline_suffix', e.target.value)} placeholder="e.g. No boundaries." className="bg-[var(--elevated)] border-[var(--border-md)]" /></div>
        <div className="space-y-2"><Label htmlFor="info-role">Role (subtitle)</Label><Input id="info-role" value={form.role} onChange={(e) => update('role', e.target.value)} placeholder="e.g. // FULL-STACK · UI DESIGN" className="bg-[var(--elevated)] border-[var(--border-md)]" /></div>
        <div className="space-y-2"><Label htmlFor="info-description">Description</Label><Textarea id="info-description" value={form.description} onChange={(e) => update('description', e.target.value)} rows={3} placeholder="Short bio for About and Contact" className="bg-[var(--elevated)] border-[var(--border-md)]" /></div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2"><Label htmlFor="info-location">Location</Label><Input id="info-location" value={form.location} onChange={(e) => update('location', e.target.value)} placeholder="e.g. Nigeria" className="bg-[var(--elevated)] border-[var(--border-md)]" /></div>
          <div className="space-y-2"><Label htmlFor="info-availability">Availability</Label><Input id="info-availability" value={form.availability} onChange={(e) => update('availability', e.target.value)} placeholder="e.g. Available for projects" className="bg-[var(--elevated)] border-[var(--border-md)]" /></div>
        </div>
        <fieldset className="pt-4 border-t border-[var(--border)] border-0 p-0 m-0">
          <legend className="font-mono text-[11px] text-[var(--sungold)] uppercase">Social</legend>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
            {['github', 'twitter', 'linkedin', 'whatsapp'].map((key) => (
              <div key={key} className="space-y-2">
                <Label htmlFor={`info-social-${key}`} className="capitalize">{key}</Label>
                <Input id={`info-social-${key}`} type="url" inputMode="url" value={form.social?.[key] || ''} onChange={(e) => updateSocial(key, e.target.value)} placeholder={{ github: 'https://github.com/...', twitter: 'https://twitter.com/...', linkedin: 'https://linkedin.com/in/...', whatsapp: 'https://wa.me/234...' }[key]} className="bg-[var(--elevated)] border-[var(--border-md)]" />
              </div>
            ))}
          </div>
        </fieldset>
        <Button onClick={handleSave} disabled={saving} className="mt-4 h-11 font-display font-semibold text-[13px] bg-[var(--sungold)] text-[var(--void)] rounded-none hover:shadow-[var(--shadow-sharp-gold)] hover:-translate-y-0.5">{saving ? 'Saving…' : 'Save'}</Button>
      </div>
    </div>
  );
}
