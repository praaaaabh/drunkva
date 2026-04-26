import Link from "next/link";
import { ArrowRight, BadgeDollarSign, MapPin, ShieldCheck, Sparkles, UsersRound } from "lucide-react";
import { MarketingNav } from "@/components/marketing-nav";
import { Card, Pill } from "@/components/ui";

const features = [
  {
    icon: MapPin,
    title: "Log the night",
    text: "Track venues, drinks, snacks, rides, and the notes you actually want tomorrow."
  },
  {
    icon: UsersRound,
    title: "Remember the crew",
    text: "Tag friends and keep a casual history of where good nights happened."
  },
  {
    icon: BadgeDollarSign,
    title: "Know your spend",
    text: "See personal costs without turning your night out into a spreadsheet."
  },
  {
    icon: ShieldCheck,
    title: "Stay responsible",
    text: "Designed around reflection, moderation, and personal patterns. No competitive drinking."
  }
];

export default function LandingPage() {
  return (
    <div className="min-h-screen noise">
      <MarketingNav />
      <main>
        <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 pb-16 pt-10 lg:grid-cols-[1.03fr_0.97fr] lg:pb-24 lg:pt-16">
          <div>
            <Pill tone="orange">Phase 1 MVP</Pill>
            <h1 className="mt-5 max-w-4xl text-5xl font-black tracking-tight text-ink sm:text-6xl lg:text-7xl">
              Track the night out without making it weird.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-ink/70">
              Drunkva helps you log sessions, venues, friends, spend, hangovers, and personal stats with a playful but responsible vibe.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/signup" className="inline-flex items-center justify-center gap-2 rounded-lg bg-ink px-5 py-3 font-bold text-white shadow-soft transition hover:-translate-y-0.5">
                Start tracking
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link href="/feed" className="inline-flex items-center justify-center rounded-lg border border-ink/15 bg-white/80 px-5 py-3 font-bold text-ink transition hover:bg-white">
                Preview app
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-ink/10 bg-white p-4 shadow-soft">
            <div className="rounded-[1.5rem] bg-ink p-5 text-white">
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/60">Tonight</p>
                  <h2 className="text-2xl font-black">Rooftop catch-up</h2>
                </div>
                <Sparkles className="h-7 w-7 text-punch" aria-hidden="true" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  ["Venues", "2 stops"],
                  ["Friends", "5 tagged"],
                  ["Spend", "$64"],
                  ["Tomorrow", "Check-in set"]
                ].map(([label, value]) => (
                  <div key={label} className="rounded-lg bg-white/10 p-4">
                    <p className="text-sm text-white/55">{label}</p>
                    <p className="mt-2 text-xl font-black">{value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-lg bg-white p-4 text-ink">
                <p className="text-sm font-bold text-ink/50">Responsible note</p>
                <p className="mt-1 font-semibold">Pace looked steady. Hydration reminder saved for 11:30 PM.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-ink/10 bg-white/65">
          <div className="mx-auto grid max-w-6xl gap-4 px-5 py-12 md:grid-cols-4">
            {features.map(({ icon: Icon, title, text }) => (
              <Card key={title} className="shadow-none">
                <Icon className="h-6 w-6 text-grape" aria-hidden="true" />
                <h3 className="mt-4 text-lg font-black text-ink">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-ink/65">{text}</p>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
