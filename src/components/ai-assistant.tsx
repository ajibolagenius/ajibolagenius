"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, isToolUIPart } from "ai";
import {
  ChatCircleDots,
  PaperPlaneRight,
  Spinner,
  X,
  Sparkle,
  ArrowClockwise,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  GitCommit,
} from "@phosphor-icons/react/dist/ssr";
import { useFocusTrap } from "@/hooks/use-focus-trap";

interface RecommendProjectOutput {
  found: boolean;
  slug: string;
  name: string;
  category: string;
  kind: string;
  description: string;
  tags?: string[];
  year?: string;
  liveUrl?: string | null;
  githubUrl?: string | null;
  reason?: string;
}

interface RecommendNoteOutput {
  found: boolean;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  readTime?: string;
  tags?: string[];
  reason?: string;
}

interface LiveStatusOutput {
  teaching: string;
  location: string;
  availability: string;
  latestCommit?: {
    repo: string;
    message: string;
    relativeTime: string;
    url: string;
  } | null;
}

const STARTER_PROMPTS = [
  "What tech stack & architecture does Ajibola specialize in?",
  "Showcase featured client projects & case studies",
  "What is Ajibola working on right now?",
  "What has he written about marketplaces & engineering?",
  "How can we collaborate or hire him for advisory/builds?",
];

/**
 * Lightweight, safe markdown inline parser for assistant messages.
 * Converts [Label](url) into Next.js Links or external links.
 */
function renderMarkdownText(text: string): ReactNode[] {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = linkRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.substring(lastIndex, match.index));
    }
    const [, label, url] = match;
    const isInternal = url.startsWith("/") || url.startsWith("#");

    if (isInternal) {
      nodes.push(
        <Link
          key={`${match.index}-${url}`}
          href={url}
          className="font-medium text-accent underline decoration-accent/30 underline-offset-2 transition-colors hover:decoration-accent"
        >
          {label}
        </Link>,
      );
    } else {
      nodes.push(
        <a
          key={`${match.index}-${url}`}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-0.5 font-medium text-accent underline decoration-accent/30 underline-offset-2 transition-colors hover:decoration-accent"
        >
          <span>{label}</span>
          <ArrowUpRight size={10} className="inline opacity-70" aria-hidden />
        </a>,
      );
    }
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    nodes.push(text.substring(lastIndex));
  }

  return nodes;
}

export function AiAssistant() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const panelRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setIsOpen(false), []);

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/assistant",
        body: { currentPath: pathname },
      }),
    [pathname],
  );

  const { messages, sendMessage, status, setMessages } = useChat({
    transport,
  });

  useFocusTrap(panelRef, isOpen, close);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener("open-ai-assistant", handleOpen);
    return () => window.removeEventListener("open-ai-assistant", handleOpen);
  }, []);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages]);

  // Derive page context badge
  const contextLabel = useMemo(() => {
    if (!pathname || pathname === "/") return null;
    if (pathname.startsWith("/projects/")) {
      const slug = pathname.replace("/projects/", "");
      return `Viewing: ${slug}`;
    }
    if (pathname.startsWith("/notes/")) {
      const slug = pathname.replace("/notes/", "");
      return `Viewing Note: ${slug}`;
    }
    if (pathname === "/projects") return "Browsing: All Projects";
    if (pathname === "/notes") return "Browsing: Notes & Articles";
    if (pathname === "/cv") return "Viewing: Printable CV";
    return null;
  }, [pathname]);

  if (pathname?.startsWith("/admin")) return null;

  const isBusy = status === "submitted" || status === "streaming";

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const text = input.trim();
    if (!text || isBusy) return;
    sendMessage({ text });
    setInput("");
  }

  function handleStarterClick(prompt: string) {
    if (isBusy) return;
    sendMessage({ text: prompt });
  }

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 print:hidden">
      {isOpen && (
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Ask about Ajibola's work"
          className="flex h-[min(75vh,560px)] w-[min(380px,calc(100vw-2rem))] flex-col rounded-xl border border-ink/10 bg-cream shadow-2xl overflow-hidden backdrop-blur-md"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-ink/10 bg-panel/30 px-4 py-3">
            <div className="flex items-center gap-2 min-w-0">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                <Sparkle size={15} weight="fill" />
              </div>
              <div className="min-w-0">
                <p className="text-body-s font-semibold leading-none text-ink">
                  Portfolio Concierge
                </p>
                {contextLabel ? (
                  <p className="mt-0.5 truncate font-mono text-[10px] text-accent">
                    {contextLabel}
                  </p>
                ) : (
                  <p className="mt-0.5 font-mono text-[10px] text-ink/40">
                    Grounded in real portfolio data
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1">
              {messages.length > 0 && (
                <button
                  type="button"
                  onClick={() => setMessages([])}
                  aria-label="Reset conversation"
                  title="Clear conversation"
                  className="rounded p-1 text-ink/40 transition-colors hover:bg-ink/5 hover:text-ink"
                >
                  <ArrowClockwise size={15} />
                </button>
              )}
              <button
                type="button"
                onClick={close}
                aria-label="Close chat"
                className="rounded p-1 text-ink/40 transition-colors hover:bg-ink/5 hover:text-ink"
              >
                <X size={16} weight="bold" />
              </button>
            </div>
          </div>

          {/* Messages list */}
          <div
            ref={listRef}
            className="flex flex-1 flex-col gap-3.5 overflow-y-auto px-4 py-4"
          >
            {messages.length === 0 && (
              <div className="flex flex-col gap-3">
                <div className="rounded-lg border border-ink/8 bg-panel/40 p-3 text-body-xs">
                  <p className="font-medium text-ink">
                    Ask me anything about Ajibola&apos;s engineering, architecture, or writing.
                  </p>
                  <p className="mt-1 text-ink/60">
                    Answers are strictly grounded in verified project case studies, live activity, and technical articles.
                  </p>
                </div>

                <div className="flex flex-col gap-1.5 pt-1">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-ink/40">
                    Suggested Questions
                  </span>
                  {STARTER_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => handleStarterClick(prompt)}
                      disabled={isBusy}
                      className="group flex items-center justify-between rounded-lg border border-ink/8 bg-panel/20 px-3 py-2 text-left text-body-xs text-ink/80 transition-colors hover:border-accent hover:bg-accent/5 hover:text-accent disabled:opacity-60"
                    >
                      <span className="truncate">{prompt}</span>
                      <ArrowRight
                        size={12}
                        className="shrink-0 text-ink/30 transition-transform group-hover:translate-x-0.5 group-hover:text-accent"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={
                  message.role === "user"
                    ? "ml-auto max-w-[85%] rounded-lg bg-ink px-3 py-2 text-body-s text-cream shadow-xs"
                    : "max-w-[90%] text-body-s text-ink/90 flex flex-col gap-2"
                }
              >
                {message.parts.map((part, i) => {
                  if (part.type === "text") {
                    return (
                      <div key={i} className="whitespace-pre-wrap leading-relaxed">
                        {renderMarkdownText(part.text)}
                      </div>
                    );
                  }

                  // Render tool results if present
                  if (isToolUIPart(part)) {
                    const toolPart = part as {
                      type: string;
                      state: string;
                      output?: unknown;
                    };

                    if (
                      toolPart.type === "tool-recommendProject" &&
                      toolPart.state === "output-available" &&
                      toolPart.output &&
                      typeof toolPart.output === "object"
                    ) {
                      const proj = toolPart.output as RecommendProjectOutput;
                      if (!proj.found) return null;

                      return (
                        <div
                          key={i}
                          className="my-1.5 flex flex-col gap-2 rounded-lg border border-accent/25 bg-panel/80 p-3 shadow-xs"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <span className="inline-block font-mono text-[10px] uppercase font-semibold tracking-wider text-accent">
                                {proj.category}
                              </span>
                              <h4 className="text-body-s font-semibold text-ink truncate">
                                {proj.name}
                              </h4>
                            </div>
                            {proj.year && (
                              <span className="shrink-0 font-mono text-[10px] text-ink/40">
                                {proj.year}
                              </span>
                            )}
                          </div>

                          <p className="text-body-xs text-ink/70 line-clamp-2">
                            {proj.description}
                          </p>

                          {proj.tags && proj.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {proj.tags.slice(0, 4).map((tag) => (
                                <span
                                  key={tag}
                                  className="rounded bg-ink/5 px-1.5 py-0.5 font-mono text-[10px] text-ink/60"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}

                          <div className="mt-1 flex items-center gap-2 border-t border-ink/8 pt-1.5">
                            <Link
                              href={`/projects/${proj.slug}`}
                              className="inline-flex items-center gap-1 font-mono text-body-xs font-medium text-accent hover:underline"
                            >
                              <span>View Case Study</span>
                              <ArrowRight size={11} />
                            </Link>
                            {proj.liveUrl && proj.liveUrl !== "#" && (
                              <a
                                href={proj.liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="ml-auto inline-flex items-center gap-0.5 font-mono text-body-xs text-ink/50 hover:text-ink hover:underline"
                              >
                                <span>Live Site</span>
                                <ArrowUpRight size={10} />
                              </a>
                            )}
                          </div>
                        </div>
                      );
                    }

                    if (
                      toolPart.type === "tool-recommendNote" &&
                      toolPart.state === "output-available" &&
                      toolPart.output &&
                      typeof toolPart.output === "object"
                    ) {
                      const note = toolPart.output as RecommendNoteOutput;
                      if (!note.found) return null;

                      return (
                        <div
                          key={i}
                          className="my-1.5 flex flex-col gap-2 rounded-lg border border-accent/25 bg-panel/80 p-3 shadow-xs"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-mono text-[10px] uppercase font-semibold tracking-wider text-accent">
                              {note.category || "Technical Article"}
                            </span>
                            {note.readTime && (
                              <span className="font-mono text-[10px] text-ink/40">
                                {note.readTime}
                              </span>
                            )}
                          </div>
                          <h4 className="text-body-s font-semibold text-ink line-clamp-1">
                            {note.title}
                          </h4>
                          <p className="text-body-xs text-ink/70 line-clamp-2">
                            {note.excerpt}
                          </p>
                          <div className="border-t border-ink/8 pt-1.5">
                            <Link
                              href={`/notes/${note.slug}`}
                              className="inline-flex items-center gap-1.5 font-mono text-body-xs font-medium text-accent hover:underline"
                            >
                              <BookOpen size={13} className="text-accent" />
                              <span>Read Full Note</span>
                              <ArrowRight size={11} />
                            </Link>
                          </div>
                        </div>
                      );
                    }

                    if (
                      toolPart.type === "tool-getLiveStatus" &&
                      toolPart.state === "output-available" &&
                      toolPart.output &&
                      typeof toolPart.output === "object"
                    ) {
                      const statusOutput = toolPart.output as LiveStatusOutput;
                      return (
                        <div
                          key={i}
                          className="my-1.5 flex flex-col gap-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3 text-body-xs shadow-xs"
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className="relative flex h-2 w-2 items-center justify-center"
                              aria-hidden
                            >
                              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500/75 opacity-75" />
                              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                            </span>
                            <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                              Active Status
                            </span>
                          </div>
                          <p className="font-medium text-ink">
                            {statusOutput.teaching}
                          </p>
                          {statusOutput.latestCommit && (
                            <div className="flex items-center gap-1.5 font-mono text-[11px] text-ink/70">
                              <GitCommit
                                size={13}
                                className="shrink-0 text-accent"
                              />
                              <span className="truncate">
                                {statusOutput.latestCommit.repo}:{" "}
                                {statusOutput.latestCommit.message}
                              </span>
                              <span className="shrink-0 text-ink/40">
                                ({statusOutput.latestCommit.relativeTime})
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    }
                  }

                  return null;
                })}
              </div>
            ))}

            {isBusy && (
              <div className="flex items-center gap-2 text-ink/40 py-1">
                <Spinner
                  size={16}
                  weight="bold"
                  className="animate-spin text-accent"
                />
                <span className="font-mono text-body-xs text-ink/50">
                  Synthesizing portfolio data…
                </span>
              </div>
            )}
          </div>

          {/* Input Form */}
          <form
            onSubmit={handleSubmit}
            className="flex gap-2 border-t border-ink/10 bg-panel/30 p-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question about Ajibola's work…"
              disabled={status !== "ready"}
              className="w-full rounded-lg border border-ink/10 bg-ink/5 px-3 py-2 text-body-s outline-none transition-colors focus:border-accent focus:bg-cream disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={status !== "ready" || !input.trim()}
              aria-label="Send"
              className="flex items-center justify-center rounded-lg bg-ink px-3 text-cream transition-colors hover:bg-accent disabled:opacity-60 shadow-xs"
            >
              <PaperPlaneRight weight="duotone" size={16} />
            </button>
          </form>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        aria-label={isOpen ? "Close chat" : "Ask about my work"}
        className="flex items-center gap-2 rounded-full bg-ink px-4 py-2.5 text-body-s font-medium text-cream shadow-xl transition-all hover:bg-accent hover:shadow-accent/20 active:scale-95"
      >
        {isOpen ? (
          <X weight="bold" size={16} />
        ) : (
          <ChatCircleDots weight="duotone" size={18} />
        )}
        <span>{isOpen ? "Close" : "Ask AI"}</span>
      </button>
    </div>
  );
}
