import type { Metadata } from "next";
import { UserPlus } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { ContactsTable } from "@/components/contacts/contacts-table";
import { Button } from "@/components/ui/button";
import { loadContacts } from "@/lib/data/loaders";

export const metadata: Metadata = { title: "Contacts" };

export default async function ContactsPage() {
  const contacts = await loadContacts();
  return (
    <AppShell><div className="mx-auto max-w-[1540px] px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <PageHeader eyebrow="Relationships" title="Contacts" description="Every stakeholder, conversation, and decision-maker in one calm workspace." actions={<Button><UserPlus className="size-4" /> Add contact</Button>} />
      <ContactsTable contacts={contacts} />
    </div></AppShell>
  );
}
