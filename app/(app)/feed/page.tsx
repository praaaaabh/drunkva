import { Clock, MapPin, MessageCircle } from "lucide-react";
import { Card, PageShell, Pill } from "@/components/ui";

const activities = [
  { title: "Rooftop catch-up", venue: "Juniper Terrace", time: "Last night", note: "Easy pace, great tacos, split rideshare home.", spend: "$64" },
  { title: "Friday trivia", venue: "The Copper Room", time: "3 days ago", note: "Team came second. Added a water break before round four.", spend: "$38" },
  { title: "Birthday dinner", venue: "Luna Kitchen", time: "Last week", note: "Mostly food and mocktails after dinner.", spend: "$82" }
];

export default function FeedPage() {
  return (
    <PageShell eyebrow="Activity feed" title="Your recent nights" description="A calm recap of logged outings, notes, spend, and venues. Mock content for the MVP.">
      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          {activities.map((activity) => (
            <Card key={activity.title}>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <Pill tone="blue">{activity.time}</Pill>
                  <h2 className="mt-3 text-2xl font-black text-ink">{activity.title}</h2>
                  <p className="mt-2 flex items-center gap-2 text-sm font-bold text-ink/60">
                    <MapPin className="h-4 w-4" aria-hidden="true" />
                    {activity.venue}
                  </p>
                  <p className="mt-3 max-w-2xl leading-7 text-ink/65">{activity.note}</p>
                </div>
                <div className="rounded-lg bg-ink/5 px-4 py-3 text-right">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-ink/45">Spend</p>
                  <p className="text-xl font-black text-ink">{activity.spend}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
        <Card>
          <Clock className="h-6 w-6 text-punch" aria-hidden="true" />
          <h2 className="mt-4 text-xl font-black text-ink">Tomorrow check-in</h2>
          <p className="mt-2 leading-7 text-ink/65">A placeholder reminder for mood, sleep, and hangover notes after a night out.</p>
          <div className="mt-5 flex items-center gap-2 rounded-lg bg-mint/10 p-3 text-sm font-bold text-green-800">
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            Reflection over competition.
          </div>
        </Card>
      </div>
    </PageShell>
  );
}
