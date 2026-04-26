"use client";

import { type FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, CirclePlus, MapPin, Plus, Trash2 } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

type DrinkRow = {
  id: string;
  drinkType: string;
  drinkName: string;
  quantity: number;
  unitPrice: string;
  totalPrice: string;
  isAlcoholic: boolean;
};

const emptyDrink = (): DrinkRow => ({
  id: crypto.randomUUID(),
  drinkType: "beer",
  drinkName: "",
  quantity: 1,
  unitPrice: "",
  totalPrice: "",
  isAlcoholic: true
});

function parseMoney(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
}

export function CreateActivityForm() {
  const router = useRouter();
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [drinks, setDrinks] = useState<DrinkRow[]>([emptyDrink()]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [pending, setPending] = useState(false);

  const totalDrinks = drinks.reduce((sum, drink) => sum + Number(drink.quantity || 0), 0);
  const calculatedSpend = drinks.reduce((sum, drink) => {
    const totalPrice = drink.totalPrice ? parseMoney(drink.totalPrice) : parseMoney(drink.unitPrice) * Number(drink.quantity || 0);
    return sum + totalPrice;
  }, 0);

  function updateDrink(id: string, updates: Partial<DrinkRow>) {
    setDrinks((current) => current.map((drink) => (drink.id === id ? { ...drink, ...updates } : drink)));
  }

  function removeDrink(id: string) {
    setDrinks((current) => (current.length === 1 ? current : current.filter((drink) => drink.id !== id)));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!isSupabaseConfigured()) {
      setError("Supabase env vars are missing. Add them to .env.local before creating an activity.");
      return;
    }

    const formData = new FormData(event.currentTarget);
    const title = String(formData.get("title") ?? "").trim();
    const activityDate = String(formData.get("activity_date") ?? "").trim();
    const venueName = String(formData.get("venue_name") ?? "").trim();
    const venueCity = String(formData.get("venue_city") ?? "").trim();
    const manualSpend = String(formData.get("total_spend") ?? "").trim();
    const currency = String(formData.get("currency") ?? "USD");
    const privacy = String(formData.get("privacy") ?? "private");
    const notes = String(formData.get("notes") ?? "").trim();
    const hangoverRating = String(formData.get("hangover_rating") ?? "");
    const moodBefore = String(formData.get("mood_before") ?? "");
    const moodAfter = String(formData.get("mood_after") ?? "");

    if (!title || !activityDate) {
      setError("Activity name and date are required.");
      return;
    }

    const validDrinks = drinks
      .map((drink) => {
        const quantity = Number(drink.quantity || 0);
        const unitPrice = parseMoney(drink.unitPrice);
        const totalPrice = drink.totalPrice ? parseMoney(drink.totalPrice) : unitPrice * quantity;

        return {
          drink_type: drink.drinkType.trim(),
          drink_name: drink.drinkName.trim(),
          quantity,
          unit_price: unitPrice,
          total_price: totalPrice,
          is_alcoholic: drink.isAlcoholic
        };
      })
      .filter((drink) => drink.drink_name && drink.quantity > 0);

    if (validDrinks.length === 0) {
      setError("Add at least one drink with a name and quantity.");
      return;
    }

    setPending(true);

    try {
      const {
        data: { user },
        error: userError
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setError(userError?.message ?? "You must be logged in to create an activity.");
        return;
      }

      let venueId: string | null = null;

      if (venueName) {
        let venueQuery = supabase.from("venues").select("id").eq("owner_id", user.id).eq("name", venueName).limit(1);

        if (venueCity) {
          venueQuery = venueQuery.eq("city", venueCity);
        }

        const { data: existingVenues, error: venueLookupError } = await venueQuery;

        if (venueLookupError) {
          setError(venueLookupError.message);
          return;
        }

        venueId = existingVenues?.[0]?.id ?? null;

        if (!venueId) {
          const { data: newVenue, error: venueInsertError } = await supabase
            .from("venues")
            .insert({
              owner_id: user.id,
              name: venueName,
              city: venueCity || null
            })
            .select("id")
            .single();

          if (venueInsertError) {
            setError(venueInsertError.message);
            return;
          }

          venueId = newVenue.id;
        }
      }

      const spend = manualSpend ? parseMoney(manualSpend) : calculatedSpend;
      const drinkCount = validDrinks.reduce((sum, drink) => sum + drink.quantity, 0);

      const { data: activity, error: activityError } = await supabase
        .from("activities")
        .insert({
          owner_id: user.id,
          venue_id: venueId,
          title,
          activity_date: activityDate,
          privacy,
          total_spend: spend,
          total_drinks: drinkCount,
          currency,
          notes: notes || null,
          hangover_rating: hangoverRating ? Number(hangoverRating) : null,
          mood_before: moodBefore ? Number(moodBefore) : null,
          mood_after: moodAfter ? Number(moodAfter) : null
        })
        .select("id")
        .single();

      if (activityError) {
        setError(activityError.message);
        return;
      }

      const drinkRows = validDrinks.map((drink) => ({
        activity_id: activity.id,
        owner_id: user.id,
        drink_type: drink.drink_type,
        category: drink.drink_type,
        drink_name: drink.drink_name,
        quantity: drink.quantity,
        unit_price: drink.unit_price,
        total_price: drink.total_price,
        estimated_cost: drink.total_price,
        is_alcoholic: drink.is_alcoholic
      }));

      const { error: drinkError } = await supabase.from("activity_drinks").insert(drinkRows);

      if (drinkError) {
        setError(drinkError.message);
        return;
      }

      setSuccess("Activity saved. Taking you to your feed...");
      router.push("/feed");
      router.refresh();
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Activity creation failed. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5">
      <label>
        <span className="text-sm font-bold text-ink/70">Activity name</span>
        <input name="title" required className="mt-2 w-full rounded-lg border border-ink/15 px-4 py-3 outline-none ring-grape/20 focus:border-grape focus:ring-4" placeholder="Late dinner and lounge" />
      </label>
      <div className="grid gap-5 md:grid-cols-2">
        <label>
          <span className="flex items-center gap-2 text-sm font-bold text-ink/70"><CalendarDays className="h-4 w-4" /> Date</span>
          <input name="activity_date" type="date" required defaultValue={new Date().toISOString().slice(0, 10)} className="mt-2 w-full rounded-lg border border-ink/15 px-4 py-3 outline-none ring-grape/20 focus:border-grape focus:ring-4" />
        </label>
        <label>
          <span className="text-sm font-bold text-ink/70">Privacy</span>
          <select name="privacy" defaultValue="private" className="mt-2 w-full rounded-lg border border-ink/15 px-4 py-3 outline-none ring-grape/20 focus:border-grape focus:ring-4">
            <option value="private">Private</option>
            <option value="friends">Friends</option>
            <option value="public">Public</option>
          </select>
        </label>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <label>
          <span className="flex items-center gap-2 text-sm font-bold text-ink/70"><MapPin className="h-4 w-4" /> Venue name</span>
          <input name="venue_name" className="mt-2 w-full rounded-lg border border-ink/15 px-4 py-3 outline-none ring-grape/20 focus:border-grape focus:ring-4" placeholder="Venue name" />
        </label>
        <label>
          <span className="text-sm font-bold text-ink/70">Venue city</span>
          <input name="venue_city" className="mt-2 w-full rounded-lg border border-ink/15 px-4 py-3 outline-none ring-grape/20 focus:border-grape focus:ring-4" placeholder="Mumbai" />
        </label>
      </div>

      <section className="rounded-lg border border-ink/10 bg-ink/[0.03] p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-black text-ink">Drinks</h2>
            <p className="text-sm text-ink/60">Add each drink type for the night. Totals are calculated from quantities and prices.</p>
          </div>
          <button type="button" onClick={() => setDrinks((current) => [...current, emptyDrink()])} className="inline-flex items-center justify-center gap-2 rounded-lg border border-ink/15 bg-white px-4 py-2 text-sm font-black text-ink">
            <CirclePlus className="h-4 w-4" />
            Add drink
          </button>
        </div>

        <div className="mt-4 grid gap-4">
          {drinks.map((drink, index) => {
            const rowTotal = drink.totalPrice ? parseMoney(drink.totalPrice) : parseMoney(drink.unitPrice) * Number(drink.quantity || 0);
            return (
              <div key={drink.id} className="grid gap-3 rounded-lg border border-ink/10 bg-white p-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-black text-ink">Drink {index + 1}</p>
                  <button type="button" onClick={() => removeDrink(drink.id)} disabled={drinks.length === 1} className="grid h-9 w-9 place-items-center rounded-lg border border-ink/10 text-ink/60 disabled:cursor-not-allowed disabled:opacity-40" aria-label="Remove drink">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <label>
                    <span className="text-xs font-bold text-ink/60">Drink type</span>
                    <input value={drink.drinkType} onChange={(event) => updateDrink(drink.id, { drinkType: event.target.value })} className="mt-1 w-full rounded-lg border border-ink/15 px-3 py-2 outline-none ring-grape/20 focus:border-grape focus:ring-4" placeholder="beer, wine, mocktail" />
                  </label>
                  <label>
                    <span className="text-xs font-bold text-ink/60">Drink name</span>
                    <input value={drink.drinkName} onChange={(event) => updateDrink(drink.id, { drinkName: event.target.value })} className="mt-1 w-full rounded-lg border border-ink/15 px-3 py-2 outline-none ring-grape/20 focus:border-grape focus:ring-4" placeholder="IPA, house red, soda lime" />
                  </label>
                </div>
                <div className="grid gap-3 md:grid-cols-4">
                  <label>
                    <span className="text-xs font-bold text-ink/60">Quantity</span>
                    <input type="number" min="1" value={drink.quantity} onChange={(event) => updateDrink(drink.id, { quantity: Number(event.target.value) })} className="mt-1 w-full rounded-lg border border-ink/15 px-3 py-2 outline-none ring-grape/20 focus:border-grape focus:ring-4" />
                  </label>
                  <label>
                    <span className="text-xs font-bold text-ink/60">Unit price</span>
                    <input inputMode="decimal" value={drink.unitPrice} onChange={(event) => updateDrink(drink.id, { unitPrice: event.target.value })} className="mt-1 w-full rounded-lg border border-ink/15 px-3 py-2 outline-none ring-grape/20 focus:border-grape focus:ring-4" placeholder="12" />
                  </label>
                  <label>
                    <span className="text-xs font-bold text-ink/60">Total price</span>
                    <input inputMode="decimal" value={drink.totalPrice} onChange={(event) => updateDrink(drink.id, { totalPrice: event.target.value })} className="mt-1 w-full rounded-lg border border-ink/15 px-3 py-2 outline-none ring-grape/20 focus:border-grape focus:ring-4" placeholder={rowTotal ? rowTotal.toFixed(2) : "0"} />
                  </label>
                  <label className="flex items-end gap-2 rounded-lg border border-ink/10 px-3 py-2">
                    <input type="checkbox" checked={drink.isAlcoholic} onChange={(event) => updateDrink(drink.id, { isAlcoholic: event.target.checked })} className="h-4 w-4 accent-grape" />
                    <span className="text-xs font-bold text-ink/70">Alcoholic</span>
                  </label>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <div className="grid gap-5 md:grid-cols-3">
        <label>
          <span className="text-sm font-bold text-ink/70">Manual spend override</span>
          <input name="total_spend" inputMode="decimal" className="mt-2 w-full rounded-lg border border-ink/15 px-4 py-3 outline-none ring-grape/20 focus:border-grape focus:ring-4" placeholder={calculatedSpend ? calculatedSpend.toFixed(2) : "Optional"} />
        </label>
        <label>
          <span className="text-sm font-bold text-ink/70">Currency</span>
          <select name="currency" defaultValue="USD" className="mt-2 w-full rounded-lg border border-ink/15 px-4 py-3 outline-none ring-grape/20 focus:border-grape focus:ring-4">
            <option value="USD">USD</option>
            <option value="INR">INR</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
          </select>
        </label>
        <div className="rounded-lg bg-ink/5 px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-ink/45">Calculated</p>
          <p className="text-sm font-black text-ink">{totalDrinks} drinks · {calculatedSpend.toFixed(2)} spend</p>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <label>
          <span className="text-sm font-bold text-ink/70">Mood before</span>
          <input name="mood_before" type="number" min="0" max="10" className="mt-2 w-full rounded-lg border border-ink/15 px-4 py-3 outline-none ring-grape/20 focus:border-grape focus:ring-4" placeholder="0-10" />
        </label>
        <label>
          <span className="text-sm font-bold text-ink/70">Mood after</span>
          <input name="mood_after" type="number" min="0" max="10" className="mt-2 w-full rounded-lg border border-ink/15 px-4 py-3 outline-none ring-grape/20 focus:border-grape focus:ring-4" placeholder="0-10" />
        </label>
        <label>
          <span className="text-sm font-bold text-ink/70">Hangover rating</span>
          <input name="hangover_rating" type="number" min="0" max="10" className="mt-2 w-full rounded-lg border border-ink/15 px-4 py-3 outline-none ring-grape/20 focus:border-grape focus:ring-4" placeholder="0-10" />
        </label>
      </div>

      <label>
        <span className="text-sm font-bold text-ink/70">Notes</span>
        <textarea name="notes" className="mt-2 min-h-28 w-full rounded-lg border border-ink/15 px-4 py-3 outline-none ring-grape/20 focus:border-grape focus:ring-4" placeholder="Food, transport, mood, hydration, anything worth remembering." />
      </label>

      {error ? <p className="rounded-lg bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{error}</p> : null}
      {success ? <p className="rounded-lg bg-mint/10 px-4 py-3 text-sm font-bold text-green-800">{success}</p> : null}

      <button type="submit" disabled={pending} className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-ink px-5 py-3 font-black text-white shadow-soft disabled:cursor-not-allowed disabled:opacity-65 sm:w-fit">
        <Plus className="h-5 w-5" aria-hidden="true" />
        {pending ? "Saving activity..." : "Save activity"}
      </button>
    </form>
  );
}
