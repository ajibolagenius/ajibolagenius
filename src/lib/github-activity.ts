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
const REVALIDATE_SECONDS = 300; // 5 minutes cache

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

  try {
    const response = await fetch(
      `https://api.github.com/users/${encodeURIComponent(login)}/events/public`,
      {
        headers,
        signal: AbortSignal.timeout(TIMEOUT_MS),
        next: { revalidate: REVALIDATE_SECONDS },
      },
    );

    if (!response.ok) return null;
    const events: GitHubEvent[] = await response.json();
    if (!Array.isArray(events) || events.length === 0) return null;

    // First preference: PushEvent
    const push = events.find((e) => e.type === "PushEvent");
    if (push && push.repo?.name) {
      const repo = push.repo.name;
      const repoShort = repo.split("/")[1] || repo;
      let message = push.payload?.commits?.[0]?.message?.split("\n")[0]?.trim();

      // If commit message isn't in payload, try fetching the specific commit
      if (!message && push.payload?.head) {
        try {
          const commitRes = await fetch(
            `https://api.github.com/repos/${repo}/commits/${push.payload.head}`,
            {
              headers,
              signal: AbortSignal.timeout(COMMIT_TIMEOUT_MS),
              next: { revalidate: 1800 },
            },
          );
          if (commitRes.ok) {
            const commitData = await commitRes.json();
            message = commitData.commit?.message?.split("\n")[0]?.trim();
          }
        } catch {
          // Graceful fallback if commit details fetch fails
        }
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

    // Secondary preference: any other public activity
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
}
