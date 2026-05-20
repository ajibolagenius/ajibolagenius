import React, { useState, useEffect } from 'react';
import { Download, Printer } from 'lucide-react';
import { fetchTimeline, fetchEducation, fetchCertifications, fetchSkills } from '../services/api';
import { techStackForCV } from '../data/techStack';
import { cvData } from '../data/mock';
import { usePageMeta } from '../hooks/usePageMeta';
import { buildStaticPageMeta } from '../lib/routeMeta';
import { useRealtimeQuery } from '../hooks/useRealtimeQuery';

const getPdfUrl = () => {
  const envUrl = import.meta.env?.VITE_CV_PDF_URL;
  if (envUrl) return envUrl;
  return cvData && typeof cvData.pdfUrl === 'string' ? cvData.pdfUrl : '#';
};

const CVPage = () => {
  const [revealed, setRevealed] = useState(false);
  const { data: timelineData } = useRealtimeQuery('timeline_entries', fetchTimeline);
  const { data: educationData } = useRealtimeQuery('education_entries', fetchEducation);
  const { data: certificationsData } = useRealtimeQuery('certifications', fetchCertifications);
  const { data: skillsData } = useRealtimeQuery('skills', fetchSkills);

  const skills = Array.isArray(skillsData) && skillsData.length > 0 ? skillsData : [];
  const timeline = Array.isArray(timelineData) && timelineData.length > 0 ? timelineData : [];
  const education = Array.isArray(educationData) && educationData.length > 0 ? educationData : [];
  const certifications =
    Array.isArray(certificationsData) && certificationsData.length > 0
      ? certificationsData.map((c) => (typeof c === 'string' ? c : c.title))
      : [];

  useEffect(() => {
    const timer = setTimeout(() => setRevealed(true), 100);
    return () => clearTimeout(timer);
  }, []);

  usePageMeta(buildStaticPageMeta('/cv'));

  return (
    <div className="page-content">
      {/* Editorial Header */}
      <section style={{ borderBottom: 'var(--rule)', padding: '56px 0 40px' }} className="no-print">
        <div className={`reveal ${revealed ? 'in' : ''}`}>
          <div className="hero-kicker">
            <span className="hero-kicker-dot"></span>
            Curriculum Vitae
          </div>
          <h1 className="hero-title" style={{ fontSize: 'clamp(52px, 8vw, 100px)', lineHeight: 0.9 }}>
            The <em>Resumé</em>
          </h1>
          <div className="hero-rule" style={{ margin: '24px 0 20px' }}>
            <div className="hero-rule-line"></div>
            <span className="hero-rule-label">DON_GENIUS — RECORD</span>
            <div className="hero-rule-line"></div>
          </div>

          <p className="hero-desc" style={{ maxWidth: '620px', marginBottom: '28px' }}>
            A comprehensive index of technical skills, history record, academic certificates, and tooling capabilities.
          </p>

          <div className="flex flex-wrap gap-3">
            <a
              href={getPdfUrl()}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                padding: '12px 24px',
                background: 'var(--red)',
                color: 'var(--cream)',
                textDecoration: 'none',
                fontWeight: 'bold',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Download size={12} /> Download PDF Version
            </a>

            <button
              onClick={() => window.print()}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                padding: '12px 24px',
                border: '1px solid var(--ink)',
                color: 'var(--ink)',
                background: 'transparent',
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Printer size={12} /> Direct Print Sheet
            </button>
          </div>
        </div>
      </section>

      {/* Structured resume sheet */}
      <section style={{ padding: '56px 0 80px' }}>
        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-16">
          {/* Left Column: Timeline, Education, Certificates */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '56px' }}>
            {/* Experience Timeline */}
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
                Experience Timeline
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                {timeline.map((item, idx) => (
                  <div key={idx} style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '24px' }}>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '11px',
                        color: 'var(--red)',
                        fontWeight: 'bold',
                      }}
                    >
                      {item.year || '2024'}
                    </span>
                    <div>
                      <h4
                        style={{
                          fontFamily: 'var(--font-display)',
                          fontSize: '16px',
                          fontWeight: 'bold',
                          marginBottom: '8px',
                        }}
                      >
                        {item.title}
                      </h4>
                      <p className="hero-desc" style={{ fontSize: '13px', lineHeight: 1.6 }}>
                        {item.body}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Education */}
            {education.length > 0 && (
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
                  Academic Credentials
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {education.map((edu, idx) => (
                    <div key={idx} style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '24px' }}>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '11px',
                          color: 'var(--muted)',
                        }}
                      >
                        {edu.year}
                      </span>
                      <div>
                        <h4
                          style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: '15px',
                            fontWeight: 'bold',
                            marginBottom: '4px',
                          }}
                        >
                          {edu.degree}
                        </h4>
                        <p className="hero-desc" style={{ fontSize: '12px' }}>
                          {edu.school}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            {certifications.length > 0 && (
              <div>
                <h3
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    borderBottom: 'var(--rule)',
                    paddingBottom: '12px',
                    marginBottom: '24px',
                    fontWeight: 'bold',
                  }}
                >
                  Certifications
                </h3>

                <ul
                  style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  {certifications.map((cert, idx) => (
                    <li
                      key={idx}
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      <span style={{ width: '4px', height: '4px', background: 'var(--red)' }} />
                      <span>{cert}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right Column: Skills with levels + Stack & Tooling */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '56px' }}>
            {/* Skills */}
            {skills.length > 0 && (
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
                  Core Proficiencies
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {skills.map((skill, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between items-center mb-2">
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink)' }}>
                          {skill.name}
                        </span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)' }}>
                          {skill.level}%
                        </span>
                      </div>
                      <div style={{ height: '4px', background: 'rgba(17,17,17,0.1)', width: '100%' }}>
                        <div
                          style={{
                            height: '100%',
                            background: 'var(--red)',
                            width: `${skill.level}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tools & Stack */}
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
                Development Toolset
              </h3>

              <div className="grid grid-cols-2 gap-3">
                {techStackForCV.map((tool, idx) => (
                  <div
                    key={idx}
                    style={{
                      border: '1px solid var(--ink)',
                      padding: '16px',
                      background: 'var(--surface)',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        display: 'block',
                        marginBottom: '4px',
                      }}
                    >
                      {tool.name}
                    </span>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '8px',
                        textTransform: 'uppercase',
                        color: 'var(--muted)',
                      }}
                    >
                      {tool.category}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CVPage;
