import {
  streamText,
  convertToModelMessages,
  tool,
  type UIMessage,
} from "ai";
import { z } from "zod";
import type { NextRequest } from "next/server";
import { buildAssistantContext } from "@/lib/cv-context";
import { createClient } from "@/lib/supabase/server";
import { getCvData } from "@/lib/cv-data";
import { getLatestGitHubActivity } from "@/lib/github-activity";

export const dynamic = "force-dynamic";

// Same in-process pattern as `submitContactMessage` (src/app/actions.ts) —
// Fluid Compute reuses instances across requests, so this throttles bursts
// from a single IP without external infrastructure. Higher ceiling than the
// contact form's 3/min since a conversation needs multiple turns, but this
// is still an unauthenticated endpoint that costs real money per call.
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 10;
const hits = new Map<string, number[]>();

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  if (recent.length >= RATE_LIMIT_MAX) {
    hits.set(key, recent);
    return true;
  }
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) {
    for (const [k, v] of hits) {
      if (v.every((t) => now - t >= RATE_LIMIT_WINDOW_MS)) hits.delete(k);
    }
  }
  return false;
}

function buildInstructions(context: string): string {
  return `You are the site assistant and portfolio concierge on Ajibola Akelebe's portfolio, answering visitor questions about his engineering, architecture, projects, teaching, and writing.

Speak about Ajibola in the third person ("Ajibola engineered...", "his experience includes..."). Never speak as if you are him.

Answer accurately using the context below — it is the complete, current source of truth about his experience, project case studies, published technical notes, skills, education, certifications, and live activity. Do not invent details that aren't in it.

Capabilities & Best Practices:
1. When a visitor asks to see, recommend, or explore projects (e.g. by tech stack, domain, or role), use the \`recommendProject\` tool to showcase the most relevant project(s).
2. When a visitor asks about his technical writing, articles, or tutorials, use the \`recommendNote\` tool to highlight the relevant note.
3. When a visitor asks what he is working on right now or his current status, use the \`getLiveStatus\` tool or refer to his live teaching at Lagos Data School and recent commits.
4. When a visitor or recruiter pastes a job description (JD), job requirements, or asks if Ajibola is a fit for a specific role (e.g. Senior Frontend, Full Stack Engineer, Mobile/React Native, or Backend), use the \`matchJobDescription\` tool to generate an immediate, evidence-grounded match analysis:
   - Ground evaluation in his verified experience: 3+ years professional software engineering, 5+ years professional design, 10+ years combined as a working professional.
   - Cite his Advanced Diploma in Software Engineering (ADSE).
   - Surface the top 2-3 project proofs (e.g. Zora Market on Apple App Store & Google Play, AfroGraph openCypher/D3 graph application, ALU Exchange microservices, NEGOtivity storefront, Narvo Platform).
   - If the JD requires tools he hasn't shipped (e.g. Shopify, AWS, named ERP/CRM), provide his transferable production equivalents (e.g. Shopify -> custom NEGOtivity storefront; AWS -> Vercel/Cloudflare Workers; ERP -> Zora inventory & multi-vendor system).
5. When mentioning site sections or pages in prose, use clickable markdown links (e.g. [Featured Work](/#featured-work), [Experience](/#experience), [All Projects](/projects), [Notes & Writing](/notes), [Contact Form](/#connect), [CV](/cv)).
6. Keep conversational answers concise (2-4 sentences) and articulate. Emphasize his problem-solving approach and technical depth.
7. If asked about personal contact info, point visitors to the contact form at [Contact Section](/#connect) or his LinkedIn/GitHub profiles.

${context}`;
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  if (isRateLimited(ip)) {
    return new Response("Too many messages. Please try again in a minute.", {
      status: 429,
    });
  }

  const {
    messages,
    currentPath,
  }: { messages: UIMessage[]; currentPath?: string } = await req.json();
  const recent = messages.slice(-12);

  const context = await buildAssistantContext(currentPath);

  const result = streamText({
    model: "openai/gpt-4o-mini",
    instructions: buildInstructions(context),
    messages: await convertToModelMessages(recent),
    maxOutputTokens: 1200,
    tools: {
      recommendProject: tool({
        description:
          "Showcase an interactive project card for a specific project from Ajibola's portfolio.",
        inputSchema: z.object({
          slug: z
            .string()
            .describe(
              "The slug of the project (e.g. 'zora-market', 'anc', 'nego-empire', 'vibe-secure-me', 'afrograph', 'fidia', 'claude-ai-theme')",
            ),
          reason: z
            .string()
            .describe("Brief reason why this project is recommended or relevant"),
        }),
        execute: async ({ slug, reason }) => {
          try {
            const supabase = await createClient();
            const { data } = await supabase
              .from("projects")
              .select(
                "slug, name, category, kind, description, tags, year, live_url, github_url",
              )
              .eq("slug", slug)
              .maybeSingle();

            if (!data) return { found: false, slug, reason };
            return {
              found: true,
              slug: data.slug,
              name: data.name,
              category: data.category,
              kind: data.kind,
              description: data.description,
              tags: (data.tags ?? []).slice(0, 5),
              year: data.year,
              liveUrl: data.live_url || null,
              githubUrl: data.github_url || null,
              reason,
            };
          } catch {
            return { found: false, slug, reason };
          }
        },
      }),

      recommendNote: tool({
        description:
          "Showcase an interactive card for a technical article or note published by Ajibola.",
        inputSchema: z.object({
          slug: z
            .string()
            .describe(
              "The slug of the note (e.g. 'nego-empire-build-story', 'how-this-portfolio-was-built', 'shipping-security-guardrails-and-cleaner-builds')",
            ),
          reason: z
            .string()
            .describe("Brief reason why this article is relevant"),
        }),
        execute: async ({ slug, reason }) => {
          try {
            const supabase = await createClient();
            const { data } = await supabase
              .from("blog_posts")
              .select("slug, title, category, excerpt, tags, read_time")
              .eq("slug", slug)
              .eq("published", true)
              .maybeSingle();

            if (!data) return { found: false, slug, reason };
            return {
              found: true,
              slug: data.slug,
              title: data.title,
              category: data.category,
              excerpt: data.excerpt,
              readTime: data.read_time,
              tags: (data.tags ?? []).slice(0, 4),
              reason,
            };
          } catch {
            return { found: false, slug, reason };
          }
        },
      }),

      getLiveStatus: tool({
        description:
          "Retrieve real-time live activity including Ajibola's teaching role, location, availability, and latest public GitHub commit.",
        inputSchema: z.object({}),
        execute: async () => {
          try {
            const { personalInfo } = await getCvData();
            const activity = await getLatestGitHubActivity(
              personalInfo?.social?.github,
            ).catch(() => null);

            return {
              teaching: "Software Developer Instructor at Lagos Data School",
              location: personalInfo?.location || "Lagos, Nigeria",
              availability:
                personalInfo?.availability || "Available for select advisory & builds",
              latestCommit: activity
                ? {
                    repo: activity.repoShort,
                    message: activity.message,
                    relativeTime: activity.relativeTime,
                    url: activity.url,
                  }
                : null,
            };
          } catch {
            return {
              teaching: "Software Developer Instructor at Lagos Data School",
              location: "Lagos, Nigeria",
              availability: "Available for select advisory & builds",
              latestCommit: null,
            };
          }
        },
      }),

      matchJobDescription: tool({
        description:
          "Analyze and score a job description or role requirements against Ajibola's verified engineering track record, returning match score, verified skills, transferable equivalents, and top proof projects.",
        inputSchema: z.object({
          roleTitle: z
            .string()
            .describe(
              "The role title from the JD (e.g. 'Senior Frontend Engineer', 'Full Stack Engineer', 'Mobile Engineer', 'Staff UI Architect')",
            ),
          matchScore: z
            .number()
            .min(0)
            .max(100)
            .describe("Estimated match percentage (0-100) based on verified requirements overlap"),
          matchedSkills: z
            .array(z.string())
            .describe("Key skills and technologies in the JD that Ajibola has shipped in production"),
          transferableSkills: z
            .array(
              z.object({
                required: z.string(),
                equivalent: z.string(),
              }),
            )
            .optional()
            .describe(
              "Required tools Ajibola hasn't shipped directly mapped to his shipped production parallels",
            ),
          recommendedProjectSlugs: z
            .array(z.string())
            .describe("The top 2 or 3 project slugs providing direct proof for this role"),
          summaryVerdict: z
            .string()
            .describe(
              "A crisp 2-3 sentence assessment of the fit and key engineering differentiator",
            ),
        }),
        execute: async ({
          roleTitle,
          matchScore,
          matchedSkills,
          transferableSkills = [],
          recommendedProjectSlugs,
          summaryVerdict,
        }) => {
          try {
            const supabase = await createClient();
            const { data: projects } = await supabase
              .from("projects")
              .select(
                "slug, name, category, kind, description, tags, year, live_url, github_url",
              )
              .in("slug", recommendedProjectSlugs);

            const projectMap = new Map((projects ?? []).map((p) => [p.slug, p]));
            const orderedProjects = recommendedProjectSlugs
              .map((slug) => projectMap.get(slug))
              .filter(Boolean)
              .map((p) => ({
                slug: p!.slug,
                name: p!.name,
                category: p!.category,
                kind: p!.kind,
                description: p!.description,
                tags: (p!.tags ?? []).slice(0, 4),
                year: p!.year,
                liveUrl: p!.live_url || null,
                githubUrl: p!.github_url || null,
              }));

            return {
              roleTitle,
              matchScore,
              matchedSkills,
              transferableSkills,
              projects: orderedProjects,
              yearsExperience:
                "3+ years professional software engineering · 5+ years design · 10+ years combined",
              education: "Advanced Diploma in Software Engineering (ADSE)",
              summaryVerdict,
            };
          } catch {
            return {
              roleTitle,
              matchScore,
              matchedSkills,
              transferableSkills,
              projects: [],
              yearsExperience:
                "3+ years professional software engineering · 5+ years design · 10+ years combined",
              education: "Advanced Diploma in Software Engineering (ADSE)",
              summaryVerdict,
            };
          }
        },
      }),
    },
  });

  return result.toUIMessageStreamResponse();
}
