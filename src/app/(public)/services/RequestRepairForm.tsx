"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { AppUser, ServiceDetail } from "@/types";

export type RequestRepairService = Pick<ServiceDetail, "_id" | "title" | "basePrice" | "image" | "category">;

type Props = { service: RequestRepairService; user: AppUser; onDone: () => void };

export default function RequestRepairForm({ user }: Props) {
  // TEMP: replaced in Step 8 with the real form
  return (
    <div className="space-y-4">
      <div className="space-y-2"><Label>Name</Label><Input value={user.name} readOnly disabled /></div>
      <div className="space-y-2"><Label>Email</Label><Input value={user.email} readOnly disabled /></div>
      <p className="rounded-lg bg-muted p-3 text-sm text-muted-foreground">The full request form is added in the next step.</p>
    </div>
  );
}