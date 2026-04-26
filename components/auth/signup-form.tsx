"use client";

import Link from "next/link";
import { type FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export function SignupForm() {
  const router = useRouter();
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (process.env.NODE_ENV === "development") {
      console.log("signup submit fired");
    }

    setError("");
    setSuccess("");

    if (!isSupabaseConfigured()) {
      setError("Supabase env vars are missing. Add them to .env.local before creating an account.");
      return;
    }

    const formData = new FormData(event.currentTarget);
    const fullName = String(formData.get("full_name") ?? "").trim();
    const username = String(formData.get("username") ?? "").trim().toLowerCase();
    const city = String(formData.get("city") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const defaultCurrency = String(formData.get("default_currency") ?? "USD");
    const defaultPrivacy = String(formData.get("default_privacy") ?? "private");

    if (!fullName || !username || !city || !email || !password) {
      setError("Full name, username, city, email, and password are required.");
      return;
    }

    setPending(true);

    try {
      const { data, error: signupError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            username,
            city,
            default_currency: defaultCurrency,
            default_privacy: defaultPrivacy
          }
        }
      });

      if (signupError) {
        setError(signupError.message);
        return;
      }

      if (data.session) {
        router.push("/feed");
        router.refresh();
        return;
      }

      setSuccess("Account created. Please check your email to confirm your account.");
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Signup failed. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="rounded-lg border border-ink/10 bg-white p-6 shadow-soft">
      <p className="text-sm font-black uppercase tracking-[0.16em] text-punch">Create profile</p>
      <h1 className="mt-3 text-3xl font-black tracking-tight text-ink">Start your night-out log</h1>
      <form onSubmit={handleSubmit} className="mt-7 space-y-4">
        <label className="block">
          <span className="text-sm font-bold text-ink/70">Full name</span>
          <input name="full_name" type="text" autoComplete="name" required placeholder="Jazzy Pat" className="mt-2 w-full rounded-lg border border-ink/15 bg-white px-4 py-3 outline-none ring-grape/20 transition focus:border-grape focus:ring-4" />
        </label>
        <label className="block">
          <span className="text-sm font-bold text-ink/70">Username</span>
          <input name="username" type="text" autoComplete="username" required placeholder="jazzypat" className="mt-2 w-full rounded-lg border border-ink/15 bg-white px-4 py-3 outline-none ring-grape/20 transition focus:border-grape focus:ring-4" />
        </label>
        <label className="block">
          <span className="text-sm font-bold text-ink/70">City</span>
          <input name="city" type="text" autoComplete="address-level2" required placeholder="Mumbai" className="mt-2 w-full rounded-lg border border-ink/15 bg-white px-4 py-3 outline-none ring-grape/20 transition focus:border-grape focus:ring-4" />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-bold text-ink/70">Currency</span>
            <select name="default_currency" defaultValue="USD" className="mt-2 w-full rounded-lg border border-ink/15 bg-white px-4 py-3 outline-none ring-grape/20 transition focus:border-grape focus:ring-4">
              <option value="USD">USD</option>
              <option value="INR">INR</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-bold text-ink/70">Privacy</span>
            <select name="default_privacy" defaultValue="private" className="mt-2 w-full rounded-lg border border-ink/15 bg-white px-4 py-3 outline-none ring-grape/20 transition focus:border-grape focus:ring-4">
              <option value="private">Private</option>
              <option value="friends">Friends</option>
              <option value="public">Public</option>
            </select>
          </label>
        </div>
        <label className="block">
          <span className="text-sm font-bold text-ink/70">Email</span>
          <input name="email" type="email" autoComplete="email" required placeholder="you@example.com" className="mt-2 w-full rounded-lg border border-ink/15 bg-white px-4 py-3 outline-none ring-grape/20 transition focus:border-grape focus:ring-4" />
        </label>
        <label className="block">
          <span className="text-sm font-bold text-ink/70">Password</span>
          <input name="password" type="password" autoComplete="new-password" required placeholder="Choose a password" className="mt-2 w-full rounded-lg border border-ink/15 bg-white px-4 py-3 outline-none ring-grape/20 transition focus:border-grape focus:ring-4" />
        </label>
        {error ? <p className="rounded-lg bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{error}</p> : null}
        {success ? <p className="rounded-lg bg-mint/10 px-4 py-3 text-sm font-bold text-green-800">{success}</p> : null}
        <button type="submit" disabled={pending} className="w-full rounded-lg bg-ink px-4 py-3 font-black text-white shadow-soft transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-65">
          {pending ? "Creating account..." : "Create account"}
        </button>
      </form>
      <p className="mt-5 text-center text-sm text-ink/60">
        Already have an account? <Link href="/login" className="font-black text-grape">Log in</Link>
      </p>
    </section>
  );
}
