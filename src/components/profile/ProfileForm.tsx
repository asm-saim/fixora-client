"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Lock } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import AvatarUpload from "@/components/profile/AvatarUpload";
import RoleBadge from "@/components/shared/RoleBadge";
import { useCurrentUser } from "@/hooks/use-current-user";
import { api } from "@/lib/api";
import { uploadImage } from "@/lib/upload";
import { profileSchema, type ProfileValues } from "@/lib/validations";
import type { AppUser } from "@/types";

const BIO_MAX = 300;

function FieldError({ message }: { message?: string }) {
  return message ? <p className="text-sm text-destructive">{message}</p> : null;
}

const valuesOf = (u: AppUser): ProfileValues => ({
  name: u.name ?? "",
  phone: u.phone ?? "",
  area: u.area ?? "",
  bio: u.bio ?? "",
});

export default function ProfileForm({ user }: { user: AppUser }) {
  const router = useRouter();
  const { refetch } = useCurrentUser();

  const [savedImage, setSavedImage] = useState<string | null>(user.image ?? null);
  const [file, setFile] = useState<File | null>(null);
  const [removed, setRemoved] = useState(false);

  const {
    register, handleSubmit, reset, control, formState: { errors, isSubmitting, isDirty },
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: valuesOf(user),
  });

  const name = useWatch({ control, name: "name" });
  const bioLength = (useWatch({ control, name: "bio" }) ?? "").length;
  const photoChanged = !!file || removed;

  async function onSubmit(values: ProfileValues) {
    try {
      // A new photo goes to ImgBB first, then its URL is saved on the profile
      let image: string | null | undefined;
      if (file) image = await uploadImage(file);
      else if (removed) image = null;

      const { user: saved } = await api<{ user: AppUser }>("/api/users/profile", {
        method: "PATCH",
        auth: true,
        body: { ...values, ...(image !== undefined ? { image } : {}) },
      });

      // Show the change everywhere without a sign-out: the navbar reads the client session,
      // the dashboard top bar is rendered by the server layout.
      await refetch();
      router.refresh();

      reset(valuesOf(saved));
      setSavedImage(saved.image ?? null);
      setFile(null);
      setRemoved(false);
      toast.success("Profile updated");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not update your profile");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-8 rounded-2xl border bg-card p-5 shadow-sm sm:p-8">
      <AvatarUpload
        name={name || user.name}
        currentUrl={savedImage}
        file={file}
        removed={removed}
        onPick={(f) => { setFile(f); setRemoved(false); }}
        onRemove={() => { setFile(null); setRemoved(true); }}
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Full name</Label>
          <Input id="name" autoComplete="name" className="h-11" aria-invalid={!!errors.name} {...register("name")} />
          <FieldError message={errors.name?.message} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" type="tel" autoComplete="tel" placeholder="+880 1XXX-XXXXXX" className="h-11" aria-invalid={!!errors.phone} {...register("phone")} />
          <FieldError message={errors.phone?.message} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="flex items-center gap-1.5">Email <Lock className="h-3 w-3 text-muted-foreground" /></Label>
          <Input id="email" value={user.email} readOnly disabled className="h-11" />
          <p className="text-xs text-muted-foreground">Your email is your sign-in and cannot be changed.</p>
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-1.5">Role <Lock className="h-3 w-3 text-muted-foreground" /></Label>
          <div className="flex h-11 items-center"><RoleBadge role={user.role} /></div>
          <p className="text-xs text-muted-foreground">Only an admin can change a role.</p>
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="area">{user.role === "technician" ? "Area you work in" : "Your area"}</Label>
          <Input id="area" placeholder="e.g. Dhanmondi, Dhaka" className="h-11" aria-invalid={!!errors.area} {...register("area")} />
          <FieldError message={errors.area?.message} />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="bio">Bio</Label>
            <span className={`text-xs ${bioLength > BIO_MAX ? "text-destructive" : "text-muted-foreground"}`}>{bioLength}/{BIO_MAX}</span>
          </div>
          <Textarea
            id="bio"
            rows={4}
            placeholder={user.role === "technician" ? "Tell customers about your experience and the repairs you specialise in." : "A short note about yourself (optional)."}
            aria-invalid={!!errors.bio}
            {...register("bio")}
          />
          {user.role === "technician" && <p className="text-xs text-muted-foreground">Customers see your photo, area and bio on your service pages.</p>}
          <FieldError message={errors.bio?.message} />
        </div>
      </div>

      <div className="flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          disabled={isSubmitting || (!isDirty && !photoChanged)}
          onClick={() => { reset(valuesOf(user)); setFile(null); setRemoved(false); }}
        >
          Discard changes
        </Button>
        <Button type="submit" className="h-9 px-6" disabled={isSubmitting || (!isDirty && !photoChanged)}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isSubmitting ? "Saving..." : "Save changes"}
        </Button>
      </div>
    </form>
  );
}
