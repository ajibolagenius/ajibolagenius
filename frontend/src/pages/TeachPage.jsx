import React, { useState, useMemo, useEffect } from 'react';
import { MessageSquare, Quote, ChevronDown, ChevronUp } from 'lucide-react';
import { fetchCourses, fetchTestimonials, fetchPersonalInfo, submitCourseWaitlist } from '../services/api';
import { faqItems, courses as mockFallbackCourses, testimonials as mockFallbackTestimonials } from '../data/mock';
import { usePageMeta } from '../hooks/usePageMeta';
import { buildStaticPageMeta } from '../lib/routeMeta';
import { useRealtimeQuery } from '../hooks/useRealtimeQuery';
import { buildTeachPageSchema } from '../lib/structuredData';
import { paginate } from '../lib/paginate';
import ListPagination from '../components/portfolio/ListPagination';

const CourseCard = ({ course, whatsapp }) => {
  const [expanded, setExpanded] = useState(false);
  const isOpen = course.open_for_enrolment === true;

  return (
    <div
      style={{
        border: '1px solid var(--ink)',
        background: 'var(--surface)',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        opacity: isOpen ? 1 : 0.8,
      }}
    >
      <div className="flex justify-between items-start gap-4">
        <div>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '8px',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: isOpen ? 'var(--red)' : 'var(--muted)',
              border: `1px solid ${isOpen ? 'var(--red)' : 'var(--muted)'}`,
              padding: '2px 8px',
              display: 'inline-block',
              marginBottom: '8px',
              fontWeight: 'bold',
            }}
          >
            {isOpen ? 'ENROLMENT OPEN' : 'CLOSED'}
          </span>
          <h3
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '20px',
              fontWeight: 'bold',
              lineHeight: 1.15,
            }}
          >
            {course.name}
          </h3>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              color: 'var(--muted)',
              display: 'block',
              marginTop: '4px',
            }}
          >
            {course.duration}
          </span>
        </div>

        <div style={{ textAlign: 'right' }}>
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '22px',
              fontWeight: 'bold',
              color: 'var(--red)',
              display: 'block',
            }}
          >
            {course.price}
          </span>
        </div>
      </div>

      <p className="hero-desc" style={{ fontSize: '13px', lineHeight: 1.6 }}>
        {course.description}
      </p>

      {course.curriculum && course.curriculum.length > 0 && (
        <div>
          <button
            onClick={() => setExpanded(!expanded)}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '9px',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--ink)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: 0,
            }}
          >
            <span>{expanded ? 'Hide Syllabus' : 'View Syllabus'}</span>
            {expanded ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
          </button>

          {expanded && (
            <ul
              style={{
                listStyle: 'none',
                padding: '12px 0 0',
                margin: 0,
                borderTop: 'var(--rule-thin)',
                marginTop: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              {course.curriculum.map((item, idx) => (
                <li
                  key={idx}
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    color: 'var(--ink)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <span style={{ width: '4px', height: '4px', background: 'var(--red)' }} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {isOpen && (
        <a
          href={whatsapp || 'https://wa.me/2349052026857'}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '9px',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            padding: '10px 16px',
            background: 'var(--ink)',
            color: 'var(--cream)',
            textDecoration: 'none',
            textAlign: 'center',
            marginTop: 'auto',
            fontWeight: 'bold',
          }}
        >
          Enrol via WhatsApp
        </a>
      )}
    </div>
  );
};

const FaqItem = ({ item, index, open, onToggle }) => {
  return (
    <div style={{ borderBottom: 'var(--rule-thin)', padding: '16px 0' }}>
      <button
        onClick={onToggle}
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
          textAlign: 'left',
        }}
      >
        <span style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 'bold', color: 'var(--ink)' }}>
          {item.question}
        </span>
        {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>
      {open && (
        <p className="hero-desc" style={{ fontSize: '13px', lineHeight: 1.6, marginTop: '12px', paddingLeft: '8px' }}>
          {item.answer}
        </p>
      )}
    </div>
  );
};

const TeachPage = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [revealed, setRevealed] = useState(false);

  const { data: rawCourses } = useRealtimeQuery('courses', fetchCourses, mockFallbackCourses);
  const { data: rawTestimonials } = useRealtimeQuery('testimonials', fetchTestimonials, mockFallbackTestimonials);
  const { data: info } = useRealtimeQuery('personal_info', fetchPersonalInfo);

  const courses = Array.isArray(rawCourses) && rawCourses.length > 0 ? rawCourses : mockFallbackCourses;
  const testimonials =
    Array.isArray(rawTestimonials) && rawTestimonials.length > 0 ? rawTestimonials : mockFallbackTestimonials;
  const whatsapp = info?.social?.whatsapp || '';

  const [sortBy, setSortBy] = useState('default');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => setRevealed(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const sortedCourses = useMemo(() => {
    const list = [...courses];
    if (sortBy === 'default') {
      return list.sort((a, b) => {
        const aOpen = a.open_for_enrolment === true ? 1 : 0;
        const bOpen = b.open_for_enrolment === true ? 1 : 0;
        return bOpen - aOpen;
      });
    }
    return list.sort((a, b) => {
      const nameA = (a.name || '').toLowerCase();
      const nameB = (b.name || '').toLowerCase();
      if (sortBy === 'name-asc') return nameA.localeCompare(nameB);
      if (sortBy === 'name-desc') return nameB.localeCompare(nameA);
      const priceA = parseFloat(String(a.price).replace(/[^\d.]/g, '')) || 0;
      const priceB = parseFloat(String(b.price).replace(/[^\d.]/g, '')) || 0;
      if (sortBy === 'price-asc') return priceA - priceB;
      return priceB - priceA;
    });
  }, [courses, sortBy]);

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
    if (!waitlistEmail || waitlistSubmitting) return;
    setWaitlistSubmitting(true);
    setWaitlistMsg('');
    try {
      await submitCourseWaitlist(waitlistEmail.trim(), waitlistCourse || null);
      setWaitlistMsg('Added to waitlist! You will be notified on next opening.');
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
    ...buildStaticPageMeta('/teach'),
    structuredData: buildTeachPageSchema(courses),
  });

  return (
    <div className="page-content">
      {/* Page Header */}
      <section style={{ borderBottom: 'var(--rule)', padding: '56px 0 40px' }}>
        <div className={`reveal ${revealed ? 'in' : ''}`}>
          <div className="hero-kicker">
            <span className="hero-kicker-dot"></span>
            Syllabus &amp; Craft
          </div>
          <h1 className="hero-title" style={{ fontSize: 'clamp(52px, 8vw, 100px)', lineHeight: 0.9 }}>
            Teach &amp; <em>Learn</em>
          </h1>
          <div className="hero-rule" style={{ margin: '24px 0 20px' }}>
            <div className="hero-rule-line"></div>
            <span className="hero-rule-label">DON_GENIUS — CLASSES</span>
            <div className="hero-rule-line"></div>
          </div>
          <p className="hero-desc" style={{ maxWidth: '620px' }}>
            Technical courses and hands-on workshops designed for immediate practical building, not abstract theory.
          </p>
        </div>
      </section>

      {/* Structured Courses Index Grid */}
      <section style={{ borderBottom: 'var(--rule)', padding: '56px 0' }}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '16px', height: '1px', background: 'var(--red)' }} />
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'var(--red)',
              }}
            >
              Curriculums
            </span>
          </div>

          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setPage(1);
            }}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              padding: '6px 12px',
              border: '1px solid var(--ink)',
              background: 'transparent',
              color: 'var(--ink)',
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            <option value="default">Open First</option>
            <option value="name-asc">Name A-Z</option>
            <option value="name-desc">Name Z-A</option>
            <option value="price-asc">Price Low-High</option>
            <option value="price-desc">Price High-Low</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedCourses.map((c, i) => (
            <CourseCard key={c.id || i} course={c} whatsapp={whatsapp} />
          ))}
        </div>

        {courses.length > 0 && (
          <div style={{ marginTop: '48px' }}>
            <ListPagination
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
              range={{ start, end, total }}
            />
          </div>
        )}
      </section>

      {/* Waitlist Form Section */}
      <section style={{ borderBottom: 'var(--rule)', padding: '56px 0' }}>
        <div style={{ border: '1px solid var(--ink)', padding: '40px', background: 'var(--surface)' }}>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--muted)',
              display: 'block',
              marginBottom: '16px',
            }}
          >
            Waitlist Registration
          </span>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '28px',
              fontWeight: 'bold',
              marginBottom: '12px',
            }}
          >
            Notify me on next opening.
          </h2>
          <p className="hero-desc" style={{ fontSize: '14px', maxWidth: '480px', marginBottom: '24px' }}>
            Register your coordinates below. You will be prioritized immediately on next cohort intake.
          </p>

          <form
            onSubmit={handleWaitlistSubmit}
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: '12px',
              maxWidth: '520px',
            }}
          >
            <input
              type="email"
              placeholder="Your email address..."
              value={waitlistEmail}
              onChange={(e) => setWaitlistEmail(e.target.value)}
              disabled={waitlistSubmitting}
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '13px',
                padding: '12px 16px',
                border: '1px solid var(--ink)',
                background: 'transparent',
                outline: 'none',
                color: 'var(--ink)',
              }}
              required
            />

            <select
              value={waitlistCourse}
              onChange={(e) => setWaitlistCourse(e.target.value)}
              disabled={waitlistSubmitting}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                padding: '12px 16px',
                border: '1px solid var(--ink)',
                background: 'transparent',
                color: 'var(--ink)',
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              <option value="" className="bg-[var(--cream)]">
                Select Course (Optional)
              </option>
              {courses.map((c) => (
                <option key={c.id} value={c.slug || c.id} className="bg-[var(--cream)]">
                  {c.name}
                </option>
              ))}
            </select>

            <button
              type="submit"
              disabled={waitlistSubmitting}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                padding: '12px 24px',
                background: 'var(--ink)',
                color: 'var(--cream)',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 'bold',
                textAlign: 'center',
              }}
            >
              {waitlistSubmitting ? 'Submitting...' : 'Register Waitlist'}
            </button>
          </form>
          {waitlistMsg && (
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', marginTop: '12px', color: 'var(--red)' }}>
              {waitlistMsg}
            </p>
          )}
        </div>
      </section>

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section style={{ borderBottom: 'var(--rule)', padding: '56px 0 80px' }}>
          <h3
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              marginBottom: '32px',
            }}
          >
            Review Catalog
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <div
                key={t.id || idx}
                style={{
                  border: '1px solid var(--ink)',
                  padding: '24px',
                  background: 'var(--surface)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                }}
              >
                <Quote size={20} style={{ color: 'var(--red)', opacity: 0.3 }} />
                <p className="hero-desc" style={{ fontSize: '13px', lineHeight: 1.6, fontStyle: 'italic' }}>
                  "{t.text}"
                </p>
                <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 'bold' }}>
                    {t.name}
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--muted)' }}>
                    {t.role}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* FAQ */}
      <section style={{ padding: '56px 0 80px' }}>
        <h3
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            marginBottom: '24px',
          }}
        >
          General FAQs
        </h3>
        <div style={{ maxWidth: '720px' }}>
          {faqItems.map((item, idx) => (
            <FaqItem
              key={idx}
              item={item}
              index={idx}
              open={openFaqIndex === idx}
              onToggle={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default TeachPage;
