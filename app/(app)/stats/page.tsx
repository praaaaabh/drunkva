import { BadgeDollarSign, Bed, MapPinned, ShieldCheck } from "lucide-react";
import { Card, PageShell, Pill } from "@/components/ui";

const stats = [
  { label: "Avg spend", value: "$52", icon: BadgeDollarSign },
  { label: "Favorite venue", value: "Copper Room", icon: MapPinned },
  { label: "Sleep notes", value: "7 logged", icon: Bed },
  { label: "Pace check-ins", value: "12 saved", icon: ShieldCheck }
];

export default function StatsPage() {
  return (
    <PageShell eyebrow="Personal stats" title="Patterns, not pressure" description="Private stats help users reflect on spend, venues, sleep, and next-day notes. No rankings or reward loops.">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <Card key={label}>
            <Icon className="h-6 w-6 text-grape" aria-hidden="true" />
            <p className="mt-5 text-sm font-bold text-ink/55">{label}</p>
            <p className="mt-1 text-3xl font-black text-ink">{value}</p>
          </Card>
        ))}
      </div>
      <Card className="mt-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-black text-ink">Monthly snapshot</h2>
            <p className="mt-2 text-ink/65">Placeholder chart area for spend, venues, and next-day wellness notes.</p>
          </div>
          <Pill tone="green">Responsible by design</Pill>
        </div>
        <div className="mt-6 grid h-56 grid-cols-6 items-end gap-3 rounded-lg bg-ink/5 p-4">
          {[45, 70, 38, 84, 58, 66].map((height, index) => (
            <div key={index} className="rounded-t-lg bg-gradient-to-t from-grape to-soda" style={{ height: `${height}%` }} />
          ))}
        </div>
      </Card>
    </PageShell>
  );
}
