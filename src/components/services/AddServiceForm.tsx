"use client";

import { useRouter } from "next/navigation";
import ServiceForm from "@/components/services/ServiceForm";

export default function AddServiceForm({ technician }: { technician: { name: string; email: string } }) {
  const router = useRouter();
  return (
    <ServiceForm
      mode="create"
      technician={technician}
      onSuccess={() => router.push("/dashboard/technician/my-services")}
    />
  );
}