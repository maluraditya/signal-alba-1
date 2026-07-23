"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import * as Dialog from "@radix-ui/react-dialog";
import { ArrowRight, Search } from "lucide-react";
import { NAV_ITEMS } from "@/lib/constants";
import { demoCompanies, demoContacts, demoDeals } from "@/lib/demo-data";

export function CommandMenu({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        onOpenChange(!open);
      }
    };
    document.addEventListener("keydown", listener);
    return () => document.removeEventListener("keydown", listener);
  }, [onOpenChange, open]);

  const select = (path: string) => {
    router.push(path);
    onOpenChange(false);
    setQuery("");
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-[15vh] z-50 w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 overflow-hidden rounded-2xl border border-white/10 bg-[#171815] text-white shadow-2xl">
          <Dialog.Title className="sr-only">Search PipelineOS</Dialog.Title>
          <Command shouldFilter>
            <div className="flex items-center border-b border-white/[0.08] px-4">
              <Search className="size-4 text-[#777970]" />
              <Command.Input
                value={query}
                onValueChange={setQuery}
                placeholder="Search companies, contacts, deals..."
                className="h-14 w-full bg-transparent px-3 text-sm outline-none placeholder:text-[#676961]"
              />
              <kbd className="rounded border border-white/10 px-1.5 py-0.5 text-[10px] text-[#777970]">ESC</kbd>
            </div>
            <Command.List className="max-h-[420px] overflow-y-auto p-2">
              <Command.Empty className="p-8 text-center text-sm text-[#85877f]">No results found.</Command.Empty>
              <Command.Group heading="Navigate" className="px-2 py-2 text-[10px] font-semibold uppercase tracking-wider text-[#66685f]">
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Command.Item
                      key={item.href}
                      value={`${item.label} page`}
                      onSelect={() => select(item.href)}
                      className="mt-1 flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] capitalize text-[#c8c9c3] data-[selected=true]:bg-white/[0.08] data-[selected=true]:text-white"
                    >
                      <Icon className="size-4" />
                      {item.label}
                      <ArrowRight className="ml-auto size-3.5 opacity-40" />
                    </Command.Item>
                  );
                })}
              </Command.Group>
              <Command.Group heading="Records" className="px-2 py-2 text-[10px] font-semibold uppercase tracking-wider text-[#66685f]">
                {demoCompanies.map((company) => (
                  <Command.Item key={company.id} value={`company ${company.name} ${company.domain}`} onSelect={() => select("/companies")} className="mt-1 cursor-pointer rounded-lg px-3 py-2.5 text-[13px] normal-case text-[#c8c9c3] data-[selected=true]:bg-white/[0.08]">
                    <span className="text-white">{company.name}</span>
                    <span className="ml-2 text-[#686a63]">Company</span>
                  </Command.Item>
                ))}
                {demoContacts.map((contact) => (
                  <Command.Item key={contact.id} value={`contact ${contact.first_name} ${contact.last_name} ${contact.email}`} onSelect={() => select("/contacts")} className="mt-1 cursor-pointer rounded-lg px-3 py-2.5 text-[13px] normal-case text-[#c8c9c3] data-[selected=true]:bg-white/[0.08]">
                    <span className="text-white">{contact.first_name} {contact.last_name}</span>
                    <span className="ml-2 text-[#686a63]">Contact</span>
                  </Command.Item>
                ))}
                {demoDeals.map((deal) => (
                  <Command.Item key={deal.id} value={`deal ${deal.name} ${deal.company?.name}`} onSelect={() => select("/deals")} className="mt-1 cursor-pointer rounded-lg px-3 py-2.5 text-[13px] normal-case text-[#c8c9c3] data-[selected=true]:bg-white/[0.08]">
                    <span className="text-white">{deal.name}</span>
                    <span className="ml-2 text-[#686a63]">Deal</span>
                  </Command.Item>
                ))}
              </Command.Group>
            </Command.List>
          </Command>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
