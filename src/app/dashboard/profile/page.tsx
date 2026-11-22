import type { Metadata } from "next";
import { redirect } from "next/navigation";
import ProfileForm from "@/components/profile/ProfileForm";
import { getCurrentUser } from "@/lib/session";

export const metadata: Metadata = { title: "Update Profile" };

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Update Profile</h1>
        <p className="mt-1 text-muted-foreground">Change your name, photo and contact details. Changes show everywhere straight away.</p>
      </div>
      <ProfileForm user={user} />
    </div>
  );
}
