"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { Mic, BookOpen, LayoutDashboard, UserCircle, Radio } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/library", label: "Answer library", icon: BookOpen },
  { href: "/profiles", label: "Profiles", icon: UserCircle },
  { href: "/live", label: "Live interview", icon: Radio },
];

export function AppShell({ children, pocMode = false }: { children: React.ReactNode; pocMode?: boolean }) {
  const pathname = usePathname();

  async function signOut() {
    if (pocMode) {
      window.location.href = "/dashboard";
      return;
    }
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <aside className="hidden w-56 shrink-0 border-r border-border bg-card/40 p-4 md:flex md:flex-col">
        <div className="mb-8 px-2">
          <div className="flex items-center gap-2">
            <Mic className="h-5 w-5 text-emerald-400" />
            <span className="font-semibold tracking-tight">Interview Copilot</span>
          </div>
          {pocMode && (
            <Badge variant="outline" className="mt-2 text-[10px]">POC — no login</Badge>
          )}
        </div>
        <nav className="flex flex-1 flex-col gap-1">
          {nav.map((item) => {
            const Icon = item.icon;
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                  active ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted/60"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        {!pocMode && (
          <Button variant="outline" size="sm" onClick={() => void signOut()}>
            Sign out
          </Button>
        )}
      </aside>
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
