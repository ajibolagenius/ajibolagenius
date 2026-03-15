import React, { useState, useMemo } from 'react';
import { MessageSquare, Quote, ChevronDown, ChevronUp } from 'lucide-react';
import { fetchCourses, fetchTestimonials, fetchPersonalInfo } from '../services/api';
import { courses as fbCourses, testimonials as fbTestimonials, faqItems, personalInfo as fbInfo } from '../data/mock';
import Badge from '../components/portfolio/Badge';
import SectionKicker from '../components/portfolio/SectionKicker';
import SortSelect from '../components/portfolio/SortSelect';
import { usePageMeta } from '../hooks/usePageMeta';
import { useRealtimeQuery } from '../hooks/useRealtimeQuery';
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
  { value: 'name-asc', label: 'Name A–Z' },
  { value: 'name-desc', label: 'Name Z–A' },
  { value: 'price-asc', label: 'Price low–high' },
  { value: 'price-desc', label: 'Price high–low' },
];

const CourseCard = ({ course, whatsapp, index = 0 }) => {
  const [hovered, setHovered] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const accent = COURSE_ACCENTS[index % COURSE_ACCENTS.length];
  const accentColor = accent.color;

  return (
    <div
      className="transition-all duration-200 overflow-hidden border border-[var(--border)] cursor-pointer"
      style={{
        background: hovered ? 'var(--elevated)' : 'var(--surface)',
        borderLeft: `3px solid ${accentColor}`
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="p-5 grid grid-cols-[1fr_auto] items-center gap-4"
        onClick={() => setExpanded(!expanded)}
      >
        <div>
          <Badge variant={accent.badge} className="mb-2">
            {course.badge}
          </Badge>
          <h3 className="font-display text-[15px] font-semibold mb-1 text-[var(--white)]">
            {course.name}
          </h3>
          <p className="font-mono text-[11px] text-[var(--muted)]">{course.duration}</p>
          <p className="font-body text-[13px] mt-2 text-[var(--subtle)]">{course.description}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span
            className="font-display text-[20px] font-extrabold whitespace-nowrap"
            style={{ color: accentColor }}
          >
            {course.price}
          </span>
          {expanded ? <ChevronUp size={16} className="text-[var(--sungold)]" /> : <ChevronDown size={16} className="text-[var(--subtle)]" />}
        </div>
      </div>
      {expanded && course.curriculum && (
        <div className="px-5 pb-5 pt-0 border-t border-[var(--border)]">
          <div className="pt-4">
            <div className="font-mono text-[10px] tracking-[0.12em] uppercase mb-3 text-[var(--stardust)]">
              Curriculum
            </div>
            <ul className="list-none p-0 m-0 flex flex-col gap-2">
              {course.curriculum.map((item, i) => (
                <li key={i} className="flex items-center gap-2 font-body text-[13px] text-[var(--muted)]">
                  <span className="w-1.5 h-1.5 flex-shrink-0 bg-[var(--sungold)]" />
                  {item}
                </li>
              ))}
            </ul>
            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex items-center gap-2 font-display text-[12px] font-semibold px-4 py-2 mt-4 no-underline border-0 rounded-none"
              style={{ background: accentColor, color: accentColor === 'var(--sungold)' ? 'var(--void)' : 'var(--white)' }}
            >
              <MessageSquare size={12} /> Enrol via WhatsApp
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

const FaqItem = ({ item, open, onToggle }) => (
  <div
    className="cursor-pointer transition-all duration-200 border border-[var(--border)]"
    style={{ background: open ? 'var(--elevated)' : 'var(--surface)' }}
    onClick={onToggle}
  >
    <div className="p-5 flex items-center justify-between gap-4">
      <h4 className="font-display text-[14px] font-semibold text-[var(--white)]">
        {item.question}
      </h4>
      {open ? (
        <ChevronUp size={16} className="text-[var(--sungold)] flex-shrink-0" />
      ) : (
        <ChevronDown size={16} className="text-[var(--subtle)] flex-shrink-0" />
      )}
    </div>
    {open && (
      <div className="px-5 pb-5">
        <p className="font-body text-[13px] leading-[1.7] text-[var(--muted)]">{item.answer}</p>
      </div>
    )}
  </div>
);

const TeachPage = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const { data: courses } = useRealtimeQuery('courses', fetchCourses, fbCourses);
  const { data: testimonials } = useRealtimeQuery('testimonials', fetchTestimonials, fbTestimonials);
  const { data: personalInfo } = useRealtimeQuery('personal_info', fetchPersonalInfo, fbInfo);
  const displayCourses = Array.isArray(courses) && courses.length > 0 ? courses : fbCourses;
  const displayTestimonials = Array.isArray(testimonials) && testimonials.length > 0 ? testimonials : fbTestimonials;
  const whatsapp = personalInfo?.social?.whatsapp || fbInfo.social.whatsapp;

  const [sortBy, setSortBy] = useState('name-asc');
  const [page, setPage] = useState(1);
  const sortedCourses = useMemo(() => {
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

  usePageMeta({
    title: 'Courses & Mentorship',
    description: 'I teach what I know and share what I learn. Remote courses designed for the Nigerian developer ready to level up.',
    structuredData: buildTeachPageSchema(displayCourses),
    canonical: '/teach',
  });

  return (
    <>
      {/* Teaching Philosophy Header */}
      <section className="pt-12 pb-8 md:pt-20 md:pb-10 border-b border-[var(--border)]">
        <div className="max-w-[1160px] mx-auto px-4 md:px-8">
          <SectionKicker label="Teach" accent="sungold" />
          <h1 className="font-display font-extrabold leading-[1.05] tracking-[-0.03em] mb-4 text-[var(--white)]" style={{ fontSize: 'clamp(36px, 6vw, 64px)' }}>
            Courses & Mentorship
          </h1>
          <p className="font-body text-[17px] leading-[1.7] max-w-[600px] mb-4 text-[var(--muted)]">
            I teach what I know and share what I learn. Remote courses designed for the Nigerian developer ready to level up.
          </p>
          <p className="font-body text-[15px] leading-[1.7] max-w-[600px] text-[var(--subtle)]">
            Start with <em>why</em>, not just <em>what</em>. Projects beat theory every time. Community is everything — the WhatsApp groups outlast the courses. Pricing is set for Nigerian reality, not Silicon Valley budgets.
          </p>
          <p className="font-mono text-[11px] tracking-[0.08em] mt-6 text-[var(--dim)]">
            // {displayCourses.length} courses · 200+ students · Remote delivery
          </p>
        </div>
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
                <div key={t.id ?? `testimonial-${i}`} className="p-6 bg-[var(--surface)] border border-[var(--border)]">
                  <Quote size={20} className="mb-4 text-[var(--sungold)] opacity-60" />
                  <p className="font-body text-[13px] leading-[1.7] mb-5 text-[var(--muted)]">
                    &ldquo;{t.text}&rdquo;
                  </p>
                  <div>
                    <div className="font-display text-[13px] font-semibold text-[var(--white)]">{t.name}</div>
                    <div className="font-mono text-[10px] text-[var(--sungold)]">{t.role}</div>
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
