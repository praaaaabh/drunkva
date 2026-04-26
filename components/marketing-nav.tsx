import Link from "next/link";
import { Brand } from "@/components/brand";

export function MarketingNav() {
  return (
    <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5">
      <Brand />
      <nav className="flex items-center gap-2 text-sm font-semibold">
        <Link href="/login" className="rounded-lg px-4 py-2 text-ink/75 transition hover:bg-white/70 hover:text-ink">
          Log in
        </Link>
        <Link href="/signup" className="rounded-lg bg-ink px-4 py-2 text-white shadow-soft transition hover:-translate-y-0.5">
          Sign up
        </Link>
      </nav>
    </header>
  );
}
