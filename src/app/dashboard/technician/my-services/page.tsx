import type { Metadata } from "next";
import MyServicesTable from "@/components/services/MyServicesTable";
import { requireRole } from "@/lib/session";

export const metadata: Metadata = { title: "My Services" };

export default async function MyServicesPage() {
  const user = await requireRole("technician");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Services</h1>
        <p className="mt-1 text-muted-foreground">Edit, hide or delete the services you offer.</p>
      </div>
      <MyServicesTable technician={{ name: user.name, email: user.email }} />
    </div>
  );
}