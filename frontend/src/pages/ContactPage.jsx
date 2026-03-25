import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, MessageSquare, MapPin, Mail, Github, Twitter, Linkedin } from 'lucide-react';
import { submitContact, fetchPersonalInfo } from '../services/api';
import { usePageMeta } from '../hooks/usePageMeta';
import { DEFAULT_OG_IMAGE_PATH } from '../lib/siteConfig';
import { useRealtimeQuery } from '../hooks/useRealtimeQuery';
import { useLocale } from '../contexts/LocaleContext';
import SectionKicker from '../components/portfolio/SectionKicker';
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
    image: DEFAULT_OG_IMAGE_PATH,
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
      <section className="relative pt-12 pb-8 md:pt-24 md:pb-16 border-b border-[var(--border)] overflow-hidden">
        {/* Nebula Glow Backdrop */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[70%] bg-[var(--nebula)] opacity-[0.05] blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[35%] h-[55%] bg-[var(--sungold)] opacity-[0.02] blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-[1160px] mx-auto px-4 md:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <SectionKicker label={t('contact_kicker')} accent="sungold" />
            <h1 className="font-display font-extrabold leading-[1.05] tracking-[-0.03em] mb-6 text-[var(--white)] max-w-[800px]" style={{ fontSize: 'clamp(40px, 8vw, 80px)' }}>
              {t('contact_heading')}
            </h1>
            <p className="font-body text-[17px] leading-[1.7] max-w-[600px] text-[var(--muted)]">
              {t('contact_subheading')}
            </p>
          </motion.div>
        </div>

        {/* Technical Scanline effect */}
        <motion.div 
          initial={{ top: '-10%' }}
          animate={{ top: '110%' }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          className="absolute left-0 w-full h-px bg-gradient-to-r from-transparent via-[var(--sungold)]/10 to-transparent pointer-events-none z-0"
        />
      </section>

      <section className="py-12 md:py-16 relative overflow-hidden">
        {/* Subtle grid accent */}
        <div className="absolute inset-0 opacity-[0.08] pointer-events-none" 
             style={{ backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)', backgroundSize: '80px 80px' }} />

        <div className="max-w-[1160px] mx-auto px-4 md:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12">
            {/* Contact form */}
            <motion.form
              onSubmit={handleSubmit}
              className="flex flex-col gap-5"
              aria-label="Contact form"
              initial="hidden"
              animate="visible"
              variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.2 } } }}
            >
              <motion.div variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }} className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
              </motion.div>
              <motion.div variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}>
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
              </motion.div>
              <motion.div variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}>
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
              </motion.div>
              <motion.div variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
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
                </motion.button>
              </motion.div>
              {responseMsg && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  id="contact-status"
                  role="status"
                  aria-live="polite"
                  className={`font-mono text-[12px] ${isError ? 'text-red-400' : 'text-[var(--sungold)]'}`}
                >
                  {responseMsg}
                </motion.p>
              )}
            </motion.form>

            {/* Right column: Availability, Social grid, Email, Location, WhatsApp quick link */}
            <motion.div
              className="flex flex-col gap-5"
              initial="hidden"
              animate="visible"
              variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.3 } } }}
            >
              {/* Availability status */}
              <motion.div
                variants={{ hidden: { opacity: 0, x: 20 }, visible: { opacity: 1, x: 0 } }}
                className="p-5 flex items-center gap-3 bg-[var(--warm-glow)] border border-[rgba(232,160,32,0.2)] relative group"
              >
                <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-[var(--sungold)] opacity-40" />
                <div className="w-2 h-2 bg-[var(--sungold)] shrink-0 animate-pulse" style={{ boxShadow: '0 0 8px rgba(232,160,32,0.5)' }} />
                <span className="font-mono text-[11px] tracking-[0.08em] text-[var(--sungold)]">
                  {data.availability || 'Available for projects'}
                </span>
              </motion.div>

              {/* Social links grid */}
              <motion.div variants={{ hidden: { opacity: 0, x: 20 }, visible: { opacity: 1, x: 0 } }}>
                <span className="block font-mono text-[10px] tracking-[0.12em] uppercase mb-3 text-[var(--subtle)]">Social</span>
                <div className="grid grid-cols-2 gap-3">
                  {socialLinks.map((link, i) => (
                    <motion.a
                      key={i}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.02 }}
                      className="p-4 flex items-center gap-3 no-underline bg-[var(--surface)] border border-[var(--border)] transition-all duration-200 hover:border-[rgba(232,160,32,0.25)] hover:bg-[var(--elevated)] relative group/social"
                    >
                      {/* Corner accent on hover */}
                      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[var(--sungold)] opacity-0 group-hover/social:opacity-60 transition-opacity duration-300" />
                      <link.icon size={18} className="text-[var(--sungold)] shrink-0" />
                      <span className="font-mono text-[11px] text-[var(--muted)] group-hover/social:text-[var(--white)] transition-colors">{link.label}</span>
                    </motion.a>
                  ))}
                </div>
              </motion.div>

              {/* Email */}
              <motion.div
                variants={{ hidden: { opacity: 0, x: 20 }, visible: { opacity: 1, x: 0 } }}
                className="p-5 bg-[var(--surface)] border border-[var(--border)] relative group hover:border-[var(--border-md)] transition-colors"
              >
                <div className="absolute -top-px -left-px w-3 h-3 border-t border-l border-[var(--sungold)] opacity-40" />
                <div className="flex items-center gap-2 mb-2">
                  <Mail size={16} className="text-[var(--sungold)]" />
                  <span className="font-mono text-[10px] tracking-[0.12em] uppercase text-[var(--subtle)]">Email</span>
                </div>
                <a href={`mailto:${data.email}`} className="font-body text-[14px] text-[var(--white)] no-underline hover:text-[var(--sungold)] transition-colors">
                  {data.email}
                </a>
              </motion.div>

              {/* Location */}
              <motion.div
                variants={{ hidden: { opacity: 0, x: 20 }, visible: { opacity: 1, x: 0 } }}
                className="p-5 bg-[var(--surface)] border border-[var(--border)] relative group hover:border-[var(--border-md)] transition-colors"
              >
                <div className="absolute -top-px -left-px w-3 h-3 border-t border-l border-[var(--stardust)] opacity-40" />
                <div className="flex items-center gap-2 mb-2">
                  <MapPin size={16} className="text-[var(--stardust)]" />
                  <span className="font-mono text-[10px] tracking-[0.12em] uppercase text-[var(--subtle)]">Location</span>
                </div>
                <p className="font-body text-[14px] text-[var(--white)]">{data.location}</p>
              </motion.div>

              {/* WhatsApp quick link */}
              <motion.a
                variants={{ hidden: { opacity: 0, x: 20 }, visible: { opacity: 1, x: 0 } }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href={social.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary flex items-center justify-center gap-2 font-display text-[13px] font-semibold px-5 py-4 no-underline bg-[var(--sungold)] text-[var(--void)] border-0 rounded-none transition-all duration-200 hover:shadow-[var(--shadow-sharp-gold)]"
              >
                <MessageSquare size={18} /> WhatsApp quick link
              </motion.a>
            </motion.div>
          </div>
        </div>
      </section>
    </>

  );
};

export default ContactPage;
