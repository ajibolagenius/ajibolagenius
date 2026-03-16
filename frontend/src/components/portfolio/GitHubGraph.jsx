import React, { useEffect, useState } from 'react';

const COLORS = [
  'var(--surface)',          // level 0 — no contributions (lighter than elevated)
  'rgba(91,79,216,0.35)',    // level 1
  'rgba(91,79,216,0.55)',    // level 2
  'rgba(139,114,240,0.8)',   // level 3
  'var(--nebula)',            // level 4 — max
];

const GitHubGraph = ({ username = 'ajibolagenius' }) => {
  const [weeks, setWeeks] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchContributions = async () => {
      try {
        const res = await fetch(
          `https://github-contributions-api.jogruber.de/v4/${username}?y=last`
        );
        if (!res.ok) throw new Error('API error');
        const json = await res.json();

        setTotal(json.total?.lastYear ?? json.total?.['lastYear'] ?? 0);

        // The API returns { contributions: [ { date, count, level } ] }
        const contributions = json.contributions || [];

        // Sort by date ascending (oldest → newest) so the latest is at the right end
        contributions.sort((a, b) => new Date(a.date) - new Date(b.date));

        // Group into weeks (columns of 7 days)
        const grouped = [];
        let currentWeek = [];
        contributions.forEach((day) => {
          currentWeek.push(day);
          if (currentWeek.length === 7) {
            grouped.push(currentWeek);
            currentWeek = [];
          }
        });
        if (currentWeek.length > 0) grouped.push(currentWeek);

        // Keep only the most recent 52 weeks (1 year) so the graph
        // always ends with today's data on the right edge
        const MAX_WEEKS = 52;
        const trimmed = grouped.slice(-MAX_WEEKS);

        setWeeks(trimmed);
      } catch (e) {
        console.warn('[GitHubGraph]', e.message);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchContributions();
  }, [username]);

  if (error || (loading === false && weeks.length === 0)) return null;

  return (
    <div className="mt-10 w-full">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-5 h-px bg-[var(--stardust)]" />
        <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-[var(--stardust)]">
          GitHub Activity
        </span>
      </div>

      {loading ? (
        <div className="h-[80px] md:h-[100px] bg-[var(--elevated)] animate-pulse rounded-none border border-[var(--border)]" />
      ) : (
        <>
          <div className="overflow-x-auto overflow-y-hidden pb-2 w-full" style={{ WebkitOverflowScrolling: 'touch' }}>
            <div className="flex gap-[2px] md:gap-[3px] min-w-0" style={{ minWidth: 572 }}>
              {weeks.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-[2px] md:gap-[3px] flex-1 min-w-[9px] md:min-w-0">
                  {week.map((day, di) => (
                    <div
                      key={di}
                      title={`${day.date}: ${day.count} contribution${day.count !== 1 ? 's' : ''}`}
                      className="w-full aspect-square min-h-[9px] md:min-h-0 transition-colors duration-150 hover:ring-1 hover:ring-[var(--violet)] cursor-default"
                      style={{
                        background: COLORS[day.level] || COLORS[0],
                      }}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mt-2">
            <span className="font-mono text-[11px] text-[var(--subtle)]">
              {total.toLocaleString()} contributions in the last year
            </span>
            <a
              href={`https://github.com/${username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[11px] tracking-[0.08em] text-[var(--stardust)] hover:text-[var(--sungold)] transition-colors no-underline"
            >
              View on GitHub →
            </a>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-1.5 md:gap-2 mt-2 flex-wrap">
            <span className="font-mono text-[10px] text-[var(--subtle)]">Less</span>
            {COLORS.map((c, i) => (
              <div
                key={i}
                className="w-2 h-2 md:w-[10px] md:h-[10px] flex-shrink-0"
                style={{ background: c }}
              />
            ))}
            <span className="font-mono text-[10px] text-[var(--subtle)]">More</span>
          </div>
        </>
      )}
    </div>
  );
};

export default GitHubGraph;
