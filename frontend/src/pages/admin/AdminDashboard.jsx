import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import { adminEndpoints } from '../../services/adminApi';

const statCards = [
  { key: 'projects', label: 'Projects', path: '/admin/projects', accent: 'sungold' },
  { key: 'blog_posts', label: 'Blog posts', path: '/admin/blog', accent: 'nebula' },
  { key: 'gallery', label: 'Gallery', path: '/admin/gallery', accent: 'stardust' },
  { key: 'courses', label: 'Courses', path: '/admin/courses', accent: 'terracotta' },
  { key: 'timeline', label: 'Timeline', path: '/admin/timeline', accent: 'sungold' },
  { key: 'testimonials', label: 'Testimonials', path: '/admin/testimonials', accent: 'nebula' },
  { key: 'contact_messages', label: 'Messages', path: '/admin/messages', accent: 'stardust' },
  { key: 'newsletter_subscribers', label: 'Subscribers', path: '/admin/newsletter', accent: 'terracotta' },
  { key: 'course_waitlist', label: 'Waitlist', path: '/admin/waitlist', accent: 'nebula' },
];

const quickLinks = [
  { path: '/admin/projects', label: 'Projects', desc: 'Work and case studies' },
  { path: '/admin/blog', label: 'Blog', desc: 'Articles and posts' },
  { path: '/admin/gallery', label: 'Gallery', desc: 'Visual archive' },
  { path: '/admin/courses', label: 'Courses', desc: 'Teach section' },
  { path: '/admin/timeline', label: 'Timeline', desc: 'CV entries' },
  { path: '/admin/testimonials', label: 'Testimonials', desc: 'Student quotes' },
  { path: '/admin/personal-info', label: 'Personal Info', desc: 'Hero & contact' },
  { path: '/admin/messages', label: 'Messages', desc: 'Contact form' },
  { path: '/admin/newsletter', label: 'Newsletter', desc: 'Subscribers' },
  { path: '/admin/waitlist', label: 'Waitlist', desc: 'Course waitlist' },
];


function formatDate(iso) {
  if (!iso) return '—';
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return '—';
  }
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminEndpoints
      .stats()
      .then(setStats)
      .catch(() => setStats({ counts: {}, recent_messages: [], recent_subscribers: [] }))
      .finally(() => setLoading(false));
  }, []);

  const counts = stats?.counts ?? {};
  const recentMessages = stats?.recent_messages ?? [];
  const recentSubscribers = stats?.recent_subscribers ?? [];

  return (
    <div>
      <AdminPageHeader
        kicker="Overview"
        title="Dashboard"
        subtitle="Analytics and quick access to manage your portfolio content."
      />

      {loading ? (
        <p className="font-mono text-[13px] text-[var(--subtle)]">Loading analytics…</p>
      ) : (
        <>
          {/* Stat cards — design system: elevated bg, sharp, left accent */}
          <section className="mb-10">
            <h2 className="sr-only">Counts</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
              {statCards.map(({ key, label, path, accent }) => (
                <Link
                  key={key}
                  to={path}
                  className="block p-4 bg-[var(--elevated)] border border-[var(--border)] border-l-4 transition-all duration-200 hover:border-[var(--border-hi)] hover:shadow-[var(--shadow-sharp-md)] hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sungold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--void)]"
                  style={{ borderLeftColor: `var(--${accent})` }}
                >
                  <span className="font-display font-extrabold text-[28px] leading-none text-[var(--white)] tabular-nums">
                    {counts[key] ?? 0}
                  </span>
                  <span className="block mt-1 font-mono text-[11px] tracking-[0.08em] uppercase text-[var(--muted)]">
                    {label}
                  </span>
                </Link>
              ))}
            </div>
          </section>

          {/* Quick links */}
          <section className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-px bg-[var(--stardust)]" aria-hidden />
              <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-[var(--stardust)]">
                Quick actions
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {quickLinks.map(({ path, label, desc }) => (
                <Link
                  key={path}
                  to={path}
                  className="block p-4 border border-[var(--border)] bg-[var(--surface)] transition-all duration-200 hover:border-[rgba(232,160,32,0.25)] hover:shadow-[var(--shadow-sharp-lg)] hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sungold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--void)]"
                >
                  <span className="font-display font-semibold text-[15px] text-[var(--white)]">
                    {label}
                  </span>
                  <p className="font-body text-[13px] text-[var(--muted)] mt-1">{desc}</p>
                </Link>
              ))}
              <Link
                to="/admin/analytics"
                className="block p-4 border border-[var(--border)] bg-[var(--surface)] transition-all duration-200 hover:border-[rgba(232,160,32,0.25)] hover:shadow-[var(--shadow-sharp-lg)] hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sungold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--void)]"
              >
                <span className="font-display font-semibold text-[15px] text-[var(--white)]">Analytics</span>
                <p className="font-body text-[13px] text-[var(--muted)] mt-1">Charts & engagement</p>
              </Link>
            </div>
          </section>

          {/* Recent activity */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="border border-[var(--border)] bg-[var(--surface)]">
              <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-px bg-[var(--sungold)]" aria-hidden />
                  <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-[var(--sungold)]">
                    Recent messages
                  </span>
                </div>
                <Link
                  to="/admin/messages"
                  className="font-mono text-[11px] text-[var(--muted)] hover:text-[var(--sungold)] transition-colors"
                >
                  View all →
                </Link>
              </div>
              <div className="divide-y divide-[var(--border)]">
                {recentMessages.length === 0 ? (
                  <p className="p-4 font-body text-[13px] text-[var(--muted)]">No messages yet.</p>
                ) : (
                  recentMessages.map((m) => (
                    <div key={m.id} className="p-4">
                      <p className="font-body text-[14px] text-[var(--white)]">{m.name}</p>
                      <p className="font-body text-[13px] text-[var(--muted)] mt-0.5 line-clamp-1">
                        {m.subject || m.message}
                      </p>
                      <p className="font-mono text-[11px] text-[var(--subtle)] mt-1">
                        {formatDate(m.created_at)}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="border border-[var(--border)] bg-[var(--surface)]">
              <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-px bg-[var(--nebula)]" aria-hidden />
                  <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-[var(--nebula)]">
                    Recent subscribers
                  </span>
                </div>
                <Link
                  to="/admin/newsletter"
                  className="font-mono text-[11px] text-[var(--muted)] hover:text-[var(--nebula)] transition-colors"
                >
                  View all →
                </Link>
              </div>
              <div className="divide-y divide-[var(--border)]">
                {recentSubscribers.length === 0 ? (
                  <p className="p-4 font-body text-[13px] text-[var(--muted)]">No subscribers yet.</p>
                ) : (
                  recentSubscribers.map((s) => (
                    <div key={s.id} className="p-4 flex items-center justify-between">
                      <span className="font-mono text-[13px] text-[var(--white)]">{s.email}</span>
                      <span className="font-mono text-[11px] text-[var(--subtle)]">
                        {formatDate(s.created_at)}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
