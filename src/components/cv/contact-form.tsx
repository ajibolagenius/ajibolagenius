"use client";

import { useRef, useState, type FormEvent } from "react";
import { PaperPlaneRight, Spinner } from "@phosphor-icons/react/dist/ssr";
import { submitContactMessage } from "@/app/actions";
import { toast } from "@/lib/toast";
import { sound } from "@/lib/sound";
import { useLanguage } from "@/lib/i18n";

export function ContactForm() {
  const { t } = useLanguage();
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sound.playTap();
    setStatus("sending");
    setError(null);
    const formData = new FormData(e.currentTarget);

    let result: Awaited<ReturnType<typeof submitContactMessage>>;
    try {
      result = await submitContactMessage(formData);
    } catch {
      // The action never completed — offline, or the request was dropped. The
      // inline error would be the only signal on a long page, and the submit
      // button is often scrolled past by the time this resolves.
      setStatus("error");
      sound.playError();
      const message = t.contact.errorOffline;
      setError(message);
      toast.error(message, { silent: true });
      return;
    }

    if ("error" in result) {
      setStatus("error");
      sound.playError();
      setError(result.error);
      toast.error(result.error, { silent: true });
      return;
    }
    setStatus("sent");
    sound.playMatch();
    toast.success(t.contact.successTitle, {
      description: t.contact.successDesc,
      silent: true,
    });
    formRef.current?.reset();
  };

  if (status === "sent") {
    return (
      <div className="w-full max-w-md bg-ink/5 px-4 py-6 text-center text-body-s text-ink/70">
        {t.contact.successDesc}
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
        placeholder={t.contact.namePlaceholder}
        required
        className="w-full border border-ink/10 bg-ink/5 px-4 py-3 text-body-s outline-none focus:border-accent"
      />
      <input
        name="email"
        type="email"
        placeholder={t.contact.emailPlaceholder}
        required
        className="w-full border border-ink/10 bg-ink/5 px-4 py-3 text-body-s outline-none focus:border-accent"
      />
      <textarea
        name="message"
        placeholder={t.contact.messagePlaceholder}
        required
        rows={4}
        className="w-full resize-none border border-ink/10 bg-ink/5 px-4 py-3 text-body-s outline-none focus:border-accent"
      />
      <button
        type="submit"
        disabled={status === "sending"}
        className="flex items-center justify-center gap-2 bg-ink px-4 py-3 text-body-s font-medium text-cream transition-colors hover:bg-accent disabled:opacity-60 cursor-pointer"
      >
        {status === "sending" ? (
          <Spinner size={16} weight="bold" className="animate-spin" />
        ) : (
          <PaperPlaneRight weight="duotone" size={16} />
        )}
        {status === "sending" ? t.actions.sending : t.actions.sendMessage}
      </button>
      {error && <p className="text-body-xs text-red-600">{error}</p>}
    </form>
  );
}
