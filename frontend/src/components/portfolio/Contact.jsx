import React, { useEffect, useRef, useState } from 'react';
import { fetchPersonalInfo } from '../../services/api';
import { useRealtimeQuery } from '../../hooks/useRealtimeQuery';
import { getPersonalInfoQueryFallback } from '../../lib/personalInfoFallbacks';

const fbInfo = getPersonalInfoQueryFallback();

const Contact = () => {
  const [revealed, setRevealed] = useState(false);
  const sectionRef = useRef(null);
  const { data: info } = useRealtimeQuery('personal_info', fetchPersonalInfo, fbInfo);

  const data = info || fbInfo;
  const social = data.social || fbInfo.social || {};

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
            <a className="contact-item-val" href={`mailto:${data.email || 'akelebeajibola@gmail.com'}`}>
              {data.email || 'akelebeajibola@gmail.com'}
            </a>
          </div>
          <div className={`contact-item reveal delay-1 ${revealed ? 'in' : ''}`}>
            <div className="contact-item-label">Location</div>
            <span className="contact-item-val">
              {data.location || 'Lagos, Nigeria / Remote'}
            </span>
          </div>
          <div className={`contact-item reveal delay-2 ${revealed ? 'in' : ''}`}>
            <div className="contact-item-label">Social &amp; Quick Connect</div>
            {social.whatsapp ? (
              <a className="contact-item-val" href={social.whatsapp} target="_blank" rel="noopener noreferrer">
                WhatsApp Chat →
              </a>
            ) : (
              <a className="contact-item-val" href="https://wa.me/2349052026857" target="_blank" rel="noopener noreferrer">
                WhatsApp Chat →
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
