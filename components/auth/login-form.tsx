"use client";

import Link from "next/link";
import { type FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export function LoginForm() {
  const router = useRouter();
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!isSupabaseConfigured()) {
      setError("Supabase env vars are missing. Add them to .env.local before logging in.");
      return;
    }

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    setPending(true);

    try {
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (loginError) {
        setError(loginError.message);
        return;
      }

      router.push("/feed");
      router.refresh();
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Login failed. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="rounded-lg border border-ink/10 bg-white p-6 shadow-soft">
      <p className="text-sm font-black uppercase tracking-[0.16em] text-punch">Welcome back</p>
      <h1 className="mt-3 text-3xl font-black tracking-tight text-ink">Log in to Drunkva</h1>
      <form onSubmit={handleSubmit} className="mt-7 space-y-4">
        <label className="block">
          <span className="text-sm font-bold text-ink/70">Email</span>
          <input name="email" type="email" autoComplete="email" required placeholder="you@example.com" className="mt-2 w-full rounded-lg border border-ink/15 bg-white px-4 py-3 outline-none ring-grape/20 transition focus:border-grape focus:ring-4" />
        </label>
        <label className="block">
          <span className="text-sm font-bold text-ink/70">Password</span>
          <input name="password" type="password" autoComplete="current-password" required placeholder="Password" className="mt-2 w-full rounded-lg border border-ink/15 bg-white px-4 py-3 outline-none ring-grape/20 transition focus:border-grape focus:ring-4" />
        </label>
        {error ? <p className="rounded-lg bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{error}</p> : null}
        <button type="submit" disabled={pending} className="w-full rounded-lg bg-ink px-4 py-3 font-black text-white shadow-soft transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-65">
          {pending ? "Logging in..." : "Log in"}
        </button>
      </form>
      <p className="mt-5 text-center text-sm text-ink/60">
        New here? <Link href="/signup" className="font-black text-grape">Create an account</Link>
      </p>
    </section>
  );
}
