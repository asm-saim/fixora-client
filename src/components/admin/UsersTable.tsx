"use client";

import { useEffect, useState } from "react";
import { Search, Users } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import ConfirmModal from "@/components/shared/ConfirmModal";
import EmptyState from "@/components/shared/EmptyState";
import ErrorState from "@/components/shared/ErrorState";
import Pager from "@/components/shared/Pager";
import RoleBadge from "@/components/shared/RoleBadge";
import { TableSkeleton } from "@/components/shared/Skeletons";
import { useAuthedApi } from "@/hooks/use-api";
import { api } from "@/lib/api";
import type { Role } from "@/lib/constants";
import { formatDate } from "@/lib/format";
import { ROLE_LABEL } from "@/lib/roles";
import type { Paged } from "@/lib/stats-types";
import { cn, initials } from "@/lib/utils";

type AdminUser = { _id: string; name: string; email: string; image?: string | null; role: Role; createdAt: string; area?: string };
type UsersResponse = Paged & { users: AdminUser[] };

const ROLES: Role[] = ["customer", "technician", "admin"];
const LIMIT = 10;

export default function UsersTable({ currentUserId }: { currentUserId: string }) {
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("all");
  const [page, setPage] = useState(1);
  const [pending, setPending] = useState<{ user: AdminUser; role: Role } | null>(null);
  const [saving, setSaving] = useState(false);

  // wait 400ms after the last keystroke before searching
  useEffect(() => {
    const timer = setTimeout(() => {
      setQuery(search.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const params = new URLSearchParams({ page: String(page), limit: String(LIMIT) });
  if (query) params.set("search", query);
  if (role !== "all") params.set("role", role);
  const { data, error, loading, reload } = useAuthedApi<UsersResponse>(`/api/admin/users?${params}`);

  // the last user on the last page was removed by a filter: go back to a page that exists
  useEffect(() => {
    if (data && data.page > data.totalPages) setPage(data.totalPages);
  }, [data]);

  async function confirmChange() {
    if (!pending) return;
    setSaving(true);
    try {
      const result = await api<{ user: AdminUser; servicesHidden: number }>(`/api/admin/users/${pending.user._id}/role`, {
        method: "PATCH",
        auth: true,
        body: { role: pending.role },
      });
      toast.success(`${pending.user.name} is now a ${ROLE_LABEL[result.user.role].toLowerCase()}`, {
        description: result.servicesHidden > 0 ? `${result.servicesHidden} of their services were hidden from customers.` : undefined,
      });
      await reload();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not change the role");
    } finally {
      setSaving(false);
      setPending(null);
    }
  }

  const warning = pending
    ? [
        pending.role === "admin" ? "Admins can manage every user, service, booking and payment." : "",
        pending.user.role === "technician" ? "Their services will be hidden from customers, and they can no longer manage requests." : "",
        "They may need to sign in again to see the change.",
      ].filter(Boolean).join(" ")
    : "";

  // An admin cannot change their own role. Everyone else gets a role picker.
  const roleCell = (u: AdminUser) =>
    u._id === currentUserId ? (
      <div className="flex items-center gap-2">
        <RoleBadge role={u.role} />
        <span className="text-xs text-muted-foreground">You</span>
      </div>
    ) : (
      <Select value={u.role} onValueChange={(value) => setPending({ user: u, role: value as Role })}>
        <SelectTrigger className="h-9 w-[150px]" aria-label={`Change role for ${u.name}`}><SelectValue /></SelectTrigger>
        <SelectContent>{ROLES.map((r) => <SelectItem key={r} value={r}>{ROLE_LABEL[r]}</SelectItem>)}</SelectContent>
      </Select>
    );

  const avatar = (u: AdminUser) => (
    <Avatar className="h-10 w-10 border">
      <AvatarImage src={u.image ?? undefined} alt={u.name} />
      <AvatarFallback className="bg-secondary text-xs font-semibold text-white">{initials(u.name)}</AvatarFallback>
    </Avatar>
  );

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-[1fr_200px]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or email" className="h-11 pl-9" aria-label="Search users" />
        </div>
        <Select value={role} onValueChange={(value) => { setRole(value ?? "all"); setPage(1); }}>
          <SelectTrigger className="h-11 w-full" aria-label="Filter by role"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All roles</SelectItem>
            {ROLES.map((r) => <SelectItem key={r} value={r}>{ROLE_LABEL[r]}s</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {!data ? (
        error ? <ErrorState message={error} onRetry={reload} /> : <TableSkeleton />
      ) : data.users.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No users found"
          description={query || role !== "all" ? "Try a different search or clear the role filter." : "Users appear here after they sign up."}
        />
      ) : (
        <div className={cn("space-y-4 transition-opacity", loading && "opacity-60")}>
          <div className="hidden overflow-x-auto rounded-2xl border bg-card md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.users.map((u) => (
                  <TableRow key={u._id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {avatar(u)}
                        <div className="min-w-0">
                          <p className="font-medium">{u.name}</p>
                          {u.area && <p className="text-xs text-muted-foreground">{u.area}</p>}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{u.email}</TableCell>
                    <TableCell>{roleCell(u)}</TableCell>
                    <TableCell className="whitespace-nowrap">{formatDate(u.createdAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="grid gap-4 md:hidden">
            {data.users.map((u) => (
              <div key={u._id} className="space-y-4 rounded-2xl border bg-card p-4">
                <div className="flex items-center gap-3">
                  {avatar(u)}
                  <div className="min-w-0">
                    <p className="font-medium">{u.name}</p>
                    <p className="truncate text-sm text-muted-foreground">{u.email}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs text-muted-foreground">Joined {formatDate(u.createdAt)}</span>
                  {roleCell(u)}
                </div>
              </div>
            ))}
          </div>

          <Pager page={data.page} totalPages={data.totalPages} total={data.total} limit={data.limit} onPage={setPage} busy={loading} />
        </div>
      )}

      <ConfirmModal
        open={!!pending}
        onOpenChange={(open) => !open && !saving && setPending(null)}
        title="Change this user's role?"
        description={pending ? `${pending.user.name} will change from ${ROLE_LABEL[pending.user.role]} to ${ROLE_LABEL[pending.role]}. ${warning}` : ""}
        confirmText="Change role"
        destructive={!!pending && (pending.role === "admin" || pending.user.role === "technician")}
        loading={saving}
        onConfirm={confirmChange}
      />
    </div>
  );
}
