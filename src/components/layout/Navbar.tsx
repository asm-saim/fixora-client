"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LayoutDashboard, LogOut, Menu, UserCog } from "lucide-react";
import { m } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLinkItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import Logo from "@/components/shared/Logo";
import RoleBadge from "@/components/shared/RoleBadge";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useSignOut } from "@/hooks/use-sign-out";
import { dashboardPath } from "@/lib/roles";
import { EASE } from "@/lib/motion";
import { cn, initials } from "@/lib/utils";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { user, isPending } = useCurrentUser();
  const signOut = useSignOut();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <m.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: EASE }}
      className={cn(
        "sticky top-0 z-50 border-b bg-background/85 backdrop-blur transition-shadow duration-300",
        scrolled ? "shadow-md" : "shadow-none"
      )}
    >
      <div className="container-page flex h-16 items-center justify-between">
        <Logo />

        {/* Desktop links */}
        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={isActive(l.href) ? "page" : undefined}
              className={cn(
                "relative rounded-md px-4 py-2 text-sm font-medium transition-colors",
                "after:absolute after:inset-x-4 after:-bottom-0.5 after:h-0.5 after:origin-left after:rounded after:bg-primary after:transition-transform after:duration-300",
                isActive(l.href)
                  ? "text-foreground after:scale-x-100"
                  : "text-muted-foreground after:scale-x-0 hover:text-foreground hover:after:scale-x-100"
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {/* Auth area */}
          {isPending ? (
            <Skeleton className="h-9 w-9 rounded-full" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                className="rounded-full ring-offset-background transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                aria-label="Open user menu"
              >
                <Avatar className="h-9 w-9 border">
                  <AvatarImage src={user.image ?? undefined} alt={user.name} />
                  <AvatarFallback className="bg-secondary text-xs font-semibold text-white">{initials(user.name)}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <div className="space-y-1.5 px-2 py-2.5">
                  <p className="truncate text-sm font-semibold">{user.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                  <RoleBadge role={user.role} />
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuLinkItem closeOnClick render={<Link href={dashboardPath(user.role)} />}>
                  <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                </DropdownMenuLinkItem>
                <DropdownMenuLinkItem closeOnClick render={<Link href="/dashboard/profile" />}>
                  <UserCog className="mr-2 h-4 w-4" /> Update Profile
                </DropdownMenuLinkItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut} className="text-destructive focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" /> Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Link href="/sign-in" className={buttonVariants({ variant: "outline" })}>Sign In</Link>
              <Link href="/sign-up" className={buttonVariants()}>Sign Up</Link>
            </div>
          )}

          {/* Mobile menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              className={buttonVariants({ variant: "ghost", size: "icon", className: "md:hidden" })}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader><SheetTitle><Logo /></SheetTitle></SheetHeader>
              <nav className="mt-6 flex flex-col gap-1 px-4" aria-label="Mobile">
                {LINKS.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "rounded-lg px-4 py-3 text-sm font-medium",
                      isActive(l.href) ? "bg-primary/15 text-foreground" : "text-muted-foreground hover:bg-muted"
                    )}
                  >
                    {l.label}
                  </Link>
                ))}
                {!user && !isPending && (
                  <div className="mt-4 grid gap-2">
                    <Link
                      href="/sign-in"
                      onClick={() => setOpen(false)}
                      className={buttonVariants({ variant: "outline" })}
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/sign-up"
                      onClick={() => setOpen(false)}
                      className={buttonVariants()}
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </m.header>
  );
}