"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, CirclePlus, Home, Settings, UserRound } from "lucide-react";
import { clsx } from "clsx";
import { Brand } from "@/components/brand";

const links = [
  { href: "/feed", label: "Feed", icon: Home },
  { href: "/create", label: "Create", icon: CirclePlus },
  { href: "/stats", label: "Stats", icon: BarChart3 },
  { href: "/profile", label: "Profile", icon: UserRound },
  { href: "/settings", label: "Settings", icon: Settings }
];

export function AppNavbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-20 border-b border-ink/10 bg-[#fffaf3]/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Brand />
        <nav className="hidden items-center gap-1 rounded-xl border border-ink/10 bg-white/75 p-1 shadow-sm md:flex">
          {links.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={clsx(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition",
                  active ? "bg-ink text-white" : "text-ink/70 hover:bg-ink/5 hover:text-ink"
                )}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {label}
              </Link>
            );
          })}
        </nav>
        <Link href="/profile" className="grid h-10 w-10 place-items-center rounded-full bg-grape text-sm font-black text-white">
          JP
        </Link>
      </div>
      <nav className="grid grid-cols-5 border-t border-ink/10 bg-white/90 md:hidden">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                "flex flex-col items-center gap-1 px-2 py-2 text-xs font-semibold",
                active ? "text-grape" : "text-ink/60"
              )}
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
              {label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
