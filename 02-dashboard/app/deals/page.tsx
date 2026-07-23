import type { Metadata } from "next";
import { Download } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { DealsWorkspace } from "@/components/deals/deals-workspace";
import { Button } from "@/components/ui/button";
import { loadCompanies, loadDeals } from "@/lib/data/loaders";

export const metadata: Metadata = { title: "Deals" };

export default async function DealsPage() {
  const [companies, deals] = await Promise.all([loadCompanies(), loadDeals()]);
  return (
    <AppShell><div className="mx-auto max-w-[1540px] px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <PageHeader eyebrow="Revenue" title="Deals" description="Move opportunities forward with a pipeline that stays focused on signal." actions={<Button variant="outline" className="hidden sm:inline-flex"><Download className="size-4" /> Export</Button>} />
      <DealsWorkspace initialDeals={deals} companies={companies} />
    </div></AppShell>
  );
}
