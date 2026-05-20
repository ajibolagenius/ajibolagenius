import React, { useEffect, useRef, useState } from 'react';
import { DataErrorBanner, DataLoadingSkeleton } from './DataStateMessage';

const Hero = ({ query }) => {
    const heroRef = useRef(null);
    const innerRef = useRef(null);
    const [revealed, setRevealed] = useState(false);
    const { data, loading, error, refetch } = query ?? {};
    const info = data ?? {};
    const tagline = (info.tagline || '').replace(/,\s*$/, '').trim();
    const [headlineStart, headlineEnd] = tagline.includes('&')
        ? tagline.split('&').map((part) => part.trim())
        : [tagline || 'Design', info.tagline_suffix || info.taglineSuffix || 'Engineering'];

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
                            {loading ? 'Loading profile...' : info.role || 'Profile unavailable'}
                        </div>
                        <h1 className={`hero-title reveal delay-1 ${revealed ? 'in' : ''}`}>
                            {headlineStart} <em>&amp;</em><br />
                            <span className="outline">{headlineEnd}</span>
                        </h1>
                        <div className={`hero-rule reveal delay-2 ${revealed ? 'in' : ''}`}>
                            <div className="hero-rule-line"></div>
                            <span className="hero-rule-label">DON_GENIUS — {info.name || 'Profile unavailable'}</span>
                            <div className="hero-rule-line"></div>
                        </div>
                        {loading ? (
                            <DataLoadingSkeleton lines={2} className={`hero-desc reveal delay-3 ${revealed ? 'in' : ''}`} />
                        ) : (
                            <p className={`hero-desc reveal delay-3 ${revealed ? 'in' : ''}`}>
                                {info.description || 'Profile description is unavailable.'}
                            </p>
                        )}
                        <DataErrorBanner error={error} onRetry={refetch} className="mt-4" />
                    </div>
                    <div className="hero-side">
                        <div>
                            <div className={`hero-stat reveal ${revealed ? 'in' : ''}`}>
                                <div className="hero-stat-num">{info.availability ? '01' : '--'}<span></span></div>
                                <div className="hero-stat-label">{info.availability || 'Availability unavailable'}</div>
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
                                <span className="hero-badge-name">{info.name || 'Profile unavailable'}</span>
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
