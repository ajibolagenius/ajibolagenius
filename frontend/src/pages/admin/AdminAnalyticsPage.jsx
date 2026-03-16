import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
  CartesianGrid,
} from 'recharts';
import { Button } from '../../components/ui/button';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import { adminEndpoints } from '../../services/adminApi';

const CHART_COLORS = [
  'var(--sungold)',
  'var(--nebula)',
  'var(--stardust)',
  'var(--terracotta)',
  'var(--violet)',
  'var(--bronze)',
];

function buildDailyBuckets(days) {
  const buckets = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    d.setHours(0, 0, 0, 0);
    buckets.push({
      date: d.toISOString().slice(0, 10),
      label: d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      messages: 0,
      subscribers: 0,
    });
  }
  return buckets;
}

function aggregateByDay(messages, subscribers, days) {
  const buckets = buildDailyBuckets(days);
  const keyToIndex = Object.fromEntries(buckets.map((b, i) => [b.date, i]));

  messages.forEach((m) => {
    const date = m.created_at?.slice(0, 10);
    if (keyToIndex[date] !== undefined) buckets[keyToIndex[date]].messages += 1;
  });
  subscribers.forEach((s) => {
    const date = s.created_at?.slice(0, 10);
    if (keyToIndex[date] !== undefined) buckets[keyToIndex[date]].subscribers += 1;
  });

  return buckets;
}

function buildActivityBuckets(days) {
  const buckets = buildDailyBuckets(days);
  buckets.forEach((b) => {
    b.page_view = 0;
    b.blog_post_view = 0;
    b.project_view = 0;
    b.cta_click = 0;
    b.search = 0;
    b.total = 0;
  });
  return buckets;
}

function aggregateActivityByDay(events, days) {
  const buckets = buildActivityBuckets(days);
  const keyToIndex = Object.fromEntries(buckets.map((b, i) => [b.date, i]));

  events.forEach((e) => {
    const date = e.created_at?.slice(0, 10);
    const i = keyToIndex[date];
    if (i === undefined) return;
    const type = e.event_type && typeof e.event_type === 'string' ? e.event_type : 'other';
    if (type in buckets[i]) buckets[i][type] += 1;
  });

  buckets.forEach((b) => {
    b.total = b.page_view + b.blog_post_view + b.project_view + b.cta_click + b.search;
  });
  return buckets;
}

function eventTypeLabel(type) {
  const labels = {
    page_view: 'Page views',
    blog_post_view: 'Blog reads',
    project_view: 'Project views',
    cta_click: 'CTA clicks',
    search: 'Searches',
  };
  return labels[type] || type;
}

function formatEventTime(iso) {
  if (!iso) return '—';
  try {
    const d = new Date(iso);
    return d.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch {
    return '—';
  }
}

function escapeCsvCell(v) {
  if (v == null) return '';
  const s = String(v);
  return s.includes(',') || s.includes('"') || s.includes('\n') ? `"${s.replace(/"/g, '""')}"` : s;
}

function exportActivityCSV(events) {
  const header = 'created_at,event_type,path,payload';
  const rows = events.map((e) => {
    const createdAt = e.created_at || '';
    const type = escapeCsvCell(e.event_type);
    const path = escapeCsvCell(e.path);
    const payload = escapeCsvCell(typeof e.payload === 'object' ? JSON.stringify(e.payload) : e.payload);
    return `${createdAt},${type},${path},${payload}`;
  });
  return [header, ...rows].join('\n');
}

function exportActivityJSON(events) {
  return JSON.stringify(
    events.map((e) => ({
      created_at: e.created_at,
      event_type: e.event_type,
      path: e.path,
      payload: e.payload,
    })),
    null,
    2
  );
}

function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

const CONTENT_KEYS = [
  { key: 'projects', label: 'Projects', accent: 'sungold' },
  { key: 'blog_posts', label: 'Blog posts', accent: 'nebula' },
  { key: 'gallery', label: 'Gallery', accent: 'stardust' },
  { key: 'courses', label: 'Courses', accent: 'terracotta' },
  { key: 'timeline', label: 'Timeline', accent: 'violet' },
  { key: 'testimonials', label: 'Testimonials', accent: 'bronze' },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="px-3 py-2 border border-[var(--border-md)] bg-[var(--surface)] shadow-[var(--shadow-sharp-md)]">
      <p className="font-mono text-[11px] text-[var(--muted)] mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} className="font-mono text-[12px]" style={{ color: p.color }}>
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
};

export default function AdminAnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({});
  const [timeSeries, setTimeSeries] = useState({ messages: [], subscribers: [] });
  const [activityEvents, setActivityEvents] = useState([]);
  const [rangeDays, setRangeDays] = useState(30);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      adminEndpoints.stats().then((s) => s.counts ?? {}),
      adminEndpoints.analyticsTimeSeries(rangeDays),
      adminEndpoints.analyticsEvents(rangeDays).catch(() => []),
    ])
      .then(([countsData, ts, events]) => {
        setCounts(countsData);
        setTimeSeries(ts);
        setActivityEvents(Array.isArray(events) ? events : []);
      })
      .catch(() => {
        setCounts({});
        setTimeSeries({ messages: [], subscribers: [] });
        setActivityEvents([]);
      })
      .finally(() => setLoading(false));
  }, [rangeDays]);

  const engagementData = useMemo(
    () => aggregateByDay(timeSeries.messages, timeSeries.subscribers, rangeDays),
    [timeSeries.messages, timeSeries.subscribers, rangeDays]
  );

  const contentPieData = useMemo(
    () =>
      CONTENT_KEYS.filter(({ key }) => (counts[key] ?? 0) > 0).map(({ key, label }, i) => ({
        name: label,
        value: counts[key] ?? 0,
        fill: CHART_COLORS[i % CHART_COLORS.length],
      })),
    [counts]
  );

  const activityByDay = useMemo(
    () => aggregateActivityByDay(activityEvents, rangeDays),
    [activityEvents, rangeDays]
  );

  const topPaths = useMemo(() => {
    const map = {};
    activityEvents.forEach((e) => {
      const p = e.path || e.payload?.path || e.event_type || '—';
      const key = typeof p === 'string' ? p : JSON.stringify(p);
      map[key] = (map[key] ?? 0) + 1;
    });
    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([path, count]) => ({ path: path.length > 48 ? path.slice(0, 45) + '…' : path, count }));
  }, [activityEvents]);

  const recentActivity = useMemo(() => activityEvents.slice(0, 25), [activityEvents]);

  const totalMessages = timeSeries.messages.length;
  const totalSubscribers = timeSeries.subscribers.length;

  const handleExportCSV = () => {
    if (activityEvents.length === 0) return;
    const csv = exportActivityCSV(activityEvents);
    const filename = `analytics-events-${rangeDays}d-${new Date().toISOString().slice(0, 10)}.csv`;
    downloadFile(csv, filename, 'text/csv;charset=utf-8');
  };

  const handleExportJSON = () => {
    if (activityEvents.length === 0) return;
    const json = exportActivityJSON(activityEvents);
    const filename = `analytics-events-${rangeDays}d-${new Date().toISOString().slice(0, 10)}.json`;
    downloadFile(json, filename, 'application/json');
  };

  if (loading) {
    return (
      <div>
        <AdminPageHeader kicker="Insights" title="Analytics" subtitle="Engagement and content at a glance." />
        <p className="font-mono text-[13px] text-[var(--subtle)]">Loading charts…</p>
      </div>
    );
  }

  return (
    <div>
      <AdminPageHeader
        kicker="Insights"
        title="Analytics"
        subtitle="Engagement and content at a glance. Data from your portfolio."
      />

      {/* Range toggle */}
      <div className="flex flex-wrap items-center gap-2 mb-8">
        <span className="font-mono text-[11px] text-[var(--muted)] uppercase tracking-wider">Range</span>
        {[7, 30].map((d) => (
          <motion.button
            key={d}
            type="button"
            whileTap={{ scale: 0.95 }}
            onClick={() => setRangeDays(d)}
            className={`px-3 py-1.5 font-mono text-[12px] border transition-colors ${
              rangeDays === d
                ? 'bg-[var(--sungold)] text-[var(--void)] border-[var(--sungold)]'
                : 'border-[var(--border-md)] text-[var(--muted)] hover:text-[var(--white)] hover:border-[var(--border-hi)]'
            }`}
          >
            Last {d} days
          </motion.button>
        ))}
      </div>

      {/* Engagement over time */}
      <section className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-px bg-[var(--sungold)]" aria-hidden />
          <h2 className="font-mono text-[11px] tracking-[0.2em] uppercase text-[var(--sungold)]">
            Engagement over time
          </h2>
        </div>
        <div className="border border-[var(--border)] bg-[var(--surface)] p-4 md:p-6 relative">
          <div className="absolute -top-px -left-px w-3 h-3 border-t border-l border-[var(--sungold)] opacity-40" />
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={engagementData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="areaMessages" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--sungold)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="var(--sungold)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="areaSubscribers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--nebula)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="var(--nebula)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={{ fill: 'var(--subtle)', fontSize: 10, fontFamily: 'var(--font-mono)' }}
                  axisLine={{ stroke: 'var(--border)' }}
                  tickLine={{ stroke: 'var(--border)' }}
                  interval="preserveStartEnd"
                />
                <YAxis
                  tick={{ fill: 'var(--subtle)', fontSize: 10, fontFamily: 'var(--font-mono)' }}
                  axisLine={false}
                  tickLine={{ stroke: 'var(--border)' }}
                  allowDecimals={false}
                  width={24}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ fontSize: 11 }}
                  formatter={(value) => <span className="font-mono text-[11px] text-[var(--muted)]">{value}</span>}
                />
                <Area
                  type="monotone"
                  dataKey="messages"
                  name="Messages"
                  stroke="var(--sungold)"
                  fill="url(#areaMessages)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="subscribers"
                  name="Subscribers"
                  stroke="var(--nebula)"
                  fill="url(#areaSubscribers)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-6 mt-4 pt-4 border-t border-[var(--border)]">
            <div>
              <span className="font-display font-bold text-[20px] text-[var(--sungold)] tabular-nums">
                {totalMessages}
              </span>
              <span className="block font-mono text-[10px] uppercase tracking-wider text-[var(--muted)]">
                Messages in period
              </span>
            </div>
            <div>
              <span className="font-display font-bold text-[20px] text-[var(--nebula)] tabular-nums">
                {totalSubscribers}
              </span>
              <span className="block font-mono text-[10px] uppercase tracking-wider text-[var(--muted)]">
                New subscribers
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Content mix */}
      <section className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-px bg-[var(--stardust)]" aria-hidden />
          <h2 className="font-mono text-[11px] tracking-[0.2em] uppercase text-[var(--stardust)]">
            Content mix
          </h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="border border-[var(--border)] bg-[var(--surface)] p-4 md:p-6 relative">
            <div className="absolute -top-px -left-px w-3 h-3 border-t border-l border-[var(--stardust)] opacity-40" />
            <div className="h-[260px] w-full">
              {contentPieData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={contentPieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={56}
                      outerRadius={90}
                      paddingAngle={2}
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent, value }) =>
                        `${name} ${percent != null ? (percent * 100).toFixed(0) + '%' : value}`
                      }
                      labelLine={{ stroke: 'var(--border-md)' }}
                    >
                      {contentPieData.map((entry, i) => (
                        <Cell key={entry.name} fill={entry.fill} stroke="var(--surface)" strokeWidth={2} />
                      ))}
                    </Pie>
                    <Tooltip
                      content={({ active, payload }) =>
                        active && payload?.[0] ? (
                          <div className="px-3 py-2 border border-[var(--border-md)] bg-[var(--surface)] shadow-[var(--shadow-sharp-md)]">
                            <p className="font-mono text-[12px] text-[var(--white)]">{payload[0].name}</p>
                            <p className="font-display font-semibold text-[var(--sungold)]">{payload[0].value} items</p>
                          </div>
                        ) : null
                      }
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-[var(--muted)] font-mono text-[13px]">
                  No content yet
                </div>
              )}
            </div>
          </div>

          <div className="border border-[var(--border)] bg-[var(--surface)] p-4 md:p-6 relative">
            <div className="absolute -top-px -left-px w-3 h-3 border-t border-l border-[var(--nebula)] opacity-40" />
            <div className="h-[260px] w-full">
              {contentPieData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={CONTENT_KEYS.map(({ key, label }) => ({ name: label, count: counts[key] ?? 0 }))} layout="vertical" margin={{ top: 4, right: 8, left: 4, bottom: 4 }}>
                    <XAxis type="number" hide />
                    <YAxis
                      type="category"
                      dataKey="name"
                      tick={{ fill: 'var(--muted)', fontSize: 11, fontFamily: 'var(--font-mono)' }}
                      axisLine={false}
                      tickLine={false}
                      width={90}
                    />
                    <Tooltip
                      content={({ active, payload }) =>
                        active && payload?.[0] ? (
                          <div className="px-3 py-2 border border-[var(--border-md)] bg-[var(--surface)] shadow-[var(--shadow-sharp-md)]">
                            <p className="font-mono text-[12px] text-[var(--white)]">{payload[0].payload.name}</p>
                            <p className="font-display font-semibold text-[var(--sungold)]">{payload[0].value}</p>
                          </div>
                        ) : null
                      }
                    />
                    <Bar dataKey="count" radius={0} maxBarSize={28}>
                      {CONTENT_KEYS.map((_, i) => (
                        <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-[var(--muted)] font-mono text-[13px]">
                  No content yet
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* User activity */}
      <section className="mb-10">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-px bg-[var(--violet)]" aria-hidden />
            <h2 className="font-mono text-[11px] tracking-[0.2em] uppercase text-[var(--violet)]">
              User activity
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-[var(--border)] text-[var(--white)]"
              onClick={handleExportCSV}
              disabled={activityEvents.length === 0}
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-[var(--border)] text-[var(--white)]"
              onClick={handleExportJSON}
              disabled={activityEvents.length === 0}
            >
              <Download className="w-4 h-4 mr-2" />
              Export JSON
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="border border-[var(--border)] bg-[var(--surface)] p-4 md:p-6 relative">
            <div className="absolute -top-px -left-px w-3 h-3 border-t border-l border-[var(--violet)] opacity-40" />
            <p className="font-mono text-[11px] text-[var(--muted)] mb-3">Events over time</p>
            <div className="h-[240px] w-full">
              {activityByDay.some((b) => b.total > 0) ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={activityByDay} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="actPageView" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--sungold)" stopOpacity={0.5} />
                        <stop offset="100%" stopColor="var(--sungold)" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="actBlog" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--nebula)" stopOpacity={0.5} />
                        <stop offset="100%" stopColor="var(--nebula)" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="actProject" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--stardust)" stopOpacity={0.5} />
                        <stop offset="100%" stopColor="var(--stardust)" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="actCta" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--terracotta)" stopOpacity={0.5} />
                        <stop offset="100%" stopColor="var(--terracotta)" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="actSearch" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--violet)" stopOpacity={0.5} />
                        <stop offset="100%" stopColor="var(--violet)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                    <XAxis
                      dataKey="label"
                      tick={{ fill: 'var(--subtle)', fontSize: 10, fontFamily: 'var(--font-mono)' }}
                      axisLine={{ stroke: 'var(--border)' }}
                      tickLine={{ stroke: 'var(--border)' }}
                      interval="preserveStartEnd"
                    />
                    <YAxis
                      tick={{ fill: 'var(--subtle)', fontSize: 10, fontFamily: 'var(--font-mono)' }}
                      axisLine={false}
                      tickLine={{ stroke: 'var(--border)' }}
                      allowDecimals={false}
                      width={24}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      wrapperStyle={{ fontSize: 10 }}
                      formatter={(value) => <span className="font-mono text-[10px] text-[var(--muted)]">{value}</span>}
                    />
                    <Area type="monotone" dataKey="page_view" name={eventTypeLabel('page_view')} stackId="1" stroke="var(--sungold)" fill="url(#actPageView)" strokeWidth={1.5} />
                    <Area type="monotone" dataKey="blog_post_view" name={eventTypeLabel('blog_post_view')} stackId="1" stroke="var(--nebula)" fill="url(#actBlog)" strokeWidth={1.5} />
                    <Area type="monotone" dataKey="project_view" name={eventTypeLabel('project_view')} stackId="1" stroke="var(--stardust)" fill="url(#actProject)" strokeWidth={1.5} />
                    <Area type="monotone" dataKey="cta_click" name={eventTypeLabel('cta_click')} stackId="1" stroke="var(--terracotta)" fill="url(#actCta)" strokeWidth={1.5} />
                    <Area type="monotone" dataKey="search" name={eventTypeLabel('search')} stackId="1" stroke="var(--violet)" fill="url(#actSearch)" strokeWidth={1.5} />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-[var(--muted)] font-mono text-[13px]">
                  No activity yet. Browse the site to generate events.
                </div>
              )}
            </div>
          </div>
          <div className="border border-[var(--border)] bg-[var(--surface)] p-4 md:p-6 relative">
            <div className="absolute -top-px -left-px w-3 h-3 border-t border-l border-[var(--nebula)] opacity-40" />
            <p className="font-mono text-[11px] text-[var(--muted)] mb-3">Top pages & paths</p>
            <div className="h-[240px] w-full">
              {topPaths.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topPaths} layout="vertical" margin={{ top: 4, right: 8, left: 4, bottom: 4 }}>
                    <XAxis type="number" tick={{ fill: 'var(--subtle)', fontSize: 10 }} />
                    <YAxis
                      type="category"
                      dataKey="path"
                      tick={{ fill: 'var(--muted)', fontSize: 10, fontFamily: 'var(--font-mono)' }}
                      axisLine={false}
                      tickLine={false}
                      width={120}
                      tickFormatter={(v) => (v.length > 20 ? v.slice(0, 18) + '…' : v)}
                    />
                    <Tooltip
                      content={({ active, payload }) =>
                        active && payload?.[0] ? (
                          <div className="px-3 py-2 border border-[var(--border-md)] bg-[var(--surface)] shadow-[var(--shadow-sharp-md)]">
                            <p className="font-mono text-[12px] text-[var(--white)] break-all">{payload[0].payload.path}</p>
                            <p className="font-display font-semibold text-[var(--sungold)]">{payload[0].value} events</p>
                          </div>
                        ) : null
                      }
                    />
                    <Bar dataKey="count" radius={0} maxBarSize={20} fill="var(--nebula)" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-[var(--muted)] font-mono text-[13px]">
                  No activity yet
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="border border-[var(--border)] bg-[var(--surface)]">
          <div className="p-4 border-b border-[var(--border)]">
            <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-[var(--violet)]">Recent activity</span>
          </div>
          <div className="divide-y divide-[var(--border)] max-h-[320px] overflow-auto">
            {recentActivity.length === 0 ? (
              <p className="p-4 font-body text-[13px] text-[var(--muted)]">No events in this period.</p>
            ) : (
              recentActivity.map((e) => (
                <div key={e.id} className="p-4 flex flex-wrap items-center gap-x-4 gap-y-1">
                  <span className="font-mono text-[11px] text-[var(--subtle)] shrink-0">{formatEventTime(e.created_at)}</span>
                  <span className="font-mono text-[11px] px-1.5 py-0.5 bg-[var(--elevated)] text-[var(--stardust)]">{e.event_type}</span>
                  <span className="font-body text-[13px] text-[var(--muted)] truncate" title={e.path || e.payload?.path || e.payload?.query}>
                    {e.path || e.payload?.title || e.payload?.query || e.payload?.slug || '—'}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Quick links */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-px bg-[var(--nebula)]" aria-hidden />
          <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-[var(--nebula)]">Details</span>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/admin/messages"
            className="px-4 py-2 border border-[var(--border)] bg-[var(--surface)] font-mono text-[12px] text-[var(--muted)] hover:text-[var(--sungold)] hover:border-[var(--sungold)]/50 transition-colors"
          >
            View messages →
          </Link>
          <Link
            to="/admin/newsletter"
            className="px-4 py-2 border border-[var(--border)] bg-[var(--surface)] font-mono text-[12px] text-[var(--muted)] hover:text-[var(--nebula)] hover:border-[var(--nebula)]/50 transition-colors"
          >
            View subscribers →
          </Link>
          <Link
            to="/admin"
            className="px-4 py-2 border border-[var(--border)] bg-[var(--surface)] font-mono text-[12px] text-[var(--muted)] hover:text-[var(--white)] transition-colors"
          >
            Dashboard
          </Link>
        </div>
      </section>
    </div>
  );
}
