import { Card, PageShell } from "@/components/ui";
import { CreateActivityForm } from "@/components/activity/create-activity-form";

export default function CreateActivityPage() {
  return (
    <PageShell eyebrow="Create activity" title="Log a night out" description="Capture the venue, drinks, spend, mood, hangover notes, and privacy for your own feed.">
      <Card className="max-w-5xl">
        <CreateActivityForm />
      </Card>
    </PageShell>
  );
}
