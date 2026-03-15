import React, { useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import { adminEndpoints } from '../../services/adminApi';
import { User, FileText, Share2, Check } from 'lucide-react';

const defaultInfo = {
  name: '',
  tagline: '',
  tagline_suffix: '',
  description: '',
  role: '',
  email: '',
  location: '',
  availability: '',
  social: { github: '', twitter: '', linkedin: '', whatsapp: '' },
  locale: 'en',
};

const SOCIAL_KEYS = [
  { key: 'github', label: 'GitHub', placeholder: 'https://github.com/username' },
  { key: 'twitter', label: 'Twitter / X', placeholder: 'https://twitter.com/username' },
  { key: 'linkedin', label: 'LinkedIn', placeholder: 'https://linkedin.com/in/username' },
  { key: 'whatsapp', label: 'WhatsApp', placeholder: 'https://wa.me/234...' },
];

export default function AdminPersonalInfoPage() {
  const [form, setForm] = useState(defaultInfo);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    adminEndpoints.personalInfo.get().then((d) => setForm(d || defaultInfo)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));
  const updateSocial = (key, value) => setForm((f) => ({ ...f, social: { ...f.social, [key]: value } }));

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await adminEndpoints.personalInfo.update(form);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div>
        <AdminPageHeader kicker="Settings" title="Personal info" subtitle="Hero, contact, and social links used across the site." />
        <p className="font-mono text-[13px] text-[var(--subtle)]">Loading…</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <AdminPageHeader kicker="Settings" title="Personal info" subtitle="Hero, contact, and social links used across the site." />
        <Button
          onClick={handleSave}
          disabled={saving}
          className="self-start sm:self-center h-11 font-display font-semibold text-[13px] bg-[var(--sungold)] text-[var(--void)] rounded-none hover:shadow-[var(--shadow-sharp-gold)] hover:-translate-y-0.5"
        >
          {saved ? <><Check className="w-4 h-4 mr-2" /> Saved</> : saving ? 'Saving…' : 'Save changes'}
        </Button>
      </div>

      <div className="max-w-2xl space-y-6" role="form" aria-label="Personal info">
        {/* Hero */}
        <section className="p-5 md:p-6 border border-[var(--border)] bg-[var(--surface)]">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 flex items-center justify-center border border-[var(--border)] bg-[var(--elevated)]">
              <User className="w-4 h-4 text-[var(--sungold)]" />
            </div>
            <div>
              <h2 className="font-display text-[15px] font-semibold text-[var(--white)]">Hero</h2>
              <p className="font-mono text-[11px] text-[var(--subtle)]">Name and tagline on the home page</p>
            </div>
          </div>
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="info-name">Name</Label>
              <Input id="info-name" value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="e.g. Ajibola Akelebe" className="bg-[var(--elevated)] border-[var(--border-md)]" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="info-tagline">Tagline (line 1)</Label>
              <Input id="info-tagline" value={form.tagline} onChange={(e) => update('tagline', e.target.value)} placeholder="e.g. Design & Engineering," className="bg-[var(--elevated)] border-[var(--border-md)]" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="info-tagline-suffix">Tagline suffix (line 2)</Label>
              <Input id="info-tagline-suffix" value={form.tagline_suffix} onChange={(e) => update('tagline_suffix', e.target.value)} placeholder="e.g. No boundaries." className="bg-[var(--elevated)] border-[var(--border-md)]" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="info-role">Role (subtitle)</Label>
              <Input id="info-role" value={form.role} onChange={(e) => update('role', e.target.value)} placeholder="e.g. // FULL-STACK · UI DESIGN" className="bg-[var(--elevated)] border-[var(--border-md)]" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="info-locale">Site locale</Label>
              <select
                id="info-locale"
                value={form.locale ?? 'en'}
                onChange={(e) => update('locale', e.target.value)}
                className="w-full bg-[var(--elevated)] border border-[var(--border-md)] px-4 py-[10px] font-body text-[14px] text-[var(--white)] rounded-none"
              >
                <option value="en">English</option>
                <option value="fr">Français</option>
              </select>
              <p className="font-mono text-[11px] text-[var(--subtle)]">UI strings (nav, hero, contact, teach) follow this locale.</p>
            </div>
          </div>
        </section>

        {/* About & contact */}
        <section className="p-5 md:p-6 border border-[var(--border)] bg-[var(--surface)]">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 flex items-center justify-center border border-[var(--border)] bg-[var(--elevated)]">
              <FileText className="w-4 h-4 text-[var(--stardust)]" />
            </div>
            <div>
              <h2 className="font-display text-[15px] font-semibold text-[var(--white)]">About & contact</h2>
              <p className="font-mono text-[11px] text-[var(--subtle)]">Bio, email, location, availability (Contact & Teach)</p>
            </div>
          </div>
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="info-description">Short bio</Label>
              <Textarea id="info-description" value={form.description} onChange={(e) => update('description', e.target.value)} rows={3} placeholder="Used on About and Contact pages" className="bg-[var(--elevated)] border-[var(--border-md)] resize-y" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="info-email">Email</Label>
                <Input id="info-email" type="email" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="hello@example.com" className="bg-[var(--elevated)] border-[var(--border-md)]" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="info-location">Location</Label>
                <Input id="info-location" value={form.location} onChange={(e) => update('location', e.target.value)} placeholder="e.g. Nigeria" className="bg-[var(--elevated)] border-[var(--border-md)]" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="info-availability">Availability</Label>
              <Input id="info-availability" value={form.availability} onChange={(e) => update('availability', e.target.value)} placeholder="e.g. Available for projects" className="bg-[var(--elevated)] border-[var(--border-md)]" />
            </div>
          </div>
        </section>

        {/* Social */}
        <section className="p-5 md:p-6 border border-[var(--border)] bg-[var(--surface)]">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 flex items-center justify-center border border-[var(--border)] bg-[var(--elevated)]">
              <Share2 className="w-4 h-4 text-[var(--nebula)]" />
            </div>
            <div>
              <h2 className="font-display text-[15px] font-semibold text-[var(--white)]">Social links</h2>
              <p className="font-mono text-[11px] text-[var(--subtle)]">Footer, Contact, Teach WhatsApp CTA</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {SOCIAL_KEYS.map(({ key, label, placeholder }) => (
              <div key={key} className="space-y-2">
                <Label htmlFor={`info-social-${key}`}>{label}</Label>
                <Input
                  id={`info-social-${key}`}
                  type="url"
                  inputMode="url"
                  value={form.social?.[key] || ''}
                  onChange={(e) => updateSocial(key, e.target.value)}
                  placeholder={placeholder}
                  className="bg-[var(--elevated)] border-[var(--border-md)] font-mono text-[13px]"
                />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
