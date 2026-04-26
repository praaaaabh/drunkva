import { Bell, LockKeyhole, Moon, ShieldCheck } from "lucide-react";
import { Card, PageShell } from "@/components/ui";

const settings = [
  { title: "Privacy", text: "Choose who can see your logged nights and friend tags.", icon: LockKeyhole },
  { title: "Reminders", text: "Set gentle hydration, budget, and next-day check-in prompts.", icon: Bell },
  { title: "Wellness", text: "Tune hangover, sleep, and mood tracking preferences.", icon: Moon },
  { title: "Responsible defaults", text: "Keep the app focused on reflection and safer choices.", icon: ShieldCheck }
];

export default function SettingsPage() {
  return (
    <PageShell eyebrow="Settings" title="Make Drunkva fit your nights" description="Placeholder controls for privacy, reminders, and responsible tracking defaults.">
      <div className="grid gap-4 md:grid-cols-2">
        {settings.map(({ title, text, icon: Icon }) => (
          <Card key={title}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-ink">{title}</h2>
                <p className="mt-2 leading-7 text-ink/65">{text}</p>
              </div>
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-ink text-white">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
            </div>
            <div className="mt-5 flex items-center justify-between rounded-lg bg-ink/5 p-3">
              <span className="text-sm font-bold text-ink/65">UI placeholder</span>
              <span className="h-6 w-11 rounded-full bg-grape p-1">
                <span className="block h-4 w-4 rounded-full bg-white" />
              </span>
            </div>
          </Card>
        ))}
      </div>
    </PageShell>
  );
}
