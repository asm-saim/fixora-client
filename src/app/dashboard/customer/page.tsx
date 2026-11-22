import type { Metadata } from "next";
import CustomerOverview from "@/components/dashboard/CustomerOverview";
import { requireRole } from "@/lib/session";

export const metadata: Metadata = { title: "Customer Dashboard" };

export default async function CustomerDashboardPage() {
  const user = await requireRole("customer");
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Welcome back, {user.name.split(" ")[0]}</h1>
        <p className="mt-1 text-muted-foreground">Here is what is happening with your repairs.</p>
      </div>
      <CustomerOverview />
    </div>
  );
}
