"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const OWNER_EMAIL = "ajiboladolapogenius@gmail.com";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (email.trim().toLowerCase() !== OWNER_EMAIL) {
      setStatus("error");
      setMessage("This admin console is restricted to the site owner.");
      return;
    }

    setStatus("sending");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setStatus("error");
      setMessage(error.message);
    } else {
      setStatus("sent");
      setMessage("Check your inbox for a sign-in link.");
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-6 px-6">
      <div>
        <h1 className="text-2xl font-semibold">Admin sign in</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Restricted access. Sign in with the owner email to manage projects.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="email"
          required
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900 dark:border-neutral-700 dark:focus:border-neutral-100"
        />
        <button
          type="submit"
          disabled={status === "sending"}
          className="rounded-md bg-neutral-900 px-3 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-neutral-100 dark:text-neutral-900"
        >
          {status === "sending" ? "Sending..." : "Send sign-in link"}
        </button>
        {message && (
          <p
            className={`text-sm ${status === "error" ? "text-red-600" : "text-neutral-500"}`}
          >
            {message}
          </p>
        )}
      </form>
    </main>
  );
}
