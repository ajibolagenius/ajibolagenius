import { githubUsername } from "@/lib/github-contributions";

export interface GitHubActivity {
  type: "push" | "create" | "fork" | "other";
  repo: string;
  repoShort: string;
  message: string;
  url: string;
  createdAt: string;
  relativeTime: string;
}

const TIMEOUT_MS = 5000;
const COMMIT_TIMEOUT_MS = 3000;
const REVALIDATE_SECONDS = 60; // 1 minute real-time cache

export function formatRelativeTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    if (diffMs < 0) return "just now";

    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHour / 24);

    if (diffDays > 30) {
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    }
    if (diffDays > 1) return `${diffDays}d ago`;
    if (diffDays === 1) return "yesterday";
    if (diffHour >= 1) return `${diffHour}h ago`;
    if (diffMin >= 1) return `${diffMin}m ago`;
    return "just now";
  } catch {
    return "recently";
  }
}

interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  pushed_at?: string | null;
  html_url: string;
}

interface GitHubCommitResponse {
  sha: string;
  html_url?: string;
  commit?: {
    message?: string;
    author?: {
      date?: string;
    };
    committer?: {
      date?: string;
    };
  };
}

interface GitHubEvent {
  id: string;
  type: string;
  created_at: string;
  repo: {
    id: number;
    name: string;
    url: string;
  };
  payload?: {
    head?: string;
    commits?: Array<{
      sha: string;
      message: string;
      url: string;
    }>;
    action?: string;
  };
}

/**
 * Retrieves the user's latest public commit across repositories in real-time.
 *
 * Checks both recently pushed public repositories (which update immediately upon push)
 * and the public events feed (which captures contributions to external/org repositories),
 * then selects whichever is most recent.
 */
export async function getLatestGitHubActivity(
  usernameOrUrl?: string | null,
): Promise<GitHubActivity | null> {
  const login = githubUsername(usernameOrUrl);
  if (!login) return null;

  const headers: Record<string, string> = {
    "User-Agent":
      "Mozilla/5.0 (compatible; ajibola-portfolio-live-activity/1.0; +https://github.com)",
    Accept: "application/vnd.github+json",
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  // 1. Fetch most recently pushed public repositories
  const fetchRepoActivity = async (): Promise<GitHubActivity | null> => {
    try {
      const reposRes = await fetch(
        `https://api.github.com/users/${encodeURIComponent(login)}/repos?sort=pushed&direction=desc&per_page=3`,
        {
          headers,
          signal: AbortSignal.timeout(TIMEOUT_MS),
          next: { revalidate: REVALIDATE_SECONDS },
        },
      );
      if (!reposRes.ok) return null;
      const repos: GitHubRepo[] = await reposRes.json();
      if (!Array.isArray(repos) || repos.length === 0) return null;

      for (const repo of repos) {
        if (!repo.pushed_at) continue;

        // Try getting latest commit by author first
        let commitsRes = await fetch(
          `https://api.github.com/repos/${repo.full_name}/commits?author=${encodeURIComponent(login)}&per_page=1`,
          {
            headers,
            signal: AbortSignal.timeout(COMMIT_TIMEOUT_MS),
            next: { revalidate: REVALIDATE_SECONDS },
          },
        );

        let commits: GitHubCommitResponse[] = commitsRes.ok ? await commitsRes.json() : [];

        // Fallback to top branch commit if author-filtered query returned empty
        if (!Array.isArray(commits) || commits.length === 0) {
          commitsRes = await fetch(
            `https://api.github.com/repos/${repo.full_name}/commits?per_page=1`,
            {
              headers,
              signal: AbortSignal.timeout(COMMIT_TIMEOUT_MS),
              next: { revalidate: REVALIDATE_SECONDS },
            },
          );
          commits = commitsRes.ok ? await commitsRes.json() : [];
        }

        if (Array.isArray(commits) && commits.length > 0) {
          const c = commits[0];
          const message =
            c.commit?.message?.split("\n")[0]?.trim() || "Pushed updates";
          const date =
            c.commit?.author?.date ||
            c.commit?.committer?.date ||
            repo.pushed_at;

          return {
            type: "push",
            repo: repo.full_name,
            repoShort: repo.name,
            message,
            url:
              c.html_url ||
              `https://github.com/${repo.full_name}/commit/${c.sha}`,
            createdAt: date,
            relativeTime: formatRelativeTime(date),
          };
        }
      }
      return null;
    } catch {
      return null;
    }
  };

  // 2. Fetch public events feed (for external org/repo contributions and events)
  const fetchEventActivity = async (): Promise<GitHubActivity | null> => {
    try {
      const eventsRes = await fetch(
        `https://api.github.com/users/${encodeURIComponent(login)}/events/public`,
        {
          headers,
          signal: AbortSignal.timeout(TIMEOUT_MS),
          next: { revalidate: REVALIDATE_SECONDS },
        },
      );
      if (!eventsRes.ok) return null;
      const events: GitHubEvent[] = await eventsRes.json();
      if (!Array.isArray(events) || events.length === 0) return null;

      const push = events.find((e) => e.type === "PushEvent");
      if (push && push.repo?.name) {
        const repo = push.repo.name;
        const repoShort = repo.split("/")[1] || repo;
        const commitsList = push.payload?.commits;
        let message = commitsList && commitsList.length > 0
          ? commitsList[commitsList.length - 1]?.message?.split("\n")[0]?.trim()
          : undefined;

        if (!message && push.payload?.head) {
          try {
            const commitRes = await fetch(
              `https://api.github.com/repos/${repo}/commits/${push.payload.head}`,
              {
                headers,
                signal: AbortSignal.timeout(COMMIT_TIMEOUT_MS),
                next: { revalidate: REVALIDATE_SECONDS },
              },
            );
            if (commitRes.ok) {
              const commitData = await commitRes.json();
              message = commitData.commit?.message?.split("\n")[0]?.trim();
            }
          } catch {}
        }

        const commitSha = push.payload?.head;
        const url = commitSha
          ? `https://github.com/${repo}/commit/${commitSha}`
          : `https://github.com/${repo}`;

        return {
          type: "push",
          repo,
          repoShort,
          message: message || "Pushed updates",
          url,
          createdAt: push.created_at,
          relativeTime: formatRelativeTime(push.created_at),
        };
      }

      // Fallback: Other public events (CreateEvent, ForkEvent, WatchEvent)
      const otherEvent = events[0];
      if (otherEvent && otherEvent.repo?.name) {
        const repo = otherEvent.repo.name;
        const repoShort = repo.split("/")[1] || repo;
        let message = "Active contribution";
        if (otherEvent.type === "CreateEvent") {
          message = "Created repository";
        } else if (otherEvent.type === "ForkEvent") {
          message = "Forked repository";
        } else if (otherEvent.type === "WatchEvent") {
          message = "Starred repository";
        }

        return {
          type: "other",
          repo,
          repoShort,
          message,
          url: `https://github.com/${repo}`,
          createdAt: otherEvent.created_at,
          relativeTime: formatRelativeTime(otherEvent.created_at),
        };
      }
      return null;
    } catch {
      return null;
    }
  };

  try {
    const [repoActivity, eventActivity] = await Promise.all([
      fetchRepoActivity(),
      fetchEventActivity(),
    ]);

    if (repoActivity && eventActivity) {
      const repoTime = new Date(repoActivity.createdAt).getTime();
      const eventTime = new Date(eventActivity.createdAt).getTime();
      return repoTime >= eventTime ? repoActivity : eventActivity;
    }

    return repoActivity || eventActivity;
  } catch {
    return null;
  }
}
