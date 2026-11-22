import type { Metadata } from "next";
import TechnicianOverview from "@/components/dashboard/TechnicianOverview";
import { requireRole } from "@/lib/session";

export const metadata: Metadata = { title: "Technician Dashboard" };

export default async function TechnicianDashboardPage() {
  const user = await requireRole("technician");
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Welcome back, {user.name.split(" ")[0]}</h1>
        <p className="mt-1 text-muted-foreground">Your services, requests and earnings at a glance.</p>
      </div>
      <TechnicianOverview />
    </div>
  );
}
