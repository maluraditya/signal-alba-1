import { redirect } from "next/navigation";
import { demoActivities, demoAnalytics, demoCompanies, demoContacts, demoDeals } from "@/lib/demo-data";
import type { Activity, AnalyticsPayload, Company, Contact, Deal } from "@/lib/types";
import { createClient } from "@/lib/supabase/server";
import { getDashboardAnalytics } from "./analytics";
import { repositories } from "./service";

export const isSupabaseConfigured = () =>
  Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );

async function authenticatedRepositories() {
  const client = await createClient();
  const {
    data: { user },
  } = await client.auth.getUser();
  if (!user) redirect("/login");
  return { client, repos: repositories(client) };
}

export async function loadCompanies(): Promise<Company[]> {
  if (!isSupabaseConfigured()) return demoCompanies;
  const { repos } = await authenticatedRepositories();
  return (await repos.companies.list({ pageSize: 50 })).data;
}

export async function loadContacts(): Promise<Contact[]> {
  if (!isSupabaseConfigured()) return demoContacts;
  const { repos } = await authenticatedRepositories();
  return (await repos.contacts.list({ pageSize: 50 })).data;
}

export async function loadDeals(): Promise<Deal[]> {
  if (!isSupabaseConfigured()) return demoDeals;
  const { repos } = await authenticatedRepositories();
  return (await repos.deals.list({ pageSize: 50 })).data;
}

export async function loadActivities(): Promise<Activity[]> {
  if (!isSupabaseConfigured()) return demoActivities;
  const { repos } = await authenticatedRepositories();
  return (await repos.activities.list({ pageSize: 50 })).data;
}

export async function loadAnalytics(): Promise<AnalyticsPayload> {
  if (!isSupabaseConfigured()) return demoAnalytics;
  const { client } = await authenticatedRepositories();
  return getDashboardAnalytics(client);
}

export async function loadDashboard() {
  if (!isSupabaseConfigured()) {
    return {
      analytics: demoAnalytics,
      deals: demoDeals,
      activities: demoActivities,
    };
  }
  const { client, repos } = await authenticatedRepositories();
  const [analytics, deals, activities] = await Promise.all([
    getDashboardAnalytics(client),
    repos.deals.list({ pageSize: 4 }),
    repos.activities.list({ pageSize: 4 }),
  ]);
  return { analytics, deals: deals.data, activities: activities.data };
}

export async function requirePageUser() {
  if (!isSupabaseConfigured()) return;
  await authenticatedRepositories();
}
