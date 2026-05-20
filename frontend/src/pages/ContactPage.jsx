import React, { useState, useEffect } from 'react';
import { submitContact, fetchPersonalInfo } from '../services/api';
import { usePageMeta } from '../hooks/usePageMeta';
import { buildStaticPageMeta } from '../lib/routeMeta';
import { useRealtimeQuery } from '../hooks/useRealtimeQuery';

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responseMsg, setResponseMsg] = useState('');
  const [isError, setIsError] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const { data: info } = useRealtimeQuery('personal_info', fetchPersonalInfo);

  useEffect(() => {
    const timer = setTimeout(() => setRevealed(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = {
      name: (formData.name || '').trim(),
      email: (formData.email || '').trim(),
      subject: (formData.subject || '').trim(),
      message: (formData.message || '').trim(),
    };
    if (!trimmed.name || !trimmed.email || !trimmed.subject || !trimmed.message) return;
    setIsSubmitting(true);
    setResponseMsg('');
    setIsError(false);
    try {
      const res = await submitContact(trimmed);
      setResponseMsg(res?.message || 'Message submitted successfully!');
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => {
        setSubmitted(false);
        setResponseMsg('');
      }, 5000);
    } catch (err) {
      setResponseMsg(err?.message || 'Something went wrong. Try again.');
      setIsError(true);
      setTimeout(() => {
        setResponseMsg('');
        setIsError(false);
      }, 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const data = info || {};
  const social = data.social || {};

  usePageMeta(buildStaticPageMeta('/contact'));

  return (
    <div className="page-content">
      {/* Editorial Header */}
      <section style={{ borderBottom: 'var(--rule)', padding: '56px 0 40px' }}>
        <div className={`reveal ${revealed ? 'in' : ''}`}>
          <div className="hero-kicker">
            <span className="hero-kicker-dot"></span>
            Coordinates
          </div>
          <h1 className="hero-title" style={{ fontSize: 'clamp(52px, 8vw, 100px)', lineHeight: 0.9 }}>
            Say <em>Hello</em>
          </h1>
          <div className="hero-rule" style={{ margin: '24px 0 20px' }}>
            <div className="hero-rule-line"></div>
            <span className="hero-rule-label">DON_GENIUS — CONNECT</span>
            <div className="hero-rule-line"></div>
          </div>
          <p className="hero-desc" style={{ maxWidth: '620px' }}>
            Reach out regarding prospective engineering roles, presentation sessions, courses, or custom software projects.
          </p>
        </div>
      </section>

      {/* Aligned Split Columns */}
      <section style={{ padding: '56px 0 80px' }}>
        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-16">
          {/* Left Column: Form */}
          <div>
            <h3
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                borderBottom: 'var(--rule)',
                paddingBottom: '12px',
                marginBottom: '32px',
                fontWeight: 'bold',
              }}
            >
              Correspondence Form
            </h3>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '9px',
                      textTransform: 'uppercase',
                      color: 'var(--muted)',
                      display: 'block',
                      marginBottom: '6px',
                    }}
                  >
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    disabled={isSubmitting}
                    style={{
                      width: '100%',
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
                </div>

                <div>
                  <label
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '9px',
                      textTransform: 'uppercase',
                      color: 'var(--muted)',
                      display: 'block',
                      marginBottom: '6px',
                    }}
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={isSubmitting}
                    style={{
                      width: '100%',
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
                </div>
              </div>

              <div>
                <label
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '9px',
                    textTransform: 'uppercase',
                    color: 'var(--muted)',
                    display: 'block',
                    marginBottom: '6px',
                  }}
                >
                  Subject
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  disabled={isSubmitting}
                  style={{
                    width: '100%',
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
              </div>

              <div>
                <label
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '9px',
                    textTransform: 'uppercase',
                    color: 'var(--muted)',
                    display: 'block',
                    marginBottom: '6px',
                  }}
                >
                  Message
                </label>
                <textarea
                  rows={6}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  disabled={isSubmitting}
                  style={{
                    width: '100%',
                    fontFamily: 'var(--font-body)',
                    fontSize: '13px',
                    padding: '12px 16px',
                    border: '1px solid var(--ink)',
                    background: 'transparent',
                    outline: 'none',
                    color: 'var(--ink)',
                    resize: 'vertical',
                  }}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
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
                  alignSelf: 'flex-start',
                }}
              >
                {isSubmitting ? 'Transmitting...' : submitted ? 'Received' : 'Send Message'}
              </button>

              {responseMsg && (
                <p
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    marginTop: '12px',
                    color: isError ? 'var(--red)' : 'var(--ink)',
                  }}
                >
                  {responseMsg}
                </p>
              )}
            </form>
          </div>

          {/* Right Column: Channels */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <h3
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                borderBottom: 'var(--rule)',
                paddingBottom: '12px',
                marginBottom: '0',
                fontWeight: 'bold',
              }}
            >
              Direct Pathways
            </h3>

            {/* Availability Badge */}
            <div style={{ border: '1px solid var(--ink)', padding: '16px', background: 'var(--surface)' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--red)', fontWeight: 'bold' }}>
                STATUS //
              </span>
              <p
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '15px',
                  fontWeight: 'bold',
                  marginTop: '4px',
                }}
              >
                {data.availability || 'Available for global consulting opportunities'}
              </p>
            </div>

            {/* Email Contact info */}
            {data.email && (
              <div>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '8px',
                    textTransform: 'uppercase',
                    color: 'var(--muted)',
                    display: 'block',
                    marginBottom: '4px',
                  }}
                >
                  Mail Coordinates
                </span>
                <a
                  href={`mailto:${data.email}`}
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: 'var(--ink)',
                    textDecoration: 'none',
                  }}
                >
                  {data.email}
                </a>
              </div>
            )}

            {/* Location */}
            {data.location && (
              <div>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '8px',
                    textTransform: 'uppercase',
                    color: 'var(--muted)',
                    display: 'block',
                    marginBottom: '4px',
                  }}
                >
                  Base Coordinates
                </span>
                <p
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '18px',
                    fontWeight: 'bold',
                  }}
                >
                  {data.location}
                </p>
              </div>
            )}

            {/* Quick Links */}
            <div>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '8px',
                  textTransform: 'uppercase',
                  color: 'var(--muted)',
                  display: 'block',
                  marginBottom: '12px',
                }}
              >
                Network Streams
              </span>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {social.github && (
                  <a
                    href={social.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      color: 'var(--ink)',
                      textDecoration: 'none',
                    }}
                  >
                    § GitHub Archive
                  </a>
                )}
                {social.twitter && (
                  <a
                    href={social.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      color: 'var(--ink)',
                      textDecoration: 'none',
                    }}
                  >
                    § Twitter Feed
                  </a>
                )}
                {social.linkedin && (
                  <a
                    href={social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      color: 'var(--ink)',
                      textDecoration: 'none',
                    }}
                  >
                    § LinkedIn Network
                  </a>
                )}
                {social.whatsapp && (
                  <a
                    href={social.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      color: 'var(--ink)',
                      textDecoration: 'none',
                    }}
                  >
                    § WhatsApp Channel
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
