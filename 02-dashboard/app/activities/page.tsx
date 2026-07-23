import type { Metadata } from "next";
import { Plus } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { ActivityList } from "@/components/activities/activity-list";
import { Button } from "@/components/ui/button";
import { loadActivities } from "@/lib/data/loaders";

export const metadata: Metadata = { title: "Activities" };

export default async function ActivitiesPage() {
  const activities = await loadActivities();
  return (
    <AppShell><div className="mx-auto max-w-[1540px] px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <PageHeader eyebrow="Focus" title="Activities" description="A clear queue of the follow-ups, meetings, and commitments that move revenue." actions={<Button><Plus className="size-4" /> Add activity</Button>} />
      <ActivityList initialActivities={activities} />
    </div></AppShell>
  );
}
