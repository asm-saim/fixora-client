"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ImageUpload from "@/components/services/ImageUpload";
import { api } from "@/lib/api";
import { CATEGORIES, SERVICE_MODES } from "@/lib/constants";
import { uploadImage } from "@/lib/upload";
import { serviceSchema, type ServiceValues } from "@/lib/validations";
import type { Service } from "@/types";

type Props = {
  mode: "create" | "edit";
  technician: { name: string; email: string };
  service?: Service;
  onSuccess: (service: Service) => void;
  onCancel?: () => void;
};

function FieldError({ message }: { message?: string }) {
  return message ? <p className="text-sm text-destructive">{message}</p> : null;
}

export default function ServiceForm({ mode, technician, service, onSuccess, onCancel }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [imageError, setImageError] = useState("");

  const {
    register, control, handleSubmit, formState: { errors, isSubmitting },
  } = useForm<ServiceValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      title: service?.title ?? "",
      category: service?.category ?? "",
      description: service?.description ?? "",
      basePrice: service ? String(service.basePrice) : "",
      estimatedDuration: service?.estimatedDuration ?? "",
      serviceMode: service?.serviceMode ?? "",
      serviceArea: service?.serviceArea ?? "",
    },
  });

  async function onSubmit(values: ServiceValues) {
    if (!file && !service?.image) {
      setImageError("Please upload a service image");
      return;
    }
    setImageError("");

    try {
      const image = file ? await uploadImage(file) : service!.image;
      const body = { ...values, basePrice: Number(values.basePrice), image };

      const saved =
        mode === "create"
          ? await api<Service>("/api/services", { method: "POST", auth: true, body })
          : await api<Service>(`/api/services/${service!._id}`, { method: "PATCH", auth: true, body });

      toast.success(
        mode === "create"
          ? "Service submitted! It is waiting for admin approval."
          : "Changes saved. The service is pending admin approval again."
      );
      onSuccess(saved);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="title">Service title</Label>
          <Input id="title" className="h-11" placeholder="e.g. iPhone Screen Replacement" {...register("title")} />
          <FieldError message={errors.title?.message} />
        </div>

        <div className="space-y-2">
          <Label>Category</Label>
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="h-11 w-full"><SelectValue placeholder="Select a category" /></SelectTrigger>
                <SelectContent>{CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            )}
          />
          <FieldError message={errors.category?.message} />
        </div>

        <div className="space-y-2">
          <Label>Service mode</Label>
          <Controller
            name="serviceMode"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="h-11 w-full"><SelectValue placeholder="Select a mode" /></SelectTrigger>
                <SelectContent>{SERVICE_MODES.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
              </Select>
            )}
          />
          <FieldError message={errors.serviceMode?.message} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="basePrice">Base price (USD)</Label>
          <Input id="basePrice" type="number" inputMode="decimal" min="0" step="0.01" className="h-11" placeholder="49" {...register("basePrice")} />
          <FieldError message={errors.basePrice?.message} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="estimatedDuration">Estimated duration</Label>
          <Input id="estimatedDuration" className="h-11" placeholder="e.g. 2-3 hours" {...register("estimatedDuration")} />
          <FieldError message={errors.estimatedDuration?.message} />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="serviceArea">Service area</Label>
          <Input id="serviceArea" className="h-11" placeholder="e.g. Dhanmondi, Dhaka" {...register("serviceArea")} />
          <FieldError message={errors.serviceArea?.message} />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" rows={5} placeholder="What is included, parts used, warranty..." {...register("description")} />
          <FieldError message={errors.description?.message} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="techName">Technician name</Label>
          <Input id="techName" value={technician.name} readOnly disabled className="h-11" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="techEmail">Technician email</Label>
          <Input id="techEmail" value={technician.email} readOnly disabled className="h-11" />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label>Service image</Label>
          <ImageUpload
            existingUrl={service?.image}
            file={file}
            onFileChange={(f) => { setFile(f); setImageError(""); }}
            error={imageError}
          />
        </div>
      </div>

      <div className="flex justify-end gap-3">
        {onCancel && <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>Cancel</Button>}
        <Button type="submit" className="h-11 px-6" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {mode === "create" ? "Submit for Approval" : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}