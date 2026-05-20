import React, { useEffect, useRef, useState } from 'react';
import { fetchPersonalInfo } from '../../services/api';
import { useRealtimeQuery } from '../../hooks/useRealtimeQuery';
import { getPersonalInfoQueryFallback } from '../../lib/personalInfoFallbacks';

const fbInfo = getPersonalInfoQueryFallback();

const Hero = () => {
  const heroRef = useRef(null);
  const innerRef = useRef(null);
  const [revealed, setRevealed] = useState(false);
  const { data: info } = useRealtimeQuery('personal_info', fetchPersonalInfo, fbInfo);

  const data = info || fbInfo;

  useEffect(() => {
    // Scroll reveal triggers on mount for Hero
    const timer = setTimeout(() => {
      setRevealed(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const heroEl = heroRef.current;
    const innerEl = innerRef.current;
    if (!heroEl || !innerEl) return;

    const handleMouseMove = (e) => {
      const rect = heroEl.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      innerEl.style.transform = `perspective(1200px) rotateY(${nx * 2.5}deg) rotateX(${-ny * 1.5}deg)`;
    };

    const handleMouseLeave = () => {
      innerEl.style.transform = '';
      innerEl.style.transition = 'transform 0.6s ease';
      setTimeout(() => {
        if (innerEl) innerEl.style.transition = '';
      }, 600);
    };

    heroEl.addEventListener('mousemove', handleMouseMove);
    heroEl.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      heroEl.removeEventListener('mousemove', handleMouseMove);
      heroEl.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <section>
      <div ref={heroRef} className="hero">
        <div ref={innerRef} className="hero-inner">
          <div className="hero-headline">
            <div className={`hero-kicker reveal ${revealed ? 'in' : ''}`}>
              <span className="hero-kicker-dot"></span>
              {data.role || 'Full Stack Developer · UI/UX Designer · Tech Educator'}
            </div>
            <h1 className={`hero-title reveal delay-1 ${revealed ? 'in' : ''}`}>
              Design<br />
              <em>&amp;</em><br />
              <span className="outline">Engineering</span>
            </h1>
            <div className={`hero-rule reveal delay-2 ${revealed ? 'in' : ''}`}>
              <div className="hero-rule-line"></div>
              <span className="hero-rule-label">DON_GENIUS — {data.name || 'Ajibola Akelebe'}</span>
              <div className="hero-rule-line"></div>
            </div>
            <p className={`hero-desc reveal delay-3 ${revealed ? 'in' : ''}`}>
              {data.description || 'Developer and designer building for a global audience from Lagos. I ship what I learn — AI-native products, immersive interfaces, and educational experiences that actually stick.'}
            </p>
          </div>
          <div className="hero-side">
            <div>
              <div className={`hero-stat reveal ${revealed ? 'in' : ''}`}>
                <div className="hero-stat-num">10<span>+</span></div>
                <div className="hero-stat-label">Years of practice</div>
              </div>
              <div className={`hero-stat reveal delay-1 ${revealed ? 'in' : ''}`}>
                <div className="hero-stat-num">3<span>×</span></div>
                <div className="hero-stat-label">Disciplines mastered</div>
              </div>
              <div className={`hero-stat reveal delay-2 ${revealed ? 'in' : ''}`}>
                <div className="hero-stat-num">∞</div>
                <div className="hero-stat-label">Problems to solve</div>
              </div>
            </div>
            <div className={`hero-portrait reveal delay-3 ${revealed ? 'in' : ''}`}>
              <div className="hero-portrait-placeholder">
                <div className="hero-portrait-init">AA</div>
              </div>
              <div className="hero-badge">
                <span className="hero-badge-name">{data.name || 'Ajibola Akelebe'}</span>
                <span className="hero-badge-role">DON_GENIUS</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
