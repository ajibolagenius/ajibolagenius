"use client";

import { useRef, useState, type FormEvent } from "react";
import { PaperPlaneRight, Spinner } from "@phosphor-icons/react/dist/ssr";
import { submitContactMessage } from "@/app/actions";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");
    setError(null);
    const formData = new FormData(e.currentTarget);
    const result = await submitContactMessage(formData);
    if ("error" in result) {
      setStatus("error");
      setError(result.error);
      return;
    }
    setStatus("sent");
    formRef.current?.reset();
  };

  if (status === "sent") {
    return (
      <div className="w-full max-w-md bg-ink/5 px-4 py-6 text-center text-body-s text-ink/70">
        Thanks for reaching out — I&apos;ll get back to you soon.
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="flex w-full max-w-md flex-col gap-3 text-left"
    >
      {/* Honeypot: hidden from real users, bots that fill every field trip it. */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />
      <input
        name="name"
        placeholder="Your name"
        required
        className="w-full border border-ink/10 bg-ink/5 px-4 py-3 text-body-s outline-none focus:border-accent"
      />
      <input
        name="email"
        type="email"
        placeholder="Your email"
        required
        className="w-full border border-ink/10 bg-ink/5 px-4 py-3 text-body-s outline-none focus:border-accent"
      />
      <textarea
        name="message"
        placeholder="Your message"
        required
        rows={4}
        className="w-full resize-none border border-ink/10 bg-ink/5 px-4 py-3 text-body-s outline-none focus:border-accent"
      />
      <button
        type="submit"
        disabled={status === "sending"}
        className="flex items-center justify-center gap-2 bg-ink px-4 py-3 text-body-s font-medium text-cream transition-colors hover:bg-accent disabled:opacity-60"
      >
        {status === "sending" ? (
          <Spinner size={16} weight="bold" className="animate-spin" />
        ) : (
          <PaperPlaneRight weight="duotone" size={16} />
        )}
        {status === "sending" ? "Sending…" : "Send Message"}
      </button>
      {error && <p className="text-body-xs text-red-600">{error}</p>}
    </form>
  );
}
