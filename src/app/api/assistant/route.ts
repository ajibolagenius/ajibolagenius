import { streamText, convertToModelMessages, type UIMessage } from "ai";
import type { NextRequest } from "next/server";
import { buildAssistantContext } from "@/lib/cv-context";

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
  return `You are the site assistant on Ajibola Akelebe's portfolio, answering visitor questions about his work.

Speak about Ajibola in the third person ("Ajibola built...", "his experience includes..."). Never speak as if you are him.

Answer only using the context below — it is the complete, current source of truth about his experience, projects, skills, education, certifications, and languages. Do not invent details that aren't in it.

Keep answers short: 2-4 sentences of plain prose, no markdown tables. If a question can't be answered from the context (unrelated topics, requests to write code, requests for personal contact details, anything not covered below), politely decline and point the visitor to the contact form on the site instead.

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

  const { messages }: { messages: UIMessage[] } = await req.json();
  const recent = messages.slice(-12);

  const context = await buildAssistantContext();

  const result = streamText({
    // Free-tier AI Gateway accounts don't have access to Anthropic/most
    // Google/Meta models yet (needs a paid credits top-up) — gpt-4o-mini is
    // confirmed working without one and is plenty for bounded-context Q&A.
    model: "openai/gpt-4o-mini",
    instructions: buildInstructions(context),
    messages: await convertToModelMessages(recent),
    maxOutputTokens: 600,
  });

  return result.toUIMessageStreamResponse();
}
