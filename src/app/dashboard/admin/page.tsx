import type { Metadata } from "next";
import AdminOverview from "@/components/dashboard/AdminOverview";
import { requireRole } from "@/lib/session";

export const metadata: Metadata = { title: "Admin Dashboard" };

export default async function AdminDashboardPage() {
  const user = await requireRole("admin");
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Welcome back, {user.name.split(" ")[0]}</h1>
        <p className="mt-1 text-muted-foreground">Platform activity, users and revenue.</p>
      </div>
      <AdminOverview />
    </div>
  );
}
