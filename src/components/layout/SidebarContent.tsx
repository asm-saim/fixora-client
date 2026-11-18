"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import Logo from "@/components/shared/Logo";
import { useSignOut } from "@/hooks/use-sign-out";
import type { Role } from "@/lib/constants";
import { DASHBOARD_NAV, PROFILE_NAV, type NavItem } from "@/lib/dashboard-nav";
import { cn } from "@/lib/utils";

type Props = { role: Role; collapsed?: boolean; onNavigate?: () => void };

export default function SidebarContent({ role, collapsed = false, onNavigate }: Props) {
  const pathname = usePathname();
  const signOut = useSignOut();
  const items = [...DASHBOARD_NAV[role], PROFILE_NAV];

  const active = (item: NavItem) =>
    item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`);

  return (
    <div className="flex h-full flex-col">
      <div className={cn("flex h-16 items-center border-b border-sidebar-border", collapsed ? "justify-center" : "px-5")}>
        <Logo light compact={collapsed} />
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3" aria-label="Dashboard">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              title={collapsed ? item.label : undefined}
              aria-current={active(item) ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                collapsed && "justify-center px-0",
                active(item)
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-white"
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <button
          onClick={signOut}
          title={collapsed ? "Sign Out" : undefined}
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground transition-colors hover:bg-red-500/15 hover:text-red-300",
            collapsed && "justify-center px-0"
          )}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!collapsed && "Sign Out"}
        </button>
      </div>
    </div>
  );
}