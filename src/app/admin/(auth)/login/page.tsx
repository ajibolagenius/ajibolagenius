"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ThemeToggle } from "@/components/theme-toggle";

const OWNER_EMAIL = "ajibolaakelebe@gmail.com";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<
    "idle" | "signing-in" | "sending-reset" | "reset-sent" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (email.trim().toLowerCase() !== OWNER_EMAIL) {
      setStatus("error");
      setMessage("This admin console is restricted to the site owner.");
      return;
    }

    setStatus("signing-in");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setStatus("error");
      setMessage(error.message);
    } else {
      router.push("/admin");
    }
  }

  async function handleForgotPassword() {
    if (email.trim().toLowerCase() !== OWNER_EMAIL) {
      setStatus("error");
      setMessage("Enter the owner email above first.");
      return;
    }

    setStatus("sending-reset");
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/admin/reset-password`,
    });

    if (error) {
      setStatus("error");
      setMessage(error.message);
    } else {
      setStatus("reset-sent");
      setMessage("Check your inbox for a link to set your password.");
    }
  }

  return (
    <main className="relative mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-6 px-6">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>
      <div>
        <h1 className="text-2xl font-semibold">Admin sign in</h1>
        <p className="mt-1 text-sm text-ink/60">
          Restricted access. Sign in with the owner email and password.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="email"
          required
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-md border border-ink/15 bg-transparent px-3 py-2 text-sm outline-none focus:border-accent"
        />
        <input
          type="password"
          required
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-md border border-ink/15 bg-transparent px-3 py-2 text-sm outline-none focus:border-accent"
        />
        <button
          type="submit"
          disabled={status === "signing-in"}
          className="rounded-md bg-ink px-3 py-2 text-sm font-medium text-cream disabled:opacity-50"
        >
          {status === "signing-in" ? "Signing in..." : "Sign in"}
        </button>
        <button
          type="button"
          onClick={handleForgotPassword}
          disabled={status === "sending-reset"}
          className="text-sm text-ink/60 underline disabled:opacity-50"
        >
          {status === "sending-reset"
            ? "Sending..."
            : "Forgot password / first time signing in?"}
        </button>
        {message && (
          <p
            className={`text-sm ${status === "error" ? "text-red-600" : "text-ink/60"}`}
          >
            {message}
          </p>
        )}
      </form>
    </main>
  );
}
