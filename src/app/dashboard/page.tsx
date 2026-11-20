import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { dashboardPath } from "@/lib/roles";

export default async function DashboardIndex() {
  const user = await getCurrentUser();
  redirect(user ? dashboardPath(user.role) : "/sign-in");
}