import type { SupabaseClient } from "@supabase/supabase-js";
import type { AnalyticsPayload } from "@/lib/types";

export const ANALYTICS_RPC = "get_dashboard_analytics";

export async function getDashboardAnalytics(
  client: SupabaseClient,
): Promise<AnalyticsPayload> {
  const { data: auth, error: authError } = await client.auth.getUser();
  if (authError || !auth.user) throw new Error("Authentication required");
  const { data, error } = await client.rpc(ANALYTICS_RPC);
  if (error) throw error;
  return data as AnalyticsPayload;
}
