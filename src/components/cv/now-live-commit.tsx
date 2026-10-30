"use client";

import { useEffect, useState } from "react";
import type { GitHubActivity } from "@/lib/github-activity";
import { formatRelativeTime } from "@/lib/github-activity";
import { useLanguage } from "@/lib/i18n";

export function NowLiveCommit({
  initialActivity,
}: {
  initialActivity: GitHubActivity | null;
}) {
  const { t } = useLanguage();
  const [activity, setActivity] = useState<GitHubActivity | null>(initialActivity);
  const [relativeTime, setRelativeTime] = useState<string>(
    initialActivity ? initialActivity.relativeTime : "",
  );

  // Recalculate relative time on interval so "just now" / "Xm ago" remains fresh
  useEffect(() => {
    if (!activity?.createdAt) return;

    const createdAt = activity.createdAt;
    const timer = setInterval(() => {
      setRelativeTime(formatRelativeTime(createdAt));
    }, 30000);

    return () => clearInterval(timer);
  }, [activity?.createdAt]);

  // Fetch updated public last commit in real-time
  useEffect(() => {
    let active = true;

    async function checkLatest() {
      try {
        const res = await fetch("/api/now", { cache: "no-store" });
        if (!res.ok || !active) return;

        const data = await res.json();
        const latest = data?.activity?.latestCommit;

        if (latest && latest.repo && latest.message && latest.pushedAt && active) {
          const repo: string = latest.repo;
          const repoShort: string =
            latest.repoShort || repo.split("/")[1] || repo;
          const createdAt: string = latest.pushedAt;
          const url: string = latest.url;
          const message: string = latest.message;

          setActivity((prev) => {
            if (
              prev?.url === url &&
              prev?.message === message &&
              prev?.createdAt === createdAt
            ) {
              return prev;
            }
            return {
              type: "push",
              repo,
              repoShort,
              message,
              url,
              createdAt,
              relativeTime: formatRelativeTime(createdAt),
            };
          });
        }
      } catch {
        // Silently preserve current activity on fetch failure
      }
    }

    // Defer initial check slightly so it does not block first paint or trigger cascading renders
    const initialTimer = setTimeout(() => {
      void checkLatest();
    }, 1000);

    // Re-fetch when user returns to the tab or focuses the window
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void checkLatest();
      }
    };

    const handleFocus = () => {
      void checkLatest();
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Periodic poll every 45 seconds for active sessions
    const interval = setInterval(() => {
      void checkLatest();
    }, 45000);

    return () => {
      active = false;
      clearTimeout(initialTimer);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      clearInterval(interval);
    };
  }, []);

  if (!activity) return null;

  // "last commit 58m ago on EduPoint" — a heartbeat, not a changelog, so the
  // commit message stays in the link title rather than on the page.
  return (
    <span className="inline-flex min-w-0 items-center gap-1">
      {t.hero.lastCommit.replace(
        "{time}",
        relativeTime || activity.relativeTime,
      )}
      <a
        href={activity.url}
        target="_blank"
        rel="noopener noreferrer"
        title={`${activity.repo}: ${activity.message}`}
        className="truncate text-ink underline decoration-ink/20 underline-offset-4 transition-colors hover:decoration-accent"
      >
        {activity.repoShort}
      </a>
    </span>
  );
}
