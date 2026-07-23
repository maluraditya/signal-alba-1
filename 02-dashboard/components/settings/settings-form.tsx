"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function SettingsForm() {
  const [dark, setDark] = useState(false);
  const inputClass = "mt-1.5 h-10 w-full rounded-lg border border-[#dedfd8] bg-[#fafaf7] px-3 text-xs outline-none focus:ring-2 focus:ring-[#d8ff72]";
  return (
    <div className="mt-7 grid gap-4 lg:grid-cols-[1fr_360px]">
      <Card className="p-6">
        <h2 className="text-sm font-semibold">Profile</h2><p className="mt-1 text-[11px] text-[#85877e]">Used for ownership, mentions, and activity attribution.</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="text-[11px] font-medium text-[#5c5e56]">Full name<input className={inputClass} defaultValue="Alex Morgan" /></label>
          <label className="text-[11px] font-medium text-[#5c5e56]">Email<input className={inputClass} defaultValue="alex@acme.co" type="email" /></label>
          <label className="text-[11px] font-medium text-[#5c5e56]">Timezone<select className={inputClass} defaultValue="America/Los_Angeles"><option value="America/Los_Angeles">Pacific Time (US)</option><option value="Asia/Kolkata">India Standard Time</option><option value="Europe/London">London</option></select></label>
          <label className="text-[11px] font-medium text-[#5c5e56]">Default currency<select className={inputClass}><option>USD — US Dollar</option><option>EUR — Euro</option><option>GBP — British Pound</option></select></label>
        </div>
        <div className="mt-6 flex justify-end border-t border-[#e6e7e0] pt-5"><Button onClick={() => toast.success("Settings saved")}>Save changes</Button></div>
      </Card>
      <div className="space-y-4">
        <Card className="p-5"><h2 className="text-sm font-semibold">Appearance</h2><p className="mt-1 text-[11px] text-[#85877e]">Choose how your workspace feels.</p><button onClick={() => setDark((value) => !value)} className="mt-5 flex w-full items-center justify-between rounded-xl border border-[#dedfd8] p-4 text-left"><div><p className="text-xs font-medium">Dark interface</p><p className="mt-1 text-[10px] text-[#8b8d84]">Reduce glare in low light.</p></div><span className={`relative h-5 w-9 rounded-full transition ${dark ? "bg-[#20211d]" : "bg-[#dfe0d9]"}`}><span className={`absolute top-0.5 size-4 rounded-full bg-white shadow transition ${dark ? "left-[18px]" : "left-0.5"}`} /></span></button></Card>
        <Card className="p-5"><h2 className="text-sm font-semibold">Data & security</h2><p className="mt-1 text-[11px] leading-5 text-[#85877e]">Your workspace is isolated with PostgreSQL Row Level Security. Exports include only records you own.</p><Button variant="outline" size="sm" className="mt-4">Export my data</Button></Card>
      </div>
    </div>
  );
}
