import type { Metadata } from "next";
import UsersTable from "@/components/admin/UsersTable";
import { requireRole } from "@/lib/session";

export const metadata: Metadata = { title: "Manage Users" };

export default async function AdminUsersPage() {
  const user = await requireRole("admin");
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Manage Users</h1>
        <p className="mt-1 text-muted-foreground">Search every account and change roles. You cannot change your own role.</p>
      </div>
      <UsersTable currentUserId={user.id} />
    </div>
  );
}
