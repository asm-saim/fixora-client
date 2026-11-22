"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api";
import { requestSchema, type RequestValues } from "@/lib/booking-validations";
import { formatMoney, todayLocalISO } from "@/lib/format";
import type { AppUser, ServiceDetail } from "@/types";

export type RequestRepairService = Pick<ServiceDetail, "_id" | "title" | "basePrice" | "image" | "category">;

type Props = { service: RequestRepairService; user: AppUser; onDone: () => void };

function FieldError({ message }: { message?: string }) {
  return message ? <p className="text-sm text-destructive">{message}</p> : null;
}

export default function RequestRepairForm({ service, user, onDone }: Props) {
  const router = useRouter();

  const {
    register, handleSubmit, control, formState: { errors, isSubmitting },
  } = useForm<RequestValues>({
    resolver: zodResolver(requestSchema),
    defaultValues: { customerPhone: user.phone ?? "", address: "", preferredDate: "", problemDescription: "" },
  });

  const description = useWatch({ control, name: "problemDescription" });
  const descriptionLength = (description ?? "").length;

  async function onSubmit(values: RequestValues) {
    try {
      await api("/api/bookings", {
        method: "POST",
        auth: true,
        body: { serviceId: service._id, ...values },
      });

      toast.success("Repair request sent", {
        description: "The technician will review it shortly.",
        duration: 8000,
        action: { label: "My Bookings", onClick: () => router.push("/dashboard/customer/bookings") },
      });
      onDone();
    } catch (e) {
      // A duplicate returns: "You already have an active request for this service"
      toast.error(e instanceof Error ? e.message : "Could not send your request. Please try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div className="flex items-center gap-3 rounded-xl border bg-muted/50 p-3">
        <Image src={service.image} alt="" width={56} height={56} className="h-14 w-14 rounded-lg object-cover" />
        <div className="min-w-0">
          <p className="line-clamp-1 text-sm font-semibold">{service.title}</p>
          <p className="text-xs text-muted-foreground">
            Starting from {formatMoney(service.basePrice)}. You pay only after the job is completed.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="req-name">Name</Label>
          <Input id="req-name" value={user.name} readOnly disabled className="h-11" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="req-email">Email</Label>
          <Input id="req-email" value={user.email} readOnly disabled className="h-11" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="customerPhone">Phone</Label>
          <Input
            id="customerPhone"
            type="tel"
            autoComplete="tel"
            placeholder="01XXXXXXXXX"
            className="h-11"
            aria-invalid={!!errors.customerPhone}
            {...register("customerPhone")}
          />
          <FieldError message={errors.customerPhone?.message} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="preferredDate">Preferred date</Label>
          <Input
            id="preferredDate"
            type="date"
            min={todayLocalISO()}
            className="h-11"
            aria-invalid={!!errors.preferredDate}
            {...register("preferredDate")}
          />
          <FieldError message={errors.preferredDate?.message} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          autoComplete="street-address"
          placeholder="House, road, area, city"
          className="h-11"
          aria-invalid={!!errors.address}
          {...register("address")}
        />
        <FieldError message={errors.address?.message} />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="problemDescription">What is wrong with the device?</Label>
          <span className="text-xs text-muted-foreground">{descriptionLength}/1000 (min 20)</span>
        </div>
        <Textarea
          id="problemDescription"
          rows={4}
          placeholder="e.g. The screen cracked after a fall and the touch is not responding in the bottom corner."
          aria-invalid={!!errors.problemDescription}
          {...register("problemDescription")}
        />
        <FieldError message={errors.problemDescription?.message} />
      </div>

      <Button type="submit" className="h-11 w-full" disabled={isSubmitting}>
        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Send repair request
      </Button>
    </form>
  );
}
