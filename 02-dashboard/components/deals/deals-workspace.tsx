"use client";

import { useMemo, useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowDownUp, Calendar, Kanban, List, MoreHorizontal, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { Company, Deal, DealStage } from "@/lib/types";
import { DEAL_STAGES, DEMO_OWNER_ID } from "@/lib/constants";
import { formatCompactCurrency, formatDate } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ListToolbar } from "@/components/shared/list-toolbar";
import { DealDialog, type DealFormValues } from "./deal-dialog";

const stageStyle: Record<DealStage, string> = {
  lead: "bg-[#eeeeea] text-[#62645c]",
  qualified: "bg-[#e7eef4] text-[#4c687c]",
  proposal: "bg-[#eee9f7] text-[#695b81]",
  negotiation: "bg-[#f7eedb] text-[#8b6b2b]",
  closed_won: "bg-[#e9f4d8] text-[#5c7b26]",
  closed_lost: "bg-[#f5e5e3] text-[#945952]",
};

export function DealsWorkspace({ initialDeals, companies }: { initialDeals: Deal[]; companies: Company[] }) {
  const [deals, setDeals] = useState(initialDeals);
  const [query, setQuery] = useState("");
  const [stage, setStage] = useState<DealStage | "all">("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Deal | null>(null);
  const [, startTransition] = useTransition();

  const filtered = useMemo(
    () => deals.filter((deal) => (stage === "all" || deal.stage === stage) && `${deal.name} ${deal.company?.name} ${deal.source}`.toLowerCase().includes(query.toLowerCase())),
    [deals, query, stage],
  );

  const saveDeal = (values: DealFormValues) => {
    const company = companies.find((item) => item.id === values.company_id);
    startTransition(() => {
      if (editing) {
        setDeals((current) => current.map((deal) => deal.id === editing.id ? { ...deal, ...values, company, updated_at: new Date().toISOString() } : deal));
        toast.success("Opportunity updated");
      } else {
        const now = new Date().toISOString();
        setDeals((current) => [{
          ...values,
          id: crypto.randomUUID(),
          owner_id: DEMO_OWNER_ID,
          created_at: now,
          updated_at: now,
          contact_id: null,
          closed_at: values.stage === "closed_won" || values.stage === "closed_lost" ? now : null,
          lost_reason: null,
          company,
          contact: null,
          tags: [],
        }, ...current]);
        toast.success("Opportunity created");
      }
      setEditing(null);
    });
  };

  const removeDeal = (deal: Deal) => {
    const previous = deals;
    setDeals((current) => current.filter((item) => item.id !== deal.id));
    toast("Opportunity deleted", {
      action: { label: "Undo", onClick: () => setDeals(previous) },
    });
  };

  return (
    <>
      <div className="mt-7 flex items-center gap-3">
        <div className="flex flex-1 gap-2 overflow-x-auto pb-1" aria-label="Filter by stage">
          <button onClick={() => setStage("all")} className={`shrink-0 rounded-full px-3 py-1.5 text-[11px] font-medium transition ${stage === "all" ? "bg-[#20211d] text-white" : "border border-[#dcded5] bg-white text-[#73756d] hover:bg-[#f8f8f4]"}`}>All deals <span className="ml-1 opacity-60">{deals.length}</span></button>
          {DEAL_STAGES.slice(0, 5).map((item) => {
            const count = deals.filter((deal) => deal.stage === item.value).length;
            return <button key={item.value} onClick={() => setStage(item.value)} className={`shrink-0 rounded-full px-3 py-1.5 text-[11px] font-medium transition ${stage === item.value ? "bg-[#20211d] text-white" : "border border-[#dcded5] bg-white text-[#73756d] hover:bg-[#f8f8f4]"}`}>{item.label} <span className="ml-1 opacity-60">{count}</span></button>;
          })}
        </div>
        <Button onClick={() => { setEditing(null); setDialogOpen(true); }} className="hidden sm:inline-flex"><Plus className="size-4" /> New deal</Button>
      </div>

      <Card className="mt-3 overflow-hidden">
        <div className="flex items-center border-b border-[#e3e4dd] pr-3">
          <div className="flex-1"><ListToolbar query={query} onQueryChange={setQuery} placeholder="Search opportunities..." /></div>
          <div className="hidden items-center rounded-lg border border-[#dedfd8] p-0.5 sm:flex">
            <Button size="icon" variant="ghost" aria-label="List view" className="size-7 bg-[#edeee8] text-black"><List className="size-3.5" /></Button>
            <Button size="icon" variant="ghost" aria-label="Board view" className="size-7"><Kanban className="size-3.5" /></Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-left">
            <thead><tr className="border-b border-[#e6e7e0] bg-[#fafaf7] text-[10px] font-semibold uppercase tracking-wider text-[#8b8d84]">
              <th className="px-5 py-3">Opportunity</th><th className="px-5 py-3">Stage</th><th className="px-5 py-3">Close date</th><th className="px-5 py-3">Source</th><th className="px-5 py-3 text-right"><span className="inline-flex items-center gap-1">Value <ArrowDownUp className="size-3" /></span></th><th className="w-24 px-3 py-3"><span className="sr-only">Actions</span></th>
            </tr></thead>
            <tbody className="divide-y divide-[#ecece6]">
              <AnimatePresence initial={false}>
                {filtered.map((deal) => (
                  <motion.tr layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -12 }} key={deal.id} className="group text-[12px] hover:bg-[#fafaf7]">
                    <td className="px-5 py-4">
                      <button className="text-left" onClick={() => { setEditing(deal); setDialogOpen(true); }}>
                        <p className="font-medium text-[#24251f]">{deal.name}</p>
                        <p className="mt-1 text-[10px] text-[#92948b]">{deal.company?.name}</p>
                      </button>
                    </td>
                    <td className="px-5 py-4"><Badge className={stageStyle[deal.stage]}>{DEAL_STAGES.find((item) => item.value === deal.stage)?.label}</Badge></td>
                    <td className="px-5 py-4 text-[#66685f]"><span className="flex items-center gap-1.5"><Calendar className="size-3" />{deal.expected_close_date ? formatDate(deal.expected_close_date) : "—"}</span></td>
                    <td className="px-5 py-4 text-[#66685f]">{deal.source}</td>
                    <td className="px-5 py-4 text-right"><p className="font-semibold">{formatCompactCurrency(deal.value)}</p><p className="mt-1 text-[9px] text-[#92948b]">{deal.probability}% weighted</p></td>
                    <td className="px-3 py-4">
                      <div className="flex justify-end opacity-0 transition group-hover:opacity-100 focus-within:opacity-100">
                        <Button variant="ghost" size="icon" aria-label={`Edit ${deal.name}`} onClick={() => { setEditing(deal); setDialogOpen(true); }}><MoreHorizontal className="size-4" /></Button>
                        <Button variant="ghost" size="icon" aria-label={`Delete ${deal.name}`} onClick={() => removeDeal(deal)} className="hover:text-red-500"><Trash2 className="size-3.5" /></Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
        {filtered.length === 0 ? <div className="p-14 text-center"><p className="text-sm font-medium">No opportunities match</p><p className="mt-1 text-xs text-[#85877e]">Clear the filters or create a new deal.</p></div> : null}
        <div className="flex items-center justify-between border-t border-[#e6e7e0] px-5 py-3 text-[10px] text-[#8b8d84]"><span>{filtered.length} opportunities</span><div className="flex items-center gap-2"><Button variant="outline" size="sm" disabled>Previous</Button><span>1 / 1</span><Button variant="outline" size="sm" disabled>Next</Button></div></div>
      </Card>

      <DealDialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) setEditing(null); }} deal={editing} companies={companies} onSubmit={saveDeal} />
      <Button onClick={() => { setEditing(null); setDialogOpen(true); }} className="fixed bottom-6 right-6 z-20 shadow-lg lg:hidden"><Plus className="size-4" /> New deal</Button>
    </>
  );
}
