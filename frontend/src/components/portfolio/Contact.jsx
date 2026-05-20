import React, { useEffect, useRef, useState } from 'react';
import { DataErrorBanner, DataLoadingSkeleton } from './DataStateMessage';

const Contact = ({ query }) => {
  const [revealed, setRevealed] = useState(false);
  const sectionRef = useRef(null);
  const { data, loading, error, refetch } = query ?? {};
  const info = data ?? {};
  const social = info.social || {};

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

  return (
    <section id="contact" ref={sectionRef}>
      <div className="contact-body">
        <div className="contact-eyebrow">Contact</div>
        <h2 className={`contact-title reveal ${revealed ? 'in' : ''}`}>
          Let's build<br />
          something <em>great.</em>
        </h2>
        <div className="contact-grid">
          <div className={`contact-item reveal ${revealed ? 'in' : ''}`}>
            <div className="contact-item-label">Email</div>
            {loading ? (
              <DataLoadingSkeleton lines={1} />
            ) : info.email ? (
              <a className="contact-item-val" href={`mailto:${info.email}`}>
                {info.email}
              </a>
            ) : (
              <span className="contact-item-val">Email unavailable</span>
            )}
          </div>
          <div className={`contact-item reveal delay-1 ${revealed ? 'in' : ''}`}>
            <div className="contact-item-label">Location</div>
            <span className="contact-item-val">
              {loading ? 'Loading...' : info.location || 'Location unavailable'}
            </span>
          </div>
          <div className={`contact-item reveal delay-2 ${revealed ? 'in' : ''}`}>
            <div className="contact-item-label">Social &amp; Quick Connect</div>
            {social.whatsapp ? (
              <a className="contact-item-val" href={social.whatsapp} target="_blank" rel="noopener noreferrer">
                WhatsApp Chat →
              </a>
            ) : (
              <span className="contact-item-val">{loading ? 'Loading...' : 'WhatsApp unavailable'}</span>
            )}
          </div>
        </div>
        <DataErrorBanner error={error} onRetry={refetch} className="mt-4" />
      </div>
    </section>
  );
};

export default Contact;
