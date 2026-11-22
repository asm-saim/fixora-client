import type { Metadata } from "next";
import ServiceApproval from "@/components/admin/ServiceApproval";

export const metadata: Metadata = { title: "Service Approval" };

export default function AdminServicesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Service Approval</h1>
        <p className="mt-1 text-muted-foreground">Review what technicians submit. Only approved services appear to customers.</p>
      </div>
      <ServiceApproval />
    </div>
  );
}
