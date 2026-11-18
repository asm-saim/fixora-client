import {
  ClipboardList, CreditCard, FilePlus2, Inbox, LayoutDashboard, Receipt,
  ShieldCheck, UserCog, Users, Wrench, CalendarCheck, type LucideIcon,
} from "lucide-react";
import type { Role } from "./constants";

export type NavItem = { href: string; label: string; icon: LucideIcon; exact?: boolean };

export const DASHBOARD_NAV: Record<Role, NavItem[]> = {
  customer: [
    { href: "/dashboard/customer", label: "Overview", icon: LayoutDashboard, exact: true },
    { href: "/dashboard/customer/bookings", label: "My Bookings", icon: ClipboardList },
    { href: "/dashboard/customer/payments", label: "Payment History", icon: CreditCard },
  ],
  technician: [
    { href: "/dashboard/technician", label: "Overview", icon: LayoutDashboard, exact: true },
    { href: "/dashboard/technician/add-service", label: "Add Service", icon: FilePlus2 },
    { href: "/dashboard/technician/my-services", label: "My Services", icon: Wrench },
    { href: "/dashboard/technician/requests", label: "Manage Requests", icon: Inbox },
  ],
  admin: [
    { href: "/dashboard/admin", label: "Overview", icon: LayoutDashboard, exact: true },
    { href: "/dashboard/admin/users", label: "Manage Users", icon: Users },
    { href: "/dashboard/admin/services", label: "Service Approval", icon: ShieldCheck },
    { href: "/dashboard/admin/bookings", label: "All Bookings", icon: CalendarCheck },
    { href: "/dashboard/admin/transactions", label: "Transactions", icon: Receipt },
  ],
};

export const PROFILE_NAV: NavItem = { href: "/dashboard/profile", label: "Update Profile", icon: UserCog };