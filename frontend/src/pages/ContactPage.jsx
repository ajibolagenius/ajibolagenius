import React, { useState } from 'react';
import { Send, MessageSquare, MapPin, Mail, Github, Twitter, Linkedin } from 'lucide-react';
import { submitContact, fetchPersonalInfo } from '../services/api';
import { usePageMeta } from '../hooks/usePageMeta';
import { useRealtimeQuery } from '../hooks/useRealtimeQuery';
import { useLocale } from '../contexts/LocaleContext';
import { ContactSkeleton } from '../components/portfolio/SkeletonLayouts';

const INPUT_CLASS =
  'w-full bg-[var(--elevated)] border border-[var(--border-md)] px-4 py-[10px] font-body text-[14px] text-[var(--white)] placeholder:text-[var(--subtle)] outline-none transition-all duration-200 rounded-none focus:border-[var(--sungold)] focus:shadow-[var(--shadow-sharp-ring)]';

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responseMsg, setResponseMsg] = useState('');
  const [isError, setIsError] = useState(false);
  const { data: info, loading } = useRealtimeQuery('personal_info', fetchPersonalInfo);
  const { t } = useLocale();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = {
      name: (formData.name || '').trim(),
      email: (formData.email || '').trim(),
      subject: (formData.subject || '').trim(),
      message: (formData.message || '').trim(),
    };
    if (!trimmed.name || !trimmed.email || !trimmed.subject || !trimmed.message) return;
    setIsSubmitting(true);
    setResponseMsg('');
    setIsError(false);
    try {
      const res = await submitContact(trimmed);
      setResponseMsg(res?.message || t('contact_success'));
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => {
        setSubmitted(false);
        setResponseMsg('');
      }, 5000);
    } catch (err) {
      setResponseMsg(err?.message || t('contact_error'));
      setIsError(true);
      setTimeout(() => {
        setResponseMsg('');
        setIsError(false);
      }, 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const data = info || {};
  const social = data.social || {};

  usePageMeta({
    title: 'Contact',
    description: 'Get in touch — design and engineering inquiries, collaboration, or just say hello.',
    canonical: '/contact',
  });

  const socialLinks = [
    { icon: Github, label: 'GitHub', href: social.github },
    { icon: Twitter, label: 'Twitter / X', href: social.twitter },
    { icon: Linkedin, label: 'LinkedIn', href: social.linkedin },
    { icon: MessageSquare, label: 'WhatsApp', href: social.whatsapp }
  ].filter(l => l.href);

  return (
    <>
      <section className="pt-12 pb-8 md:pt-20 md:pb-10 border-b border-[var(--border)]">
        <div className="max-w-[1160px] mx-auto px-4 md:px-8">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-5 h-px bg-[var(--sungold)]" />
            <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-[var(--sungold)]">
              {t('contact_kicker')}
            </span>
          </div>
          <h1 className="font-display font-extrabold leading-[1.05] tracking-[-0.03em] mb-4 text-[var(--white)]" style={{ fontSize: 'clamp(36px, 6vw, 64px)' }}>
            {t('contact_heading')}
          </h1>
          <p className="font-body text-[17px] leading-[1.7] max-w-[560px] text-[var(--muted)]">
            {t('contact_subheading')}
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="max-w-[1160px] mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12">
            {/* Contact form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-5" aria-label="Contact form">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="contact-name" className="block font-mono text-[10px] tracking-[0.12em] uppercase mb-2 text-[var(--subtle)]">{t('contact_name')}</label>
                  <input
                    id="contact-name"
                    type="text"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className={INPUT_CLASS}
                    required
                    disabled={isSubmitting}
                    aria-describedby={responseMsg ? 'contact-status' : undefined}
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" className="block font-mono text-[10px] tracking-[0.12em] uppercase mb-2 text-[var(--subtle)]">{t('contact_email')}</label>
                  <input
                    id="contact-email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className={INPUT_CLASS}
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="contact-subject" className="block font-mono text-[10px] tracking-[0.12em] uppercase mb-2 text-[var(--subtle)]">{t('contact_subject')}</label>
                <input
                  id="contact-subject"
                  type="text"
                  placeholder="What's this about?"
                  value={formData.subject}
                  onChange={e => setFormData({ ...formData, subject: e.target.value })}
                  className={INPUT_CLASS}
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label htmlFor="contact-message" className="block font-mono text-[10px] tracking-[0.12em] uppercase mb-2 text-[var(--subtle)]">{t('contact_message')}</label>
                <textarea
                  id="contact-message"
                  rows={6}
                  placeholder="Tell me about your project, question, or idea..."
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  className={`${INPUT_CLASS} resize-y min-h-[160px]`}
                  required
                  disabled={isSubmitting}
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary inline-flex items-center gap-2 font-display text-[13px] font-semibold px-[22px] py-[12px] border-0 cursor-pointer self-start rounded-none transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                style={{
                  background: submitted ? 'var(--surface)' : 'var(--sungold)',
                  color: submitted ? 'var(--sungold)' : 'var(--void)',
                  border: submitted ? '1px solid rgba(232,160,32,0.3)' : 'none'
                }}
                aria-busy={isSubmitting}
              >
                {isSubmitting ? '…' : submitted ? '✓' : t('contact_send')} <Send size={14} />
              </button>
              {responseMsg && (
                <p id="contact-status" role="status" aria-live="polite" className={`font-mono text-[12px] ${isError ? 'text-red-400' : 'text-[var(--sungold)]'}`}>
                  {responseMsg}
                </p>
              )}
            </form>

            {/* Right column: Availability, Social grid, Email, Location, WhatsApp quick link */}
            <div className="flex flex-col gap-5">
              {/* Availability status */}
              <div className="p-5 flex items-center gap-3 bg-[var(--warm-glow)] border border-[rgba(232,160,32,0.2)]">
                <div className="w-2 h-2 bg-[var(--sungold)] shrink-0" style={{ boxShadow: '0 0 8px rgba(232,160,32,0.5)' }} />
                <span className="font-mono text-[11px] tracking-[0.08em] text-[var(--sungold)]">
                  {data.availability || 'Available for projects'}
                </span>
              </div>

              {/* Social links grid */}
              <div>
                <span className="block font-mono text-[10px] tracking-[0.12em] uppercase mb-3 text-[var(--subtle)]">Social</span>
                <div className="grid grid-cols-2 gap-3">
                  {socialLinks.map((link, i) => (
                    <a
                      key={i}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-4 flex items-center gap-3 no-underline bg-[var(--surface)] border border-[var(--border)] transition-all duration-200 hover:border-[rgba(232,160,32,0.25)] hover:bg-[var(--elevated)]"
                    >
                      <link.icon size={18} className="text-[var(--sungold)] shrink-0" />
                      <span className="font-mono text-[11px] text-[var(--muted)]">{link.label}</span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Email */}
              <div className="p-5 bg-[var(--surface)] border border-[var(--border)]">
                <div className="flex items-center gap-2 mb-2">
                  <Mail size={16} className="text-[var(--sungold)]" />
                  <span className="font-mono text-[10px] tracking-[0.12em] uppercase text-[var(--subtle)]">Email</span>
                </div>
                <a href={`mailto:${data.email}`} className="font-body text-[14px] text-[var(--white)] no-underline hover:text-[var(--sungold)] transition-colors">
                  {data.email}
                </a>
              </div>

              {/* Location */}
              <div className="p-5 bg-[var(--surface)] border border-[var(--border)]">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin size={16} className="text-[var(--stardust)]" />
                  <span className="font-mono text-[10px] tracking-[0.12em] uppercase text-[var(--subtle)]">Location</span>
                </div>
                <p className="font-body text-[14px] text-[var(--white)]">{data.location}</p>
              </div>

              {/* WhatsApp quick link */}
              <a
                href={social.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary flex items-center justify-center gap-2 font-display text-[13px] font-semibold px-5 py-4 no-underline bg-[var(--sungold)] text-[var(--void)] border-0 rounded-none transition-all duration-200 hover:shadow-[var(--shadow-sharp-gold)]"
              >
                <MessageSquare size={18} /> WhatsApp quick link
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactPage;
