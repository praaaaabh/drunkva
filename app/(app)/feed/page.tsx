import Link from "next/link";
import { Clock, MapPin, MessageCircle, Plus } from "lucide-react";
import { Card, PageShell, Pill } from "@/components/ui";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const emptyActivities = [
  { title: "Rooftop catch-up", venue: "Juniper Terrace", time: "Last night", note: "Easy pace, great tacos, split rideshare home.", spend: "$64" },
  { title: "Friday trivia", venue: "The Copper Room", time: "3 days ago", note: "Team came second. Added a water break before round four.", spend: "$38" }
];

type Drink = {
  quantity: number | null;
  drink_name: string | null;
  drink_type: string | null;
  is_alcoholic: boolean | null;
};

type Activity = {
  id: string;
  title: string;
  activity_date: string;
  total_spend: number | null;
  total_drinks: number | null;
  currency: string | null;
  notes: string | null;
  privacy: string;
  hangover_rating: number | null;
  mood_before: number | null;
  mood_after: number | null;
  venues: {
    name: string | null;
    city: string | null;
  } | null;
  activity_drinks: Drink[];
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(new Date(`${date}T00:00:00`));
}

function formatSpend(amount: number | null, currency: string | null) {
  if (amount === null) {
    return "Not set";
  }

  return new Intl.NumberFormat("en", {
    style: "currency",
    currency: currency || "USD",
    maximumFractionDigits: 2
  }).format(amount);
}

export default async function FeedPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("activities")
    .select(`
      id,
      title,
      activity_date,
      total_spend,
      total_drinks,
      currency,
      notes,
      privacy,
      hangover_rating,
      mood_before,
      mood_after,
      venues (
        name,
        city
      ),
      activity_drinks (
        quantity,
        drink_name,
        drink_type,
        is_alcoholic
      )
    `)
    .eq("owner_id", user?.id ?? "")
    .order("activity_date", { ascending: false })
    .order("created_at", { ascending: false });

  const activities = (data ?? []) as unknown as Activity[];

  return (
    <PageShell eyebrow="Activity feed" title="Your recent nights" description="A calm recap of your logged outings, notes, spend, drinks, and venues.">
      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          {error ? (
            <Card>
              <p className="font-bold text-red-700">{error.message}</p>
            </Card>
          ) : null}

          {!error && activities.length === 0 ? (
            <Card>
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <Pill tone="orange">Empty state</Pill>
                  <h2 className="mt-3 text-2xl font-black text-ink">No activities yet</h2>
                  <p className="mt-3 max-w-2xl leading-7 text-ink/65">
                    Your real feed will appear here after you log a night out. Here are example cards for the kind of details Drunkva tracks.
                  </p>
                </div>
                <Link href="/create" className="inline-flex items-center justify-center gap-2 rounded-lg bg-ink px-4 py-3 font-black text-white">
                  <Plus className="h-4 w-4" />
                  Create activity
                </Link>
              </div>
            </Card>
          ) : null}

          {!error && activities.length === 0
            ? emptyActivities.map((activity) => (
                <Card key={activity.title} className="border-dashed shadow-none">
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
                      <p className="text-xs font-bold uppercase tracking-[0.12em] text-ink/45">Example spend</p>
                      <p className="text-xl font-black text-ink">{activity.spend}</p>
                    </div>
                  </div>
                </Card>
              ))
            : null}

          {activities.map((activity) => {
            const venue = activity.venues?.name ? [activity.venues.name, activity.venues.city].filter(Boolean).join(", ") : "No venue set";
            const drinkSummary = activity.activity_drinks
              .slice(0, 3)
              .map((drink) => `${drink.quantity ?? 0} ${drink.drink_name ?? drink.drink_type ?? "drink"}`)
              .join(" · ");

            return (
              <Card key={activity.id}>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap gap-2">
                      <Pill tone="blue">{formatDate(activity.activity_date)}</Pill>
                      <Pill>{activity.privacy}</Pill>
                    </div>
                    <h2 className="mt-3 text-2xl font-black text-ink">{activity.title}</h2>
                    <p className="mt-2 flex items-center gap-2 text-sm font-bold text-ink/60">
                      <MapPin className="h-4 w-4" aria-hidden="true" />
                      {venue}
                    </p>
                    {activity.notes ? <p className="mt-3 max-w-2xl leading-7 text-ink/65">{activity.notes}</p> : null}
                    {drinkSummary ? <p className="mt-3 text-sm font-bold text-ink/55">{drinkSummary}</p> : null}
                    <div className="mt-4 flex flex-wrap gap-2 text-xs font-bold text-ink/60">
                      <span className="rounded-full bg-ink/5 px-3 py-1">{activity.total_drinks ?? 0} drinks</span>
                      {activity.mood_before !== null ? <span className="rounded-full bg-ink/5 px-3 py-1">Mood before {activity.mood_before}/10</span> : null}
                      {activity.mood_after !== null ? <span className="rounded-full bg-ink/5 px-3 py-1">Mood after {activity.mood_after}/10</span> : null}
                      {activity.hangover_rating !== null ? <span className="rounded-full bg-ink/5 px-3 py-1">Hangover {activity.hangover_rating}/10</span> : null}
                    </div>
                  </div>
                  <div className="rounded-lg bg-ink/5 px-4 py-3 text-right">
                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-ink/45">Spend</p>
                    <p className="text-xl font-black text-ink">{formatSpend(activity.total_spend, activity.currency)}</p>
                  </div>
                </div>
              </Card>
            );
          })}
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
