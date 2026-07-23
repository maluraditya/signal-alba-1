"use client";

import { useMemo, useState } from "react";
import { Mail, MoreHorizontal, Phone } from "lucide-react";
import type { Contact } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ListToolbar } from "@/components/shared/list-toolbar";
import { initials } from "@/lib/utils";

export function ContactsTable({ contacts }: { contacts: Contact[] }) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(
    () => contacts.filter((contact) => `${contact.first_name} ${contact.last_name} ${contact.email} ${contact.company?.name}`.toLowerCase().includes(query.toLowerCase())),
    [contacts, query],
  );
  return (
    <Card className="mt-7 overflow-hidden">
      <ListToolbar query={query} onQueryChange={setQuery} placeholder="Search people..." />
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left">
          <thead>
            <tr className="border-b border-[#e6e7e0] bg-[#fafaf7] text-[10px] font-semibold uppercase tracking-wider text-[#8b8d84]">
              <th className="px-5 py-3">Contact</th>
              <th className="px-5 py-3">Company</th>
              <th className="px-5 py-3">Role</th>
              <th className="px-5 py-3">Contact details</th>
              <th className="w-12 px-3 py-3"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#ecece6]">
            {filtered.map((contact, index) => (
              <tr key={contact.id} className="text-[12px] hover:bg-[#fafaf7]">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <span className={`grid size-9 place-items-center rounded-full text-[10px] font-semibold ${index % 2 ? "bg-[#e8e3f8] text-[#605377]" : "bg-[#e9f2d8] text-[#5d7926]"}`}>{initials(`${contact.first_name} ${contact.last_name}`)}</span>
                    <div>
                      <p className="font-medium">{contact.first_name} {contact.last_name}</p>
                      <p className="mt-1 text-[10px] text-[#92948b]">{contact.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 font-medium text-[#4f514a]">{contact.company?.name}</td>
                <td className="px-5 py-4 text-[#707269]">{contact.title}</td>
                <td className="px-5 py-4">
                  <div className="flex gap-1">
                    <a href={`mailto:${contact.email}`} className="rounded-md border border-[#dedfd8] p-2 text-[#777970] hover:bg-[#f0f1eb]" aria-label={`Email ${contact.first_name}`}><Mail className="size-3.5" /></a>
                    {contact.phone ? <a href={`tel:${contact.phone}`} className="rounded-md border border-[#dedfd8] p-2 text-[#777970] hover:bg-[#f0f1eb]" aria-label={`Call ${contact.first_name}`}><Phone className="size-3.5" /></a> : null}
                  </div>
                </td>
                <td className="px-3 py-4"><Button variant="ghost" size="icon" aria-label={`Actions for ${contact.first_name}`}><MoreHorizontal className="size-4" /></Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="border-t border-[#e6e7e0] px-5 py-3 text-[10px] text-[#8b8d84]">{filtered.length} contacts</div>
    </Card>
  );
}
