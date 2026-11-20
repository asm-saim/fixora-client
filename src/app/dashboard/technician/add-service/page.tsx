import type { Metadata } from "next";
import AddServiceForm from "@/components/services/AddServiceForm";
import { requireRole } from "@/lib/session";

export const metadata: Metadata = { title: "Add Service" };

export default async function AddServicePage() {
  const user = await requireRole("technician");

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Add a Service</h1>
        <p className="mt-1 text-muted-foreground">New services are reviewed by an admin before customers can see them.</p>
      </div>
      <div className="rounded-2xl border bg-card p-5 shadow-sm sm:p-8">
        <AddServiceForm technician={{ name: user.name, email: user.email }} />
      </div>
    </div>
  );
}