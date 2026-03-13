import React, { useState, useEffect } from 'react';
import { Send, MessageSquare, MapPin, Mail, Github, Twitter, Linkedin } from 'lucide-react';
import { submitContact, fetchPersonalInfo } from '../services/api';
import { personalInfo as fbInfo } from '../data/mock';
import { KenteDivider } from '../components/portfolio/About';

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [responseMsg, setResponseMsg] = useState('');
  const [info, setInfo] = useState(fbInfo);

  useEffect(() => {
    fetchPersonalInfo().then(data => setInfo(data)).catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await submitContact(formData);
      setResponseMsg(res.message);
      setSubmitted(true);
      setTimeout(() => { setSubmitted(false); setResponseMsg(''); setFormData({ name: '', email: '', subject: '', message: '' }); }, 3000);
    } catch {
      setResponseMsg('Something went wrong. Please try again.');
      setTimeout(() => setResponseMsg(''), 3000);
    }
  };

  const inputStyle = { width: '100%', background: '#17172E', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 0, padding: '12px 14px', color: '#F2EFE8', fontFamily: "'DM Sans', sans-serif", fontSize: '14px', outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s' };
  const handleFocus = (e) => { e.target.style.borderColor = '#E8A020'; e.target.style.boxShadow = '0 0 0 3px rgba(232,160,32,0.1)'; };
  const handleBlur = (e) => { e.target.style.borderColor = 'rgba(255,255,255,0.12)'; e.target.style.boxShadow = 'none'; };

  const social = info.social || fbInfo.social;
  const socialLinks = [
    { icon: Github, label: 'GitHub', href: social.github, color: '#F2EFE8' },
    { icon: Twitter, label: 'Twitter / X', href: social.twitter, color: '#1CB8D4' },
    { icon: Linkedin, label: 'LinkedIn', href: social.linkedin, color: '#5B4FD8' },
    { icon: MessageSquare, label: 'WhatsApp', href: social.whatsapp, color: '#E8A020' }
  ];

  return (
    <>
      <section className="pt-20 pb-10" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-[1160px] mx-auto px-8">
          <div className="flex items-center gap-2 mb-3"><div className="w-6 h-[1px]" style={{ background: '#E8A020' }} /><span className="font-mono text-[11px] tracking-[0.2em] uppercase" style={{ color: '#E8A020' }}>Contact</span></div>
          <h1 className="font-display font-extrabold leading-[1.05] tracking-[-0.03em] mb-4" style={{ fontSize: 'clamp(36px, 6vw, 64px)' }}>Let's Build Something</h1>
          <p className="font-body text-[17px] leading-[1.7] max-w-[560px]" style={{ color: 'rgba(242,239,232,0.55)' }}>Got a project in mind, want to enrol in a course, or just want to connect? I'd love to hear from you.</p>
        </div>
      </section>
      <KenteDivider />
      <section className="py-16">
        <div className="max-w-[1160px] mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12">
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div><label className="block font-mono text-[10px] tracking-[0.12em] uppercase mb-2" style={{ color: 'rgba(242,239,232,0.3)' }}>Name</label><input type="text" placeholder="Your name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} required /></div>
                <div><label className="block font-mono text-[10px] tracking-[0.12em] uppercase mb-2" style={{ color: 'rgba(242,239,232,0.3)' }}>Email</label><input type="email" placeholder="your@email.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} required /></div>
              </div>
              <div><label className="block font-mono text-[10px] tracking-[0.12em] uppercase mb-2" style={{ color: 'rgba(242,239,232,0.3)' }}>Subject</label><input type="text" placeholder="What's this about?" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} required /></div>
              <div><label className="block font-mono text-[10px] tracking-[0.12em] uppercase mb-2" style={{ color: 'rgba(242,239,232,0.3)' }}>Message</label><textarea rows={7} placeholder="Tell me about your project, question, or idea..." value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} style={{...inputStyle, resize: 'vertical', minHeight: '160px'}} onFocus={handleFocus} onBlur={handleBlur} required /></div>
              <button type="submit" className="inline-flex items-center gap-2 font-display text-[13px] font-semibold px-[22px] py-[12px] border-none cursor-pointer transition-all duration-200 self-start" style={{ background: submitted ? '#111126' : '#E8A020', color: submitted ? '#E8A020' : '#07070F', borderRadius: 0, border: submitted ? '1px solid rgba(232,160,32,0.3)' : 'none' }}>
                {submitted ? 'Message Sent!' : 'Send Message'} <Send size={14} />
              </button>
              {responseMsg && <p className="font-mono text-[12px]" style={{ color: '#E8A020' }}>{responseMsg}</p>}
            </form>
            <div className="flex flex-col gap-4">
              <div className="p-5" style={{ background: '#111126', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 0 }}>
                <div className="flex items-center gap-3 mb-3"><Mail size={16} style={{ color: '#E8A020' }} /><span className="font-mono text-[11px] tracking-[0.1em] uppercase" style={{ color: 'rgba(242,239,232,0.3)' }}>Email</span></div>
                <a href={`mailto:${info.email}`} className="font-body text-[14px] no-underline hover:text-[#E8A020]" style={{ color: '#F2EFE8' }}>{info.email}</a>
              </div>
              <div className="p-5" style={{ background: '#111126', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 0 }}>
                <div className="flex items-center gap-3 mb-3"><MapPin size={16} style={{ color: '#1CB8D4' }} /><span className="font-mono text-[11px] tracking-[0.1em] uppercase" style={{ color: 'rgba(242,239,232,0.3)' }}>Location</span></div>
                <p className="font-body text-[14px]" style={{ color: '#F2EFE8' }}>{info.location}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {socialLinks.map((link, i) => (
                  <a key={i} href={link.href} target="_blank" rel="noopener noreferrer" className="p-4 flex items-center gap-3 no-underline transition-all duration-200 hover:bg-[#17172E]" style={{ background: '#111126', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 0 }}>
                    <link.icon size={16} style={{ color: link.color }} /><span className="font-mono text-[11px]" style={{ color: 'rgba(242,239,232,0.55)' }}>{link.label}</span>
                  </a>
                ))}
              </div>
              <div className="p-4 flex items-center gap-3" style={{ background: 'rgba(232,160,32,0.08)', border: '1px solid rgba(232,160,32,0.2)', borderRadius: 0 }}>
                <div className="w-2 h-2" style={{ background: '#E8A020', borderRadius: 0, boxShadow: '0 0 8px rgba(232,160,32,0.5)' }} />
                <span className="font-mono text-[11px] tracking-[0.08em]" style={{ color: '#E8A020' }}>{info.availability}</span>
              </div>
              <a href={social.whatsapp} target="_blank" rel="noopener noreferrer" className="p-4 flex items-center justify-center gap-2 no-underline" style={{ background: '#5B4FD8', borderRadius: 0 }}>
                <MessageSquare size={14} style={{ color: '#F2EFE8' }} /><span className="font-display text-[13px] font-semibold" style={{ color: '#F2EFE8' }}>Quick WhatsApp Message</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactPage;
