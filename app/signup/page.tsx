import Link from "next/link";
import { MarketingNav } from "@/components/marketing-nav";

export default function SignupPage() {
  return (
    <div className="min-h-screen noise">
      <MarketingNav />
      <main className="mx-auto flex max-w-md flex-col px-5 py-12">
        <section className="rounded-lg border border-ink/10 bg-white p-6 shadow-soft">
          <p className="text-sm font-black uppercase tracking-[0.16em] text-punch">Create profile</p>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-ink">Start your night-out log</h1>
          <form className="mt-7 space-y-4">
            <label className="block">
              <span className="text-sm font-bold text-ink/70">Display name</span>
              <input type="text" placeholder="Jazzy J" className="mt-2 w-full rounded-lg border border-ink/15 bg-white px-4 py-3 outline-none ring-grape/20 transition focus:border-grape focus:ring-4" />
            </label>
            <label className="block">
              <span className="text-sm font-bold text-ink/70">Email</span>
              <input type="email" placeholder="you@example.com" className="mt-2 w-full rounded-lg border border-ink/15 bg-white px-4 py-3 outline-none ring-grape/20 transition focus:border-grape focus:ring-4" />
            </label>
            <label className="block">
              <span className="text-sm font-bold text-ink/70">Password</span>
              <input type="password" placeholder="Choose a password" className="mt-2 w-full rounded-lg border border-ink/15 bg-white px-4 py-3 outline-none ring-grape/20 transition focus:border-grape focus:ring-4" />
            </label>
            <button type="button" className="w-full rounded-lg bg-ink px-4 py-3 font-black text-white shadow-soft transition hover:-translate-y-0.5">
              Create account
            </button>
          </form>
          <p className="mt-5 text-center text-sm text-ink/60">
            Already have an account? <Link href="/login" className="font-black text-grape">Log in</Link>
          </p>
        </section>
      </main>
    </div>
  );
}
