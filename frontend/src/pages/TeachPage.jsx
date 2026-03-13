import React, { useState, useEffect } from 'react';
import { ExternalLink, ChevronDown, ChevronUp, MessageSquare, Quote } from 'lucide-react';
import { fetchCourses, fetchTestimonials, fetchPersonalInfo } from '../services/api';
import { courses as fbCourses, testimonials as fbTestimonials, faqItems, personalInfo as fbInfo } from '../data/mock';
import { KenteDivider } from '../components/portfolio/About';

const CourseCard = ({ course, whatsapp }) => {
  const [hovered, setHovered] = useState(false);
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="transition-all duration-200" style={{ background: hovered ? '#17172E' : '#111126', border: '1px solid rgba(255,255,255,0.06)', borderLeft: '3px solid #E8A020', borderRadius: 0, overflow: 'hidden' }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <div className="p-5 grid grid-cols-[1fr_auto] items-center gap-4 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div>
          <span className="font-mono text-[10px] font-bold tracking-[0.1em] uppercase px-[10px] py-[4px] inline-block mb-1" style={{ background: 'rgba(232,160,32,0.15)', color: '#E8A020', border: '1px solid rgba(232,160,32,0.3)', borderRadius: 0 }}>{course.badge}</span>
          <h3 className="font-display text-[16px] font-semibold mb-1" style={{ color: '#F2EFE8' }}>{course.name}</h3>
          <p className="font-mono text-[11px]" style={{ color: 'rgba(242,239,232,0.55)' }}>{course.duration}</p>
          <p className="font-body text-[13px] mt-2" style={{ color: 'rgba(242,239,232,0.4)' }}>{course.description}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className="font-display text-[22px] font-extrabold whitespace-nowrap" style={{ color: '#E8A020' }}>{course.price}</span>
          {expanded ? <ChevronUp size={16} style={{ color: '#E8A020' }} /> : <ChevronDown size={16} style={{ color: 'rgba(242,239,232,0.3)' }} />}
        </div>
      </div>
      {expanded && course.curriculum && (
        <div className="px-5 pb-5 pt-0" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="pt-4">
            <div className="font-mono text-[10px] tracking-[0.12em] uppercase mb-3" style={{ color: '#1CB8D4' }}>Curriculum</div>
            <ul className="list-none p-0 m-0 flex flex-col gap-2">
              {course.curriculum.map((item, i) => (
                <li key={i} className="flex items-center gap-2 font-body text-[13px]" style={{ color: 'rgba(242,239,232,0.55)' }}>
                  <span className="w-1.5 h-1.5 flex-shrink-0" style={{ background: '#E8A020', borderRadius: 0 }} />{item}
                </li>
              ))}
            </ul>
            <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-display text-[12px] font-semibold px-4 py-2 mt-4 no-underline" style={{ background: '#E8A020', color: '#07070F', borderRadius: 0 }}>
              <MessageSquare size={12} /> Enrol via WhatsApp
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

const FaqItem = ({ item }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="cursor-pointer transition-all duration-200" style={{ background: open ? '#17172E' : '#111126', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 0 }} onClick={() => setOpen(!open)}>
      <div className="p-5 flex items-center justify-between gap-4">
        <h4 className="font-display text-[14px] font-semibold" style={{ color: '#F2EFE8' }}>{item.question}</h4>
        {open ? <ChevronUp size={16} style={{ color: '#E8A020', flexShrink: 0 }} /> : <ChevronDown size={16} style={{ color: 'rgba(242,239,232,0.3)', flexShrink: 0 }} />}
      </div>
      {open && <div className="px-5 pb-5"><p className="font-body text-[13px] leading-[1.7]" style={{ color: 'rgba(242,239,232,0.55)' }}>{item.answer}</p></div>}
    </div>
  );
};

const TeachPage = () => {
  const [courses, setCourses] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [whatsapp, setWhatsapp] = useState('#');

  useEffect(() => {
    fetchCourses().then(setCourses).catch(() => setCourses(fbCourses));
    fetchTestimonials().then(setTestimonials).catch(() => setTestimonials(fbTestimonials));
    fetchPersonalInfo().then(info => setWhatsapp(info.social?.whatsapp || fbInfo.social.whatsapp)).catch(() => setWhatsapp(fbInfo.social.whatsapp));
  }, []);

  return (
    <>
      <section className="pt-20 pb-10" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-[1160px] mx-auto px-8">
          <div className="flex items-center gap-2 mb-3"><div className="w-6 h-[1px]" style={{ background: '#E8A020' }} /><span className="font-mono text-[11px] tracking-[0.2em] uppercase" style={{ color: '#E8A020' }}>Teach</span></div>
          <h1 className="font-display font-extrabold leading-[1.05] tracking-[-0.03em] mb-4" style={{ fontSize: 'clamp(36px, 6vw, 64px)' }}>Courses & Mentorship</h1>
          <p className="font-body text-[17px] leading-[1.7] max-w-[560px] mb-6" style={{ color: 'rgba(242,239,232,0.55)' }}>I teach what I know and share what I learn. Remote courses designed for the Nigerian developer ready to level up.</p>
          <p className="font-mono text-[11px] tracking-[0.08em]" style={{ color: 'rgba(242,239,232,0.3)' }}>// {courses.length} courses · 200+ students · Remote delivery</p>
        </div>
      </section>
      <KenteDivider />
      <section className="py-16">
        <div className="max-w-[1160px] mx-auto px-8">
          <div className="flex items-center gap-2 mb-8"><div className="w-6 h-[1px]" style={{ background: '#1CB8D4' }} /><span className="font-mono text-[11px] tracking-[0.2em] uppercase" style={{ color: '#1CB8D4' }}>All Courses</span></div>
          <div className="grid grid-cols-1 gap-4">{courses.map((c) => <CourseCard key={c.slug || c.id} course={c} whatsapp={whatsapp} />)}</div>
        </div>
      </section>
      <section className="py-16" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-[1160px] mx-auto px-8">
          <div className="flex items-center gap-2 mb-8"><div className="w-6 h-[1px]" style={{ background: '#8B72F0' }} /><span className="font-mono text-[11px] tracking-[0.2em] uppercase" style={{ color: '#8B72F0' }}>What Students Say</span></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="p-6" style={{ background: '#111126', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 0 }}>
                <Quote size={20} className="mb-4" style={{ color: 'rgba(232,160,32,0.3)' }} />
                <p className="font-body text-[13px] leading-[1.7] mb-5" style={{ color: 'rgba(242,239,232,0.55)' }}>"{t.text}"</p>
                <div><div className="font-display text-[13px] font-semibold" style={{ color: '#F2EFE8' }}>{t.name}</div><div className="font-mono text-[10px]" style={{ color: '#E8A020' }}>{t.role}</div></div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-16" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-[1160px] mx-auto px-8">
          <div className="flex items-center gap-2 mb-3"><div className="w-6 h-[1px]" style={{ background: '#E8A020' }} /><span className="font-mono text-[11px] tracking-[0.2em] uppercase" style={{ color: '#E8A020' }}>FAQ</span></div>
          <h2 className="font-display font-extrabold leading-[1.1] tracking-[-0.02em] mb-8" style={{ fontSize: 'clamp(24px, 3vw, 36px)' }}>Frequently Asked Questions</h2>
          <div className="max-w-[720px] flex flex-col gap-3">{faqItems.map((item, i) => <FaqItem key={i} item={item} />)}</div>
        </div>
      </section>
    </>
  );
};

export default TeachPage;
