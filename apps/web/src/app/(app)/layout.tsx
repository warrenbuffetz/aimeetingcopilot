import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import { isPocMode } from "@/lib/poc";
import { AppShell } from "@/components/app-shell";
import { PocAuthBootstrap } from "@/components/poc-auth-bootstrap";

export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  if (!isSupabaseConfigured()) {
    return (
      <div className="max-w-lg space-y-2 p-8 text-sm text-muted-foreground">
        <p className="font-medium text-foreground">Supabase is not configured</p>
        <p>
          Create <code className="text-xs">apps/web/.env.local</code> (copy from{" "}
          <code className="text-xs">.env.example</code>) with your project URL and publishable key,
          then restart <code className="text-xs">npm run dev</code>.
        </p>
      </div>
    );
  }

  const poc = isPocMode();

  if (!poc) {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    if (!data.user) {
      redirect("/login");
    }
  }

  return (
    <AppShell pocMode={poc}>
      <PocAuthBootstrap>{children}</PocAuthBootstrap>
    </AppShell>
  );
}
