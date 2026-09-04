import { NextResponse } from "next/server";
import { getCvData } from "@/lib/cv-data";
import {
  getContributions,
  githubUsername,
} from "@/lib/github-contributions";
import { getLatestGitHubActivity } from "@/lib/github-activity";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { personalInfo, experience } = await getCvData();

    const activeJob =
      experience.find((e) => e.end_date.toLowerCase() === "present") ||
      experience[0] ||
      null;

    const githubUrl = personalInfo?.social?.github;
    const [calendar, activity] = await Promise.all([
      getContributions(githubUrl),
      getLatestGitHubActivity(githubUrl),
    ]);

    const payload = {
      now: {
        status: "active",
        headline: activeJob
          ? `${activeJob.role_title} at ${activeJob.company}`
          : "Software Engineer",
        teaching: activeJob
          ? {
              role: activeJob.role_title,
              institution: activeJob.company,
              type: activeJob.employment_type,
              since: activeJob.start_date,
            }
          : null,
        location: personalInfo?.location || "Lagos, Nigeria",
        timezone: "Africa/Lagos",
        availability:
          personalInfo?.availability || "Available for select advisory & builds",
      },
      activity: {
        latestCommit: activity
          ? {
              repo: activity.repo,
              repoShort: activity.repoShort,
              message: activity.message,
              url: activity.url,
              pushedAt: activity.createdAt,
              relativeTime: activity.relativeTime,
            }
          : null,
        contributions: {
          username: githubUsername(githubUrl),
          totalLastYear: calendar?.total ?? null,
          profileUrl: githubUrl,
        },
      },
      system: {
        runtime: "Next.js 16 (App Router)",
        framework: "React 19",
        deployedCommit: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) || null,
        timestamp: new Date().toISOString(),
      },
    };

    return NextResponse.json(payload, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to retrieve live activity data" },
      { status: 500 },
    );
  }
}
