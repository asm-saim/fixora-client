import type { Metadata } from "next";
import TechnicianRequests from "@/components/bookings/TechnicianRequests";

export const metadata: Metadata = { title: "Manage Requests" };

export default function TechnicianRequestsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Manage Requests</h1>
        <p className="mt-1 text-muted-foreground">Accept new jobs, update their progress, and set the final amount when you finish.</p>
      </div>
      <TechnicianRequests />
    </div>
  );
}
