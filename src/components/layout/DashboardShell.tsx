"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import SidebarContent from "@/components/layout/SidebarContent";
import Topbar from "@/components/layout/Topbar";
import type { AppUser } from "@/types";
import { cn } from "@/lib/utils";

export default function DashboardShell({ user, children }: { user: AppUser; children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-muted/40">
      <aside
        className={cn(
          "sticky top-0 hidden h-screen shrink-0 bg-sidebar text-sidebar-foreground transition-[width] duration-300 lg:block",
          collapsed ? "w-[76px]" : "w-64"
        )}
      >
        <SidebarContent role={user.role} collapsed={collapsed} />
      </aside>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-64 border-sidebar-border bg-sidebar p-0 text-sidebar-foreground [&>button]:text-white">
          <SheetTitle className="sr-only">Dashboard menu</SheetTitle>
          <SidebarContent role={user.role} onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar user={user} onOpenMobile={() => setMobileOpen(true)} onToggleCollapse={() => setCollapsed((c) => !c)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}