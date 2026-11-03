"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { PanelResizeHandle } from "@/components/live/panel-resize-handle";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { Mic, BookOpen, LayoutDashboard, UserCircle, Radio, PanelLeftClose, PanelLeft, LogOut } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { clamp, useHorizontalResize } from "@/hooks/use-horizontal-resize";
import { usePersistedBoolean, usePersistedNumber } from "@/hooks/use-persisted-state";

const JAZ_NAV_WIDTH_KEY = "ic-jaz-app-nav-width";
const JAZ_NAV_DEFAULT = 224;
const JAZ_NAV_MIN = 64;
const JAZ_NAV_MAX = 320;

const NAV_COLLAPSED_KEY = "ic-app-nav-collapsed";

const nav = [
  { href: "/live", label: "Live interview", icon: Radio },
  { href: "/library", label: "Answer library", icon: BookOpen },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/profiles", label: "Profiles", icon: UserCircle },
];

export function AppShell({ children, pocMode = false }: { children: React.ReactNode; pocMode?: boolean }) {
  const pathname = usePathname();
  const jazNavigator = pathname.startsWith("/live/jaz");
  const [navCollapsed, setNavCollapsed] = usePersistedBoolean(NAV_COLLAPSED_KEY, false);
  const [jazNavWidth, setJazNavWidth] = usePersistedNumber(JAZ_NAV_WIDTH_KEY, JAZ_NAV_DEFAULT);
  const jazNavResize = useHorizontalResize((dx) => {
    setJazNavWidth((width) => clamp(width + dx, JAZ_NAV_MIN, JAZ_NAV_MAX));
  });
  const collapsed = jazNavigator ? jazNavWidth < 128 : navCollapsed;

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
      <div
        className={cn("relative hidden shrink-0 md:flex md:flex-col", jazNavigator && "min-h-0 self-stretch")}
        style={jazNavigator ? { width: jazNavWidth } : undefined}
      >
        <aside
          className={cn(
            "hidden shrink-0 border-r border-border bg-card/40 md:flex md:h-full md:w-full md:flex-col",
            jazNavigator ? (collapsed ? "p-2" : "p-4") : "transition-[width] duration-200",
            !jazNavigator && (collapsed ? "w-[3.75rem] p-2" : "w-56 p-4")
          )}
        >
        <div className={cn("mb-4 flex items-center", collapsed ? "justify-center px-0" : "justify-between px-2")}>
          <div className={cn("flex items-center gap-2", collapsed && "justify-center")}>
            <Mic className="h-5 w-5 shrink-0 text-emerald-400" />
            {!collapsed && <span className="font-semibold tracking-tight">Interview Copilot</span>}
          </div>
          {!collapsed && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              title="Collapse navigation"
              onClick={() => (jazNavigator ? setJazNavWidth(JAZ_NAV_MIN) : setNavCollapsed(true))}
            >
              <PanelLeftClose className="h-4 w-4" />
            </Button>
          )}
        </div>
        {collapsed && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="mb-2 h-8 w-full p-0"
            title="Expand navigation"
            onClick={() => (jazNavigator ? setJazNavWidth(JAZ_NAV_DEFAULT) : setNavCollapsed(false))}
          >
            <PanelLeft className="h-4 w-4" />
          </Button>
        )}
        {pocMode && !collapsed && (
          <Badge variant="outline" className="mb-3 ml-2 w-fit text-[10px]">POC — no login</Badge>
        )}
        <nav className="flex flex-1 flex-col gap-1">
          {nav.map((item) => {
            const Icon = item.icon;
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                title={item.label}
                className={cn(
                  "flex items-center rounded-md text-sm transition-colors",
                  collapsed ? "justify-center px-2 py-2.5" : "gap-2 px-3 py-2",
                  active ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted/60",
                  active && collapsed && "ring-1 ring-emerald-500/40"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!collapsed && item.label}
              </Link>
            );
          })}
        </nav>
        {!pocMode && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => void signOut()}
            className={cn(collapsed && "h-9 w-full p-0")}
            title="Sign out"
          >
            {collapsed ? <LogOut className="h-4 w-4" /> : "Sign out"}
          </Button>
        )}
        </aside>
        {jazNavigator && (
          <PanelResizeHandle
            className="absolute top-0 right-0 z-30 hidden h-full w-3 translate-x-1/2 md:flex"
            label="Resize app navigation"
            variant="strong"
            onPointerDown={jazNavResize.onPointerDown}
          />
        )}
      </div>
      <main className="min-h-0 flex-1 overflow-auto">{children}</main>
    </div>
  );
}
