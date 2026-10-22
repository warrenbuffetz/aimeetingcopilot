import { createClient } from "@/lib/supabase/server";
import type { User } from "@supabase/supabase-js";

export async function requireUser(): Promise<User> {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    throw new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }
  return data.user;
}
