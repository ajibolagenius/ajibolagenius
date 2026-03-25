import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Quote, ChevronDown, ChevronUp, Bell } from 'lucide-react';
import { fetchCourses, fetchTestimonials, fetchPersonalInfo, submitCourseWaitlist } from '../services/api';
import { faqItems } from '../data/mock';
import Badge from '../components/portfolio/Badge';
import SectionKicker from '../components/portfolio/SectionKicker';
import SortSelect from '../components/portfolio/SortSelect';
import { usePageMeta } from '../hooks/usePageMeta';
import { DEFAULT_OG_IMAGE_PATH } from '../lib/siteConfig';
import { useRealtimeQuery } from '../hooks/useRealtimeQuery';
import { useLocale } from '../contexts/LocaleContext';
import { buildTeachPageSchema } from '../lib/structuredData';
import { byString, byPrice, applySort } from '../lib/sortHelpers';
import { paginate } from '../lib/paginate';
import ListPagination from '../components/portfolio/ListPagination';

/** Badge variant and accent color per index — same length so badge and border/button stay aligned (warm/cool alternating). */
const COURSE_ACCENTS = [
  { badge: 'gold', color: 'var(--sungold)' },
  { badge: 'cosmic', color: 'var(--nebula)' },
  { badge: 'cyan', color: 'var(--stardust)' },
  { badge: 'terra', color: 'var(--terracotta)' }
];

const TEACH_SORT_OPTIONS = [
  { value: 'default', label: 'Open first, then name' },
  { value: 'name-asc', label: 'Name A–Z' },
  { value: 'name-desc', label: 'Name Z–A' },
  { value: 'price-asc', label: 'Price low–high' },
  { value: 'price-desc', label: 'Price high–low' },
];

const CourseCard = ({ course, whatsapp, index = 0 }) => {
  const [hovered, setHovered] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const { t } = useLocale();
  const isOpen = course.open_for_enrolment === true;
  const accent = COURSE_ACCENTS[index % COURSE_ACCENTS.length];
  const accentColor = accent.color;

  return (
    <div
      className={`transition-all duration-300 overflow-hidden border cursor-pointer relative group ${isOpen ? 'border-[var(--border)]' : 'border-[var(--border)] opacity-75'}`}
      style={{
        background: hovered ? 'var(--elevated)' : 'var(--surface)',
        borderLeft: `2px solid ${isOpen ? accentColor : 'var(--border-md)'}`,
        boxShadow: hovered ? `0 10px 30px -10px ${accentColor}20` : 'none'
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Technical corner accent */}
      {hovered && isOpen && (
        <div 
          className="absolute top-0 right-0 w-2 h-2 border-t border-r transition-opacity duration-300"
          style={{ borderColor: accentColor }}
        />
      )}
      <div
        className={`p-5 grid grid-cols-[1fr_auto] items-center gap-4 ${!isOpen ? 'text-[var(--muted)]' : ''}`}
        onClick={() => setExpanded(!expanded)}
      >
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <Badge variant={accent.badge} className={!isOpen ? 'opacity-80' : ''}>
              {course.badge}
            </Badge>
            <span
              className={`font-mono text-[10px] tracking-[0.1em] uppercase px-2 py-0.5 border ${isOpen ? 'text-[var(--sungold)] border-[var(--sungold)]/50 bg-[var(--sungold)]/10' : 'text-[var(--subtle)] border-[var(--border-md)] bg-[var(--elevated)]'}`}
              aria-label={isOpen ? 'Open for enrolment' : 'Currently closed'}
            >
              {isOpen ? 'Open' : 'Closed'}
            </span>
          </div>
          <h3 className={`font-display text-[15px] font-semibold mb-1 ${isOpen ? 'text-[var(--white)]' : 'text-[var(--muted)]'}`}>
            {course.name}
          </h3>
          <p className="font-mono text-[11px] text-[var(--muted)]">{course.duration}</p>
          <p className={`font-body text-[13px] mt-2 ${isOpen ? 'text-[var(--subtle)]' : 'text-[var(--dim)]'}`}>{course.description}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span
            className={`font-display text-[22px] font-extrabold whitespace-nowrap tracking-tight transition-transform duration-300 ${hovered ? 'scale-105' : ''} ${isOpen ? '' : 'text-[var(--muted)]'}`}
            style={isOpen ? { color: accentColor } : undefined}
          >
            {course.price}
          </span>
          {expanded ? <ChevronUp size={16} className="text-[var(--sungold)]" /> : <ChevronDown size={16} className="text-[var(--subtle)] group-hover:text-[var(--white)]" />}
        </div>
      </div>
      {expanded && course.curriculum && (
        <div className="px-5 pb-5 pt-0 border-t border-[var(--border)]">
          <div className="pt-4">
            <div className="font-mono text-[10px] tracking-[0.12em] uppercase mb-3 text-[var(--stardust)]">
              {t('teach_curriculum')}
            </div>
            <ul className="list-none p-0 m-0 flex flex-col gap-2">
              {course.curriculum.map((item, i) => (
                <li key={i} className="flex items-center gap-2 font-body text-[13px] text-[var(--muted)]">
                  <span className="w-1.5 h-1.5 flex-shrink-0 bg-[var(--sungold)]" />
                  {item}
                </li>
              ))}
            </ul>
            {isOpen ? (
              <a
                href={whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex items-center gap-2 font-display text-[12px] font-semibold px-4 py-2 mt-4 no-underline border-0 rounded-none"
                style={{ background: accentColor, color: accentColor === 'var(--sungold)' ? 'var(--void)' : 'var(--white)' }}
              >
                <MessageSquare size={12} /> {t('teach_enrol_via_whatsapp')}
              </a>
            ) : (
              <p className="font-mono text-[11px] text-[var(--subtle)] mt-4">{t('teach_join_waitlist_hint')}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const FaqItem = ({ item, open, onToggle, index }) => {
  const idBase = `faq-${index}`;
  return (
    <div
      className="transition-all duration-300 border border-[var(--border)] overflow-hidden"
      style={{ background: open ? 'var(--elevated)' : 'var(--surface)' }}
    >
      <button
        type="button"
        className="w-full p-6 flex items-center justify-between gap-6 text-left cursor-pointer border-0 bg-transparent font-display text-[15px] font-bold text-[var(--white)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-[var(--sungold)] group"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={`${idBase}-answer`}
        id={`${idBase}-question`}
      >
        <div className="flex items-center gap-4">
          <span className="font-mono text-[10px] text-[var(--sungold)] opacity-50">0{index + 1}</span>
          <span className="font-display text-[15px] font-bold group-hover:text-[var(--sungold)] transition-colors">{item.question}</span>
        </div>
        <div className={`p-1 border border-[var(--border-md)] transition-all duration-300 ${open ? 'bg-[var(--sungold)] border-[var(--sungold)]' : 'bg-transparent'}`}>
          {open ? (
            <ChevronUp size={14} className="text-[var(--void)] flex-shrink-0" aria-hidden />
          ) : (
            <ChevronDown size={14} className="text-[var(--subtle)] group-hover:text-[var(--white)] flex-shrink-0" aria-hidden />
          )}
        </div>
      </button>
      {open && (
        <div id={`${idBase}-answer`} className="px-16 pb-6" role="region" aria-labelledby={`${idBase}-question`}>
          <div className="w-full h-px bg-[var(--border-md)] mb-5 opacity-40" />
          <p className="font-body text-[14px] leading-[1.8] text-[var(--muted)]">{item.answer}</p>
        </div>
      )}
    </div>
  );
};

const TeachPage = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const { t } = useLocale();
  const { data: courses, loading: l1 } = useRealtimeQuery('courses', fetchCourses);
  const { data: testimonials, loading: l2 } = useRealtimeQuery('testimonials', fetchTestimonials);
  const { data: personalInfo, loading: l3 } = useRealtimeQuery('personal_info', fetchPersonalInfo);
  const displayCourses = Array.isArray(courses) && courses.length > 0 ? courses : [];
  const displayTestimonials = Array.isArray(testimonials) && testimonials.length > 0 ? testimonials : [];
  const whatsapp = personalInfo?.social?.whatsapp || '';

  const [sortBy, setSortBy] = useState('default');
  const [page, setPage] = useState(1);
  const sortedCourses = useMemo(() => {
    if (sortBy === 'default') {
      return applySort(displayCourses, (a, b) => {
        const aOpen = a.open_for_enrolment === true ? 1 : 0;
        const bOpen = b.open_for_enrolment === true ? 1 : 0;
        if (bOpen !== aOpen) return bOpen - aOpen;
        const byBadge = byString('badge', 'asc')(a, b);
        if (byBadge !== 0) return byBadge;
        return byString('name', 'asc')(a, b);
      });
    }
    const comp = sortBy === 'name-asc' ? byString('name', 'asc')
      : sortBy === 'name-desc' ? byString('name', 'desc')
      : sortBy === 'price-asc' ? byPrice('price', 'asc')
      : byPrice('price', 'desc');
    return applySort(displayCourses, comp);
  }, [displayCourses, sortBy]);

  const { items: paginatedCourses, totalPages, start, end, total } = useMemo(
    () => paginate(sortedCourses, page, 9),
    [sortedCourses, page]
  );

  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [waitlistCourse, setWaitlistCourse] = useState('');
  const [waitlistMsg, setWaitlistMsg] = useState('');
  const [waitlistSubmitting, setWaitlistSubmitting] = useState(false);
  const handleWaitlistSubmit = async (e) => {
    e.preventDefault();
    const email = waitlistEmail.trim();
    if (!email || waitlistSubmitting) return;
    setWaitlistSubmitting(true);
    setWaitlistMsg('');
    try {
      const res = await submitCourseWaitlist(email, waitlistCourse || null);
      setWaitlistMsg(res?.message || t('teach_on_list'));
      setWaitlistEmail('');
      setWaitlistCourse('');
    } catch {
      setWaitlistMsg('Something went wrong. Try again.');
    } finally {
      setWaitlistSubmitting(false);
    }
    setTimeout(() => setWaitlistMsg(''), 5000);
  };

  usePageMeta({
    title: 'Courses & Mentorship',
    description: 'I teach what I know and share what I learn. Remote courses designed for the Nigerian developer ready to level up.',
    image: DEFAULT_OG_IMAGE_PATH,
    structuredData: buildTeachPageSchema(displayCourses),
    canonical: '/teach',
  });

  return (
    <>
      {/* Teaching Philosophy Header */}
      <section className="relative pt-12 pb-8 md:pt-24 md:pb-16 border-b border-[var(--border)] overflow-hidden">
        {/* Nebula Glow Backdrop */}
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[60%] bg-[var(--nebula)] opacity-[0.08] blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[30%] h-[50%] bg-[var(--sungold)] opacity-[0.03] blur-[100px] rounded-full pointer-events-none" />
        
        <div className="max-w-[1160px] mx-auto px-4 md:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <SectionKicker label="Teach" accent="sungold" />
            <h1 className="font-display font-extrabold leading-[1.05] tracking-[-0.03em] mb-6 text-[var(--white)] max-w-[800px]" style={{ fontSize: 'clamp(40px, 8vw, 80px)' }}>
              {t('teach_heading')}
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-8 md:gap-16 items-start">
              <div>
                <p className="font-body text-[19px] leading-[1.6] mb-6 text-[var(--white)] font-medium">
                  {t('teach_subheading')}
                </p>
                <p className="font-body text-[17px] leading-[1.7] max-w-[600px] text-[var(--muted)]">
                  Start with <em>why</em>, not just <em>what</em>. Projects beat theory every time. Community is everything — the groups outlast the courses. Pricing is set for Nigerian reality, not Silicon Valley budgets.
                </p>
                <div className="flex flex-wrap items-center gap-6 mt-8">
                  <div className="flex flex-col">
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--stardust)] mb-1">Students</span>
                    <span className="font-display text-[20px] font-bold text-[var(--white)]">300+</span>
                  </div>
                  <div className="w-px h-8 bg-[var(--border)]" />
                  <div className="flex flex-col">
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--stardust)] mb-1">Format</span>
                    <span className="font-display text-[20px] font-bold text-[var(--white)]">Remote</span>
                  </div>
                  <div className="w-px h-8 bg-[var(--border)]" />
                  <div className="flex flex-col">
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--stardust)] mb-1">Impact</span>
                    <span className="font-display text-[20px] font-bold text-[var(--white)]">Global</span>
                  </div>
                </div>
              </div>
              <div className="bg-[var(--surface)] border border-[var(--border-md)] p-6 relative">
                <div className="absolute -top-px -left-px w-4 h-4 border-t border-l border-[var(--sungold)]" />
                <p className="font-mono text-[11px] leading-[1.6] text-[var(--subtle)] italic">
                  {'"The best way to learn is to build. The second best way is to teach what you just built."' || t('teach_sidebar_quote') }
                </p>
                <div className="mt-4 flex items-center gap-2">
                  <div className="w-4 h-px bg-[var(--sungold)]" />
                  <span className="font-mono text-[10px] uppercase text-[var(--sungold)]">Guiding Principle</span>
                </div>
              </div>
            </div>
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

      {/* Course grid (9 courses) */}
      <section className="py-12 md:py-16 border-b border-[var(--border)]">
        <div className="max-w-[1160px] mx-auto px-4 md:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-2">
              <div className="w-6 h-px bg-[var(--stardust)]" />
              <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-[var(--stardust)]">
                All Courses
              </span>
            </div>
            <SortSelect options={TEACH_SORT_OPTIONS} value={sortBy} onChange={(v) => { setSortBy(v); setPage(1); }} label="Sort" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedCourses.map((c, i) => (
              <CourseCard key={c.slug || c.id} course={c} whatsapp={whatsapp} index={start + i} />
            ))}
          </div>
          {sortedCourses.length > 0 && (
            <ListPagination
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
              range={{ start, end, total }}
            />
          )}
        </div>
      </section>

      {/* Enrol CTA → WhatsApp */}
      <section className="py-12 md:py-16 border-b border-[var(--border)]">
        <div className="max-w-[1160px] mx-auto px-4 md:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-6 h-px bg-[var(--sungold)]" />
            <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-[var(--sungold)]">
              Get Started
            </span>
          </div>
          <h2 className="font-display font-extrabold leading-[1.1] tracking-[-0.02em] mb-3 text-[var(--white)]" style={{ fontSize: 'clamp(24px, 3vw, 32px)' }}>
            Ready to enrol?
          </h2>
          <p className="font-body text-[15px] leading-[1.7] mb-8 max-w-[480px] mx-auto text-[var(--muted)]">
            Message me on WhatsApp and I’ll walk you through the process, answer questions, and get you started.
          </p>
          <a
            href={whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex items-center gap-2 font-display text-[13px] font-semibold tracking-[0.04em] px-[22px] py-[11px] no-underline bg-[var(--sungold)] text-[var(--void)] border-0 rounded-none"
          >
            <MessageSquare size={16} /> Enrol via WhatsApp
          </a>
        </div>
      </section>

      {/* Course waitlist */}
      <section className="py-12 md:py-16 border-b border-[var(--border)]">
        <div className="max-w-[1160px] mx-auto px-4 md:px-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-px bg-[var(--nebula)]" aria-hidden />
            <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-[var(--nebula)]">
              Notify me
            </span>
          </div>
          <h2 className="font-display font-extrabold leading-[1.1] tracking-[-0.02em] mb-3 text-[var(--white)]" style={{ fontSize: 'clamp(24px, 3vw, 32px)' }}>
            {t('teach_notify_heading')}
          </h2>
          <p className="font-body text-[15px] leading-[1.7] mb-6 max-w-[480px] text-[var(--muted)]">
            Leave your email and we&apos;ll let you know when the course you&apos;re interested in is open for enrolment.
          </p>
          <form onSubmit={handleWaitlistSubmit} className="flex flex-col sm:flex-row gap-0 max-w-[640px] border border-[var(--border-md)] p-1 bg-[var(--surface)]" aria-label="Course waitlist">
            <div className="flex-1 flex flex-col min-w-0">
              <input
                id="waitlist-email"
                type="email"
                placeholder={t('teach_notify_placeholder') || "Enter your email"}
                value={waitlistEmail}
                onChange={(e) => setWaitlistEmail(e.target.value)}
                required
                disabled={waitlistSubmitting}
                className="w-full font-body text-[14px] px-5 py-[14px] outline-none bg-transparent border-0 text-[var(--white)] placeholder:text-[var(--subtle)] focus:ring-0 transition-colors disabled:opacity-60"
                aria-describedby={waitlistMsg ? 'waitlist-msg' : undefined}
              />
            </div>
            <div className="w-px bg-[var(--border-md)] hidden sm:block h-8 self-center" />
            <select
              value={waitlistCourse}
              onChange={(e) => setWaitlistCourse(e.target.value)}
              disabled={waitlistSubmitting}
              className="font-mono text-[11px] uppercase tracking-[0.05em] px-4 py-[14px] outline-none bg-transparent border-0 text-[var(--subtle)] transition-colors disabled:opacity-60 w-full sm:w-[180px] cursor-pointer"
              aria-label="Course (optional)"
            >
              <option value="" className="bg-[var(--void)]">{t('teach_any_course') || "Any Course"}</option>
              {displayCourses.map((c) => (
                <option key={c.slug || c.id} value={c.slug || c.id} className="bg-[var(--void)]">{c.name}</option>
              ))}
            </select>
            <button
              type="submit"
              disabled={waitlistSubmitting}
              className="inline-flex items-center justify-center gap-2 font-display text-[12px] font-bold uppercase tracking-[0.1em] px-8 py-[14px] bg-[var(--nebula)] text-[var(--white)] border-0 rounded-none transition-all hover:bg-[var(--violet)] disabled:opacity-60 active:scale-[0.98]"
            >
              {waitlistSubmitting ? t('teach_submitting') || '...' : t('teach_notify_button') || 'Notify Me'}
            </button>
          </form>
          {waitlistMsg && (
            <div id="waitlist-msg" role="status" className="font-mono text-[11px] mt-4 flex items-center gap-2 text-[var(--nebula)]" aria-live="polite">
              <div className="w-2 h-2 rounded-full bg-current animate-pulse" />
              {waitlistMsg}
            </div>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 md:py-16 border-b border-[var(--border)]">
        <div className="max-w-[1160px] mx-auto px-4 md:px-8">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-6 h-px bg-[var(--violet)]" />
            <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-[var(--violet)]">
              What Students Say
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayTestimonials.length === 0 ? (
              <p className="font-body text-[14px] text-[var(--muted)] col-span-full">No testimonials yet.</p>
            ) : (
              displayTestimonials.map((t, i) => (
                <div key={t.id ?? `testimonial-${i}`} className="group p-8 bg-[var(--surface)] border border-[var(--border)] transition-all duration-300 hover:border-[var(--sungold)]/30 hover:bg-[var(--elevated)] relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-[var(--sungold)] opacity-[0.02] blur-2xl group-hover:opacity-[0.05] transition-opacity" />
                  <Quote size={24} className="mb-6 text-[var(--sungold)] opacity-40 group-hover:opacity-100 transition-opacity" />
                  <p className="font-body text-[15px] leading-[1.8] mb-8 text-[var(--subtle)] group-hover:text-[var(--white)] transition-colors">
                    &ldquo;{t.text}&rdquo;
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-[var(--elevated)] border border-[var(--border-md)] flex items-center justify-center font-display text-[14px] font-bold text-[var(--sungold)] uppercase">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-display text-[14px] font-bold text-[var(--white)] tracking-tight">{t.name}</div>
                      <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--stardust)]">{t.role}</div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* FAQ accordion */}
      <section className="py-12 md:py-16">
        <div className="max-w-[1160px] mx-auto px-4 md:px-8">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-px bg-[var(--sungold)]" />
            <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-[var(--sungold)]">
              FAQ
            </span>
          </div>
          <h2 className="font-display font-extrabold leading-[1.1] tracking-[-0.02em] mb-8 text-[var(--white)]" style={{ fontSize: 'clamp(24px, 3vw, 36px)' }}>
            Frequently Asked Questions
          </h2>
          <div className="max-w-[720px] flex flex-col gap-3">
            {faqItems.map((item, i) => (
              <FaqItem
                key={i}
                index={i}
                item={item}
                open={openFaqIndex === i}
                onToggle={() => setOpenFaqIndex(prev => (prev === i ? null : i))}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default TeachPage;
