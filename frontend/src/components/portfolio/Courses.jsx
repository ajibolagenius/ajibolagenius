import React, { useEffect, useRef, useState } from 'react';

const Courses = () => {
  const [revealed, setRevealed] = useState(false);
  const sectionRef = useRef(null);

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
      num: '8',
      suffix: '+',
      label: 'Disciplines taught — from Python fundamentals to motion graphics and 3D design.',
      tag: 'Curriculum',
      delay: 'reveal'
    },
    {
      num: '∞',
      suffix: '',
      label: 'Students reached — through structured courses, live sessions, and hands-on projects.',
      tag: 'Impact',
      delay: 'reveal delay-1'
    },
    {
      num: '01',
      suffix: '×',
      label: "Rule — teach what you've shipped, not just what you've read.",
      tag: 'Philosophy',
      delay: 'reveal delay-2'
    },
    {
      num: '10',
      suffix: '+ yr',
      label: 'In practice — from graphic design origins to full-stack education and engineering.',
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
              <div className="teaching-cell-label">{cell.label}</div>
            </div>
            <div className="teaching-cell-tag">{cell.tag}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Courses;
