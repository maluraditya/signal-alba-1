"use client";

import { useMemo, useState } from "react";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import type { Company } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ListToolbar } from "@/components/shared/list-toolbar";
import { formatCompactCurrency, initials } from "@/lib/utils";

export function CompaniesTable({ companies }: { companies: Company[] }) {
  const [query, setQuery] = useState("");
  const [ascending, setAscending] = useState(true);
  const filtered = useMemo(
    () =>
      companies
        .filter((company) =>
          `${company.name} ${company.industry} ${company.location}`.toLowerCase().includes(query.toLowerCase()),
        )
        .sort((a, b) => (ascending ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name))),
    [ascending, companies, query],
  );
  return (
    <Card className="mt-7 overflow-hidden">
      <ListToolbar query={query} onQueryChange={setQuery} placeholder="Search companies..." />
      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] border-collapse text-left">
          <thead>
            <tr className="border-b border-[#e6e7e0] bg-[#fafaf7] text-[10px] font-semibold uppercase tracking-wider text-[#8b8d84]">
              <th className="px-5 py-3">
                <button onClick={() => setAscending((value) => !value)} className="flex items-center gap-1.5">
                  Company <ArrowUpDown className="size-3" />
                </button>
              </th>
              <th className="px-5 py-3">Industry</th>
              <th className="px-5 py-3">Team</th>
              <th className="px-5 py-3">Location</th>
              <th className="px-5 py-3 text-right">Revenue</th>
              <th className="w-12 px-3 py-3"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#ecece6]">
            {filtered.map((company, index) => (
              <tr key={company.id} className="group text-[12px] transition hover:bg-[#fafaf7]">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <span className={`grid size-9 place-items-center rounded-lg text-[10px] font-semibold ${["bg-[#ecf4d8] text-[#56701f]", "bg-[#e8e3f8] text-[#605377]", "bg-[#f7e8da] text-[#8b5b35]"][index % 3]}`}>
                      {initials(company.name)}
                    </span>
                    <div>
                      <p className="font-medium text-[#24251f]">{company.name}</p>
                      <p className="mt-1 text-[10px] text-[#92948b]">{company.domain}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4"><Badge>{company.industry}</Badge></td>
                <td className="px-5 py-4 text-[#5f6159]">{company.size}</td>
                <td className="px-5 py-4 text-[#5f6159]">{company.location}</td>
                <td className="px-5 py-4 text-right font-medium">{formatCompactCurrency(company.annual_revenue ?? 0)}</td>
                <td className="px-3 py-4">
                  <Button variant="ghost" size="icon" aria-label={`Actions for ${company.name}`}><MoreHorizontal className="size-4" /></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between border-t border-[#e6e7e0] px-5 py-3 text-[10px] text-[#8b8d84]">
        <span>{filtered.length} companies</span>
        <span>Page 1 of 1</span>
      </div>
    </Card>
  );
}
