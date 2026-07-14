"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

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
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-6 px-6">
      <div>
        <h1 className="text-2xl font-semibold">Admin sign in</h1>
        <p className="mt-1 text-sm text-neutral-500">
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
          className="rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900 dark:border-neutral-700 dark:focus:border-neutral-100"
        />
        <input
          type="password"
          required
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900 dark:border-neutral-700 dark:focus:border-neutral-100"
        />
        <button
          type="submit"
          disabled={status === "signing-in"}
          className="rounded-md bg-neutral-900 px-3 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-neutral-100 dark:text-neutral-900"
        >
          {status === "signing-in" ? "Signing in..." : "Sign in"}
        </button>
        <button
          type="button"
          onClick={handleForgotPassword}
          disabled={status === "sending-reset"}
          className="text-sm text-neutral-500 underline disabled:opacity-50"
        >
          {status === "sending-reset"
            ? "Sending..."
            : "Forgot password / first time signing in?"}
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
