import { MapPin, Pencil, UserRound } from "lucide-react";
import { Card, PageShell, Pill } from "@/components/ui";

export default function ProfilePage() {
  return (
    <PageShell eyebrow="Profile" title="Your Drunkva identity" description="A simple profile placeholder for display details, favorite venues, and privacy-minded preferences.">
      <div className="grid gap-4 lg:grid-cols-[360px_1fr]">
        <Card>
          <div className="grid h-24 w-24 place-items-center rounded-full bg-grape text-3xl font-black text-white">JP</div>
          <h2 className="mt-5 text-2xl font-black text-ink">Jazzy Pat</h2>
          <p className="mt-2 flex items-center gap-2 text-sm font-bold text-ink/55">
            <MapPin className="h-4 w-4" aria-hidden="true" />
            Mumbai and weekend trips
          </p>
          <button type="button" className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-ink/15 px-4 py-3 font-black text-ink">
            <Pencil className="h-4 w-4" aria-hidden="true" />
            Edit profile
          </button>
        </Card>
        <Card>
          <UserRound className="h-6 w-6 text-punch" aria-hidden="true" />
          <h2 className="mt-4 text-2xl font-black text-ink">Profile highlights</h2>
          <div className="mt-5 flex flex-wrap gap-2">
            <Pill tone="blue">Prefers lounges</Pill>
            <Pill tone="green">Hydration reminders on</Pill>
            <Pill tone="orange">Budget mindful</Pill>
          </div>
          <p className="mt-5 max-w-2xl leading-7 text-ink/65">
            Future profile data can include privacy controls, favorite venue types, preferred reminder settings, and personal notes.
          </p>
        </Card>
      </div>
    </PageShell>
  );
}
