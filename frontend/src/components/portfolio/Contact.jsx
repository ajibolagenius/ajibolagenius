import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageSquare, MapPin, Mail } from 'lucide-react';
import { submitContact, fetchPersonalInfo } from '../../services/api';
import { getPersonalInfoQueryFallback } from '../../lib/personalInfoFallbacks';
import { useRealtimeQuery } from '../../hooks/useRealtimeQuery';

const fbInfo = getPersonalInfoQueryFallback();

const Contact = () => {
  const [visible, setVisible] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [responseMsg, setResponseMsg] = useState('');
  const sectionRef = useRef(null);
  const { data: info } = useRealtimeQuery('personal_info', fetchPersonalInfo, fbInfo);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await submitContact({ ...formData, subject: '' });
      setResponseMsg(res.message);
      setSubmitted(true);
      setTimeout(() => { setSubmitted(false); setResponseMsg(''); setFormData({ name: '', email: '', message: '' }); }, 3000);
    } catch {
      setResponseMsg('Something went wrong. Please try again.');
      setTimeout(() => setResponseMsg(''), 3000);
    }
  };

  const inputStyle = { width: '100%', background: 'var(--elevated)', border: '1px solid var(--border-md)', borderRadius: 0, padding: '10px 14px', color: 'var(--white)', fontFamily: 'var(--font-body)', fontSize: '14px', outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s' };
  const handleFocus = (e) => { e.target.style.borderColor = 'var(--sungold)'; e.target.style.boxShadow = 'var(--shadow-sharp-ring)'; };
  const handleBlur = (e) => { e.target.style.borderColor = 'var(--border-md)'; e.target.style.boxShadow = 'none'; };

  const social = (info || fbInfo).social || fbInfo.social;

  return (
    <section id="contact" ref={sectionRef} className="py-12 md:py-20">
      <div className="max-w-[1160px] mx-auto px-4 md:px-8 pt-12 md:pt-20">
        <div className="transition-all duration-700" style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(24px)' }}>
          <div className="flex items-center gap-2 mb-3"><div className="w-5 h-px bg-[var(--sungold)]" /><span className="font-mono text-[11px] tracking-[0.2em] uppercase text-[var(--sungold)]">05 — Contact</span></div>
          <h2 className="font-display font-extrabold leading-[1.1] tracking-[-0.02em] mb-3 text-[var(--white)]" style={{ fontSize: 'clamp(28px, 4vw, 42px)' }}>Let's Build Something</h2>
          <p className="font-body text-[15px] leading-[1.7] mb-10 max-w-[520px] text-[var(--muted)]">Got a project in mind, want to enrol in a course, or just want to connect? Reach out.</p>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-10">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="block font-mono text-[10px] tracking-[0.12em] uppercase mb-2 text-[var(--subtle)]">Name</label><input type="text" placeholder="Your name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} required /></div>
                <div><label className="block font-mono text-[10px] tracking-[0.12em] uppercase mb-2 text-[var(--subtle)]">Email</label><input type="email" placeholder="your@email.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} required /></div>
              </div>
              <div><label className="block font-mono text-[10px] tracking-[0.12em] uppercase mb-2 text-[var(--subtle)]">Message</label><textarea rows={5} placeholder="Tell me about your project or what you need..." value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} style={{...inputStyle, resize: 'vertical', minHeight: '120px'}} onFocus={handleFocus} onBlur={handleBlur} required /></div>
              <button type="submit" className="btn-primary inline-flex items-center gap-2 font-display text-[13px] font-semibold px-[22px] py-[11px] border-none cursor-pointer transition-all duration-200 self-start rounded-none bg-[var(--sungold)] text-[var(--void)]" style={{ background: submitted ? 'var(--surface)' : undefined, color: submitted ? 'var(--sungold)' : undefined, border: submitted ? '1px solid rgba(232,160,32,0.3)' : undefined }}>
                {submitted ? 'Message Sent!' : 'Send Message'} <Send size={14} />
              </button>
              {responseMsg && <p className="font-mono text-[12px] text-[var(--sungold)]">{responseMsg}</p>}
            </form>
            <div className="flex flex-col gap-4">
              <div className="p-5 bg-[var(--surface)] border border-[var(--border)] rounded-none">
                <div className="flex items-center gap-3 mb-3"><Mail size={16} className="text-[var(--sungold)]" /><span className="font-mono text-[11px] tracking-[0.1em] uppercase text-[var(--subtle)]">Email</span></div>
                <a href={`mailto:${info.email}`} className="font-body text-[14px] no-underline text-[var(--white)] hover:text-[var(--sungold)]">{info.email}</a>
              </div>
              <div className="p-5 bg-[var(--surface)] border border-[var(--border)] rounded-none">
                <div className="flex items-center gap-3 mb-3"><MapPin size={16} className="text-[var(--stardust)]" /><span className="font-mono text-[11px] tracking-[0.1em] uppercase text-[var(--subtle)]">Location</span></div>
                <p className="font-body text-[14px] text-[var(--white)]">{info.location}</p>
              </div>
              <div className="p-5 bg-[var(--surface)] border border-[var(--border)] rounded-none">
                <div className="flex items-center gap-3 mb-3"><MessageSquare size={16} className="text-[var(--violet)]" /><span className="font-mono text-[11px] tracking-[0.1em] uppercase text-[var(--subtle)]">WhatsApp</span></div>
                <a href={social.whatsapp} target="_blank" rel="noopener noreferrer" className="font-body text-[14px] no-underline text-[var(--white)] hover:text-[var(--sungold)]">Quick message →</a>
              </div>
              <div className="p-4 flex items-center gap-3 bg-[var(--warm-glow)] border border-[rgba(232,160,32,0.2)] rounded-none">
                <div className="w-2 h-2 bg-[var(--sungold)] rounded-none shadow-[0_0_8px_rgba(232,160,32,0.5)]" />
                <span className="font-mono text-[11px] tracking-[0.08em] text-[var(--sungold)]">{info.availability}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
