"use client";

import Link from "next/link";
import { Home, Menu, PanelLeft } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import RoleBadge from "@/components/shared/RoleBadge";
import type { AppUser } from "@/types";
import { initials } from "@/lib/utils";

type Props = { user: AppUser | null; onOpenMobile: () => void; onToggleCollapse: () => void };

export default function Topbar({ user, onOpenMobile, onToggleCollapse }: Props) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/90 px-4 backdrop-blur sm:px-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={onOpenMobile} aria-label="Open sidebar">
          <Menu className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="hidden lg:inline-flex" onClick={onToggleCollapse} aria-label="Collapse sidebar">
          <PanelLeft className="h-5 w-5" />
        </Button>
        <Link href="/" className={buttonVariants({ variant: "ghost", className: "gap-2" })}>
          <Home className="h-4 w-4" /><span className="hidden sm:inline">Back to Home</span>
        </Link>
      </div>

      {user && (
        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold leading-tight">{user.name}</p>
            <RoleBadge role={user.role} className="mt-0.5 h-5 px-2 text-[11px]" />
          </div>
          <Avatar className="h-9 w-9 border">
            <AvatarImage src={user.image ?? undefined} alt={user.name} />
            <AvatarFallback className="bg-secondary text-xs font-semibold text-white">{initials(user.name)}</AvatarFallback>
          </Avatar>
        </div>
      )}
    </header>
  );
}