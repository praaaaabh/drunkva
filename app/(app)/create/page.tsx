import { CalendarDays, MapPin, Plus, UsersRound } from "lucide-react";
import { Card, PageShell } from "@/components/ui";

export default function CreateActivityPage() {
  return (
    <PageShell eyebrow="Create activity" title="Log a night out" description="A UI-only form for capturing the basics. Backend storage will come in a later phase.">
      <Card className="max-w-3xl">
        <form className="grid gap-5">
          <label>
            <span className="text-sm font-bold text-ink/70">Activity name</span>
            <input className="mt-2 w-full rounded-lg border border-ink/15 px-4 py-3 outline-none ring-grape/20 focus:border-grape focus:ring-4" placeholder="Late dinner and lounge" />
          </label>
          <div className="grid gap-5 md:grid-cols-2">
            <label>
              <span className="flex items-center gap-2 text-sm font-bold text-ink/70"><CalendarDays className="h-4 w-4" /> Date</span>
              <input type="date" className="mt-2 w-full rounded-lg border border-ink/15 px-4 py-3 outline-none ring-grape/20 focus:border-grape focus:ring-4" />
            </label>
            <label>
              <span className="flex items-center gap-2 text-sm font-bold text-ink/70"><MapPin className="h-4 w-4" /> Main venue</span>
              <input className="mt-2 w-full rounded-lg border border-ink/15 px-4 py-3 outline-none ring-grape/20 focus:border-grape focus:ring-4" placeholder="Venue name" />
            </label>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <label>
              <span className="text-sm font-bold text-ink/70">Estimated spend</span>
              <input className="mt-2 w-full rounded-lg border border-ink/15 px-4 py-3 outline-none ring-grape/20 focus:border-grape focus:ring-4" placeholder="$45" />
            </label>
            <label>
              <span className="flex items-center gap-2 text-sm font-bold text-ink/70"><UsersRound className="h-4 w-4" /> Friends</span>
              <input className="mt-2 w-full rounded-lg border border-ink/15 px-4 py-3 outline-none ring-grape/20 focus:border-grape focus:ring-4" placeholder="Sam, Priya, Marco" />
            </label>
          </div>
          <label>
            <span className="text-sm font-bold text-ink/70">Notes</span>
            <textarea className="mt-2 min-h-28 w-full rounded-lg border border-ink/15 px-4 py-3 outline-none ring-grape/20 focus:border-grape focus:ring-4" placeholder="Food, drinks, transport, mood, hydration, anything worth remembering." />
          </label>
          <button type="button" className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-ink px-5 py-3 font-black text-white shadow-soft sm:w-fit">
            <Plus className="h-5 w-5" aria-hidden="true" />
            Save placeholder
          </button>
        </form>
      </Card>
    </PageShell>
  );
}
