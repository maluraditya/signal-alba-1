"use client";

import { useMemo, useState } from "react";
import { Check, Clock3, Mail, Phone, Video, ListTodo } from "lucide-react";
import { toast } from "sonner";
import type { Activity } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ListToolbar } from "@/components/shared/list-toolbar";

const icons = { call: Phone, email: Mail, meeting: Video, task: ListTodo, note: ListTodo };

export function ActivityList({ initialActivities }: { initialActivities: Activity[] }) {
  const [activities, setActivities] = useState(initialActivities);
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => activities.filter((activity) => `${activity.title} ${activity.deal?.name}`.toLowerCase().includes(query.toLowerCase())), [activities, query]);
  const complete = (activity: Activity) => {
    setActivities((current) => current.map((item) => item.id === activity.id ? { ...item, completed_at: new Date().toISOString() } : item));
    toast.success("Activity completed");
  };
  return (
    <Card className="mt-7 overflow-hidden">
      <ListToolbar query={query} onQueryChange={setQuery} placeholder="Search activities..." />
      <div className="divide-y divide-[#e9eae3]">
        {filtered.map((activity) => {
          const Icon = icons[activity.type];
          const completed = Boolean(activity.completed_at);
          return (
            <div key={activity.id} className="flex items-center gap-4 px-5 py-4 hover:bg-[#fafaf7] sm:px-6">
              <button onClick={() => complete(activity)} disabled={completed} aria-label={`Mark ${activity.title} complete`} className={`grid size-8 shrink-0 place-items-center rounded-full border transition ${completed ? "border-[#b8d789] bg-[#eaf4db] text-[#63862d]" : "border-[#d7d9d0] bg-white text-transparent hover:border-[#96b94f] hover:text-[#96b94f]"}`}><Check className="size-4" /></button>
              <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-[#f0f1eb] text-[#707269]"><Icon className="size-4" /></span>
              <div className="min-w-0 flex-1">
                <p className={`truncate text-[13px] font-medium ${completed ? "text-[#95978e] line-through" : ""}`}>{activity.title}</p>
                <p className="mt-1 truncate text-[10px] text-[#8a8c83]">{activity.deal?.name} · {activity.description}</p>
              </div>
              <div className="hidden text-right sm:block">
                <p className="flex items-center gap-1 text-[11px] font-medium text-[#5e7242]"><Clock3 className="size-3" /> {completed ? "Completed" : "Upcoming"}</p>
                <p className="mt-1 text-[10px] text-[#96988f]">{activity.due_at ? new Date(activity.due_at).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }) : "No due date"}</p>
              </div>
              <Button variant="ghost" size="sm">Open</Button>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
