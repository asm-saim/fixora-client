import { redirect } from "next/navigation";
import DashboardShell from "@/components/layout/DashboardShell";
import { getCurrentUser } from "@/lib/session";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");
  return <DashboardShell user={user}>{children}</DashboardShell>;
}