"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useState } from "react";
import { LayoutDashboard, LogOut, Menu, UserCog } from "lucide-react";
import { m } from "framer-motion";
import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLinkItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import Logo from "@/components/shared/Logo";
import RoleBadge from "@/components/shared/RoleBadge";
import UserAvatar from "@/components/shared/UserAvatar";
import ThemeToggle from "@/components/theme/ThemeToggle";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useSignOut } from "@/hooks/use-sign-out";
import { dashboardPath } from "@/lib/roles";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
];

/** A small browser-restored offset should still count as "at the top". */
const SCROLL_THRESHOLD = 64;

export default function Navbar() {
  const pathname = usePathname();
  const { user, isPending } = useCurrentUser();
  const signOut = useSignOut();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isHome = pathname === "/";

  // Home only: stop the browser restoring an old scroll offset on reload, so the
  // page always opens at the top with a transparent navbar.
  useLayoutEffect(() => {
    if (!isHome) return;
    const previous = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    return () => {
      window.history.scrollRestoration = previous;
    };
  }, [isHome]);

  useEffect(() => {
    let frame = 0;
    const update = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);

    // Coalesce rapid scroll events into one state update per frame.
    const scheduleUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        update();
      });
    };

    // bfcache restores happen after hydration, so re-apply the reset.
    const onPageShow = () => {
      if (isHome) window.scrollTo(0, 0);
      update();
    };

    // Read the initial position on the next frame instead of during the effect body.
    scheduleUpdate();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate, { passive: true });
    window.addEventListener("pageshow", onPageShow);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      window.removeEventListener("pageshow", onPageShow);
    };
  }, [isHome]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <m.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: EASE }}
      className={cn(
        "top-0 z-50 border-b transition-all duration-300",
        isHome ? "fixed inset-x-0" : "sticky",
        isHome && !scrolled
          ? "border-transparent bg-transparent text-white shadow-none"
          : "border-white/10 bg-[#0B1F3A]/80 text-white shadow-lg backdrop-blur-xl",
      )}
    >
      <div className="container-page flex h-16 items-center justify-between">
        <Logo light />

        {/* Desktop links */}
        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={isActive(l.href) ? "page" : undefined}
              className={cn(
                "rounded-md px-4 py-2 text-sm font-medium transition-colors",
                isActive(l.href)
                  ? "font-semibold text-primary"
                  : "text-white/75 hover:text-primary/80",
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle className="text-inherit hover:bg-white/10 hover:text-primary" />

          {/* Auth area */}
          {isPending ? (
            <Skeleton className="h-9 w-9 rounded-full" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                className="rounded-full ring-offset-background transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                aria-label="Open user menu"
              >
                <UserAvatar
                  src={user.image}
                  name={user.name}
                  className="h-9 w-9 border"
                  fallbackClassName="bg-secondary text-xs font-semibold text-white"
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <div className="space-y-1.5 px-2 py-2.5">
                  <p className="truncate text-sm font-semibold">{user.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {user.email}
                  </p>
                  <RoleBadge role={user.role} />
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuLinkItem
                  closeOnClick
                  render={<Link href={dashboardPath(user.role)} />}
                >
                  <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                </DropdownMenuLinkItem>
                <DropdownMenuLinkItem
                  closeOnClick
                  render={<Link href="/dashboard/profile" />}
                >
                  <UserCog className="mr-2 h-4 w-4" /> Update Profile
                </DropdownMenuLinkItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={signOut}
                  className="text-destructive focus:text-destructive"
                >
                  <LogOut className="mr-2 h-4 w-4" /> Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Link
                href="/sign-in"
                className={buttonVariants({
                  variant: "outline",
                  className:
                    "bg-transparent text-white hover:border-primary hover:bg-transparent hover:text-primary",
                })}
              >
                Sign In
              </Link>
              <Link href="/sign-up" className={buttonVariants()}>
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              className={buttonVariants({
                variant: "ghost",
                size: "icon",
                className:
                  "md:hidden text-inherit hover:bg-white/10 hover:text-primary",
              })}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle>
                  <Logo />
                </SheetTitle>
              </SheetHeader>
              <nav
                className="mt-6 flex flex-col gap-1 px-4"
                aria-label="Mobile"
              >
                {LINKS.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "rounded-lg px-4 py-3 text-sm font-medium",
                      isActive(l.href)
                        ? "bg-primary/15 text-primary"
                        : "text-muted-foreground hover:bg-muted",
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
                      className={buttonVariants({
                        variant: "outline",
                        className:
                          "bg-transparent hover:border-primary hover:bg-transparent hover:text-primary",
                      })}
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
