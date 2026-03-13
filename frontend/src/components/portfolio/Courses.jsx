import React, { useEffect, useRef, useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { fetchCourses } from '../../services/api';
import { courses as fbCourses } from '../../data/mock';
const CourseCard = ({ course, index, visible }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="grid grid-cols-[1fr_auto] items-center gap-4 p-5 cursor-pointer transition-all duration-200"
      style={{
        background: hovered ? '#17172E' : '#111126',
        border: '1px solid rgba(255,255,255,0.06)',
        borderLeft: '3px solid #E8A020',
        borderRadius: 0,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transitionDelay: visible ? `${index * 80}ms` : '0ms'
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span
            className="font-mono text-[10px] font-bold tracking-[0.1em] uppercase px-[10px] py-[4px]"
            style={{
              background: 'rgba(232,160,32,0.15)',
              color: '#E8A020',
              border: '1px solid rgba(232,160,32,0.3)',
              borderRadius: 0
            }}
          >
            {course.badge}
          </span>
        </div>
        <h3
          className="font-display text-[15px] font-semibold mb-1"
          style={{ color: '#F2EFE8' }}
        >
          {course.name}
        </h3>
        <p
          className="font-mono text-[11px]"
          style={{ color: 'rgba(242,239,232,0.55)' }}
        >
          {course.duration}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <span
          className="font-display text-[20px] font-extrabold whitespace-nowrap"
          style={{ color: '#E8A020' }}
        >
          {course.price}
        </span>
        <ExternalLink
          size={14}
          className="transition-transform duration-200"
          style={{
            color: 'rgba(242,239,232,0.3)',
            transform: hovered ? 'translate(2px, -2px)' : 'none'
          }}
        />
      </div>
    </div>
  );
};

const Courses = () => {
  const [visible, setVisible] = useState(false);
  const [courses, setCourses] = useState([]);
  const sectionRef = useRef(null);

  useEffect(() => {
    fetchCourses()
      .then(data => setCourses(data.slice(0, 6)))
      .catch(() => setCourses(fbCourses.slice(0, 6)));
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="courses"
      ref={sectionRef}
      className="py-12 md:py-20 border-b border-[var(--border)]"
    >
      <div className="max-w-[1160px] mx-auto px-4 md:px-8 pt-12 md:pt-20">
        {/* Section kicker */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-5 h-px bg-[var(--sungold)]" />
          <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-[var(--sungold)]">
            03 — Teach
          </span>
        </div>

        <h2
          className="font-display font-extrabold leading-[1.1] tracking-[-0.02em] mb-3 text-[var(--white)]"
          style={{ fontSize: 'clamp(28px, 4vw, 42px)' }}
        >
          Courses & Mentorship
        </h2>

        <p className="font-body text-[15px] leading-[1.7] mb-10 max-w-[520px] text-[var(--muted)]">
          I teach what I know and share what I learn. Remote courses designed for the Nigerian developer looking to level up.
        </p>

        {/* Courses grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {courses.map((course, i) => (
            <CourseCard key={course.id} course={course} index={i} visible={visible} />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10 flex items-center gap-4">
          <a
            href="/teach"
            className="inline-flex items-center gap-2 font-display text-[13px] font-semibold tracking-[0.04em] px-[22px] py-[11px] no-underline cursor-pointer transition-all duration-200"
            style={{
              background: '#5B4FD8',
              color: '#F2EFE8',
              borderRadius: 0,
              border: 'none'
            }}
            onClick={(e) => {
              e.preventDefault();
              window.location.href = '/teach';
            }}
          >
            View All Courses
            <ExternalLink size={14} />
          </a>
          <span
            className="font-mono text-[11px]"
            style={{ color: 'rgba(242,239,232,0.3)' }}
          >
            WhatsApp enrollment available
          </span>
        </div>
      </div>
    </section>
  );
};

export default Courses;
