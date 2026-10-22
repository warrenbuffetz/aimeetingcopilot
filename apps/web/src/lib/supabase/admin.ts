import { createClient } from "@supabase/supabase-js";
import { getServerEnv } from "@/lib/env";

export function createAdminClient() {
  const env = getServerEnv();
  const serviceRole = env.SUPABASE_SERVICE_ROLE_KEY;
  if (!env.NEXT_PUBLIC_SUPABASE_URL || !serviceRole || serviceRole.startsWith("your-")) {
    return null;
  }
  return createClient(env.NEXT_PUBLIC_SUPABASE_URL, serviceRole, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export const POC_DEMO_EMAIL = "poc-demo@interviewcopilot.app";

export function getPocDemoPassword(): string {
  return process.env.POC_DEMO_PASSWORD ?? "InterviewCopilot-Poc-Demo-2026";
}
