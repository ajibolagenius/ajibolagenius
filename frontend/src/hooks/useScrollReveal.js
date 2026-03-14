import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Reveal element(s) on scroll with GSAP ScrollTrigger.
 * Respects prefers-reduced-motion (no animation when set).
 *
 * @param {React.RefObject|React.RefObject[]} refOrRefs - Single ref or array of refs
 * @param {Object} [options]
 * @param {number} [options.y=24] - Start offset (px)
 * @param {number} [options.duration=0.6]
 * @param {string} [options.ease='power2.out']
 * @param {number} [options.start='top 85%']
 * @param {boolean} [options.once=true]
 */
export function useScrollReveal(refOrRefs, options = {}) {
  const {
    y = 24,
    duration = 0.6,
    ease = 'power2.out',
    start = 'top 85%',
    once = true,
  } = options;

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const refs = Array.isArray(refOrRefs) ? refOrRefs : [refOrRefs];
    const els = refs.map((r) => r?.current).filter(Boolean);
    if (els.length === 0) return;

    const ctx = gsap.context(() => {
      els.forEach((el) => {
        gsap.fromTo(
          el,
          { y, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration,
            ease,
            scrollTrigger: {
              trigger: el,
              start,
              once,
              toggleActions: 'play none none none',
            },
          }
        );
      });
    });

    return () => ctx.revert();
  }, [refOrRefs, y, duration, ease, start, once]);
}
