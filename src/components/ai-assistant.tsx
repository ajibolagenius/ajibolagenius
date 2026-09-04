"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { usePathname } from "next/navigation";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import {
  ChatCircleDots,
  PaperPlaneRight,
  Spinner,
  X,
} from "@phosphor-icons/react/dist/ssr";
import { useFocusTrap } from "@/hooks/use-focus-trap";

export function AiAssistant() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const panelRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  // Stable identity: useFocusTrap's effect re-runs whenever this changes, and
  // re-running it re-focuses the panel's first focusable element (the close
  // button) — an inline arrow here would do that on every keystroke, since
  // typing re-renders this component.
  const close = useCallback(() => setIsOpen(false), []);

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/assistant" }),
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

  // Mounted globally from the root layout, so it renders on /admin too unless
  // told otherwise — a visitor-facing widget has no place in the CMS.
  if (pathname?.startsWith("/admin")) return null;

  const isBusy = status === "submitted" || status === "streaming";

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const text = input.trim();
    if (!text || isBusy) return;
    sendMessage({ text });
    setInput("");
  }

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 print:hidden">
      {isOpen && (
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Ask about Ajibola's work"
          className="flex h-[min(70vh,520px)] w-[min(360px,calc(100vw-3rem))] flex-col border border-ink/10 bg-cream shadow-lg"
        >
          <div className="flex items-center justify-between border-b border-ink/10 px-4 py-3">
            <p className="text-body-s font-medium">Ask about my work</p>
            <button
              type="button"
              onClick={close}
              aria-label="Close chat"
              className="text-ink/50 transition-colors hover:text-ink"
            >
              <X size={18} weight="bold" />
            </button>
          </div>

          <div
            ref={listRef}
            className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-4"
          >
            {messages.length === 0 && (
              <p className="text-body-s text-ink/50">
                Ask about experience, projects, or skills — answers are
                grounded in what&apos;s actually on this site.
              </p>
            )}
            {messages.map((message) => (
              <div
                key={message.id}
                className={
                  message.role === "user"
                    ? "ml-auto max-w-[85%] bg-ink px-3 py-2 text-body-s text-cream"
                    : "max-w-[85%] text-body-s text-ink/80"
                }
              >
                {message.parts.map((part, i) =>
                  part.type === "text" ? (
                    <span key={i} className="whitespace-pre-wrap">
                      {part.text}
                    </span>
                  ) : null,
                )}
              </div>
            ))}
            {isBusy && (
              <Spinner
                size={16}
                weight="bold"
                className="animate-spin text-ink/40"
              />
            )}
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex gap-2 border-t border-ink/10 p-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question…"
              disabled={status !== "ready"}
              className="w-full border border-ink/10 bg-ink/5 px-3 py-2 text-body-s outline-none focus:border-accent disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={status !== "ready" || !input.trim()}
              aria-label="Send"
              className="flex items-center justify-center bg-ink px-3 text-cream transition-colors hover:bg-accent disabled:opacity-60"
            >
              <PaperPlaneRight weight="duotone" size={16} />
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        aria-label={isOpen ? "Close chat" : "Ask about my work"}
        className="flex items-center gap-2 bg-ink px-4 py-2.5 text-body-s font-medium text-cream shadow-lg transition-colors hover:bg-accent"
      >
        {isOpen ? (
          <X weight="bold" size={16} />
        ) : (
          <ChatCircleDots weight="duotone" size={16} />
        )}
        {isOpen ? "Close" : "Ask AI"}
      </button>
    </div>
  );
}
