import React, { useEffect, useRef, useState } from 'react';
import { DataErrorBanner, DataLoadingSkeleton } from './DataStateMessage';

const Courses = ({ query, personalInfoQuery }) => {
  const [revealed, setRevealed] = useState(false);
  const sectionRef = useRef(null);
  const { data, loading, error, refetch } = query ?? {};
  const courses = Array.isArray(data) ? data : [];
  const totalCurriculumItems = courses.reduce((sum, course) => {
    return sum + (Array.isArray(course.curriculum) ? course.curriculum.length : 0);
  }, 0);
  const openCourses = courses.filter((course) => course.open_for_enrolment).length;
  const availability = personalInfoQuery?.data?.availability || 'Availability unavailable';

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const cells = [
    {
      num: loading ? '--' : String(courses.length).padStart(2, '0'),
      suffix: courses.length > 0 ? '+' : '',
      label: loading
        ? 'Courses are loading from Supabase.'
        : courses.length > 0
          ? 'Courses published from Supabase for the teaching section.'
          : 'No courses are currently available from Supabase.',
      tag: 'Curriculum',
      delay: 'reveal'
    },
    {
      num: loading ? '--' : String(totalCurriculumItems).padStart(2, '0'),
      suffix: '',
      label: 'Curriculum modules available across published courses.',
      tag: 'Impact',
      delay: 'reveal delay-1'
    },
    {
      num: loading ? '--' : String(openCourses).padStart(2, '0'),
      suffix: '×',
      label: 'Courses currently marked open for enrolment in Supabase.',
      tag: 'Philosophy',
      delay: 'reveal delay-2'
    },
    {
      num: availability ? '01' : '--',
      suffix: '',
      label: availability,
      tag: 'Experience',
      delay: 'reveal delay-3'
    }
  ];

  return (
    <section id="teaching" ref={sectionRef}>
      <div className="section-header">
        <span className="section-label">Education & Teaching</span>
        <span className="section-num">§ 03</span>
      </div>
      <div className="teaching-grid">
        {cells.map((cell, idx) => (
          <div key={idx} className={`${cell.delay} ${revealed ? 'in' : ''} teaching-cell`}>
            <div>
              <div className="teaching-cell-num">
                {cell.num}
                {cell.suffix && <span>{cell.suffix}</span>}
              </div>
              <div className="teaching-cell-label">
                {loading && idx === 0 ? <DataLoadingSkeleton lines={2} /> : cell.label}
              </div>
            </div>
            <div className="teaching-cell-tag">{cell.tag}</div>
          </div>
        ))}
      </div>
      <DataErrorBanner error={error || personalInfoQuery?.error} onRetry={() => {
        refetch?.();
        personalInfoQuery?.refetch?.();
      }} className="mx-6 md:mx-12 mt-4" />
    </section>
  );
};

export default Courses;
