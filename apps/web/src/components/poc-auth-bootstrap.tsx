"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { isPocMode } from "@/lib/poc";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function PocAuthBootstrap({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(!isPocMode());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isPocMode()) return;

    void (async () => {
      const supabase = createClient();
      const { data: existing } = await supabase.auth.getUser();
      if (existing.user) {
        setReady(true);
        return;
      }

      const res = await fetch("/api/poc/bootstrap");
      const body = (await res.json().catch(() => ({}))) as { error?: string; ok?: boolean };

      if (!res.ok) {
        const msg =
          body.error ??
          (res.status === 500
            ? "POC sign-in failed on the server. Check the terminal for details."
            : `POC sign-in failed (${res.status})`);
        setError(msg);
        toast.error(msg);
        setReady(true);
        return;
      }

      const { data: after } = await supabase.auth.getUser();
      if (!after.user) {
        setError("Session was not created. Restart the dev server and try again.");
        setReady(true);
        router.refresh();
        return;
      }

      setReady(true);
      router.refresh();
    })();
  }, [router]);

  if (!ready) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-muted-foreground">
        Starting POC session…
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-lg p-8">
        <Alert variant="destructive">
          <AlertTitle>Could not connect to Supabase</AlertTitle>
          <AlertDescription className="mt-2 space-y-2">
            <p>{error}</p>
            <p className="text-sm">
              Also confirm the SQL migration ran in your Supabase project and the dev server URL matches{" "}
              <code className="text-xs">NEXT_PUBLIC_APP_URL</code> (try{" "}
              <a href="http://localhost:3001/dashboard" className="underline">localhost:3001</a> if port 3000 is busy).
            </p>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return <>{children}</>;
}
