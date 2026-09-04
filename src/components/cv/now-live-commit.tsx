"use client";

import { useEffect, useState } from "react";
import { GitCommit, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import type { GitHubActivity } from "@/lib/github-activity";
import { formatRelativeTime } from "@/lib/github-activity";

interface NowLiveCommitProps {
  initialActivity: GitHubActivity | null;
  availability?: string | null;
}

export function NowLiveCommit({
  initialActivity,
  availability,
}: NowLiveCommitProps) {
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

  if (!activity) {
    return (
      <div className="flex items-center gap-1.5 text-ink/50">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent/60" />
        <span className="truncate">
          {availability || "Available for select advisory & builds"}
        </span>
      </div>
    );
  }

  return (
    <div className="flex min-w-0 max-w-[260px] sm:max-w-[320px] items-center gap-1.5 truncate">
      <GitCommit
        size={14}
        weight="bold"
        className="shrink-0 text-accent"
        aria-hidden
      />
      <a
        href={activity.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group inline-flex min-w-0 items-center gap-1 truncate text-ink/70 transition-colors hover:text-accent"
        title={`${activity.repo}: ${activity.message}`}
      >
        <span className="font-medium text-ink group-hover:text-accent">
          {activity.repoShort}
        </span>
        <span className="text-ink/40">:</span>
        <span className="truncate">{activity.message}</span>
        <ArrowUpRight
          size={11}
          className="shrink-0 text-ink/40 opacity-70 group-hover:text-accent"
        />
      </a>
      <span className="shrink-0 text-[10px] text-ink/40">
        ({relativeTime || activity.relativeTime})
      </span>
    </div>
  );
}
