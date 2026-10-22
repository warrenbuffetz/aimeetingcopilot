"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { isPocMode } from "@/lib/poc";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/env";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isPocMode()) router.replace("/dashboard");
  }, [router]);

  if (!isSupabaseConfigured()) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <Alert className="max-w-md">
          <AlertDescription>
            Configure <code className="text-xs">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
            <code className="text-xs">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> in{" "}
            <code className="text-xs">apps/web/.env.local</code>. See README for setup.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    window.location.href = "/dashboard";
  }

  async function signUp() {
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) toast.error(error.message);
    else toast.success("Check your email to confirm, or sign in if confirmations are disabled.");
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <Card className="w-full max-w-md border-border/80">
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
          <CardDescription>Your preparation library is private to your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              Sign in
            </Button>
            <Button type="button" variant="secondary" className="w-full" disabled={loading} onClick={signUp}>
              Create account
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            <Link href="/">Back to home</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
