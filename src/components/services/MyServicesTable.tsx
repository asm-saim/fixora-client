"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { FilePlus2, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import ConfirmModal from "@/components/shared/ConfirmModal";
import EmptyState from "@/components/shared/EmptyState";
import { TableSkeleton } from "@/components/shared/Skeletons";
import { ApprovalBadge } from "@/components/shared/StatusBadge";
import ServiceForm from "@/components/services/ServiceForm";
import { api } from "@/lib/api";
import type { Service } from "@/types";

export default function MyServicesTable({ technician }: { technician: { name: string; email: string } }) {
  const [services, setServices] = useState<Service[] | null>(null);
  const [editing, setEditing] = useState<Service | null>(null);
  const [deleting, setDeleting] = useState<Service | null>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const data = await api<{ services: Service[] }>("/api/services/mine", { auth: true });
      setServices(data.services);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not load your services");
      setServices([]);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function toggle(service: Service, next: boolean) {
    setTogglingId(service._id);
    setServices((list) => list?.map((s) => (s._id === service._id ? { ...s, isAvailable: next } : s)) ?? null); // optimistic
    try {
      await api(`/api/services/${service._id}/availability`, { method: "PATCH", auth: true, body: { isAvailable: next } });
      toast.success(next ? "Service is now available to customers" : "Service hidden from public pages");
    } catch (e) {
      setServices((list) => list?.map((s) => (s._id === service._id ? { ...s, isAvailable: !next } : s)) ?? null); // roll back
      toast.error(e instanceof Error ? e.message : "Could not update availability");
    } finally {
      setTogglingId(null);
    }
  }

  async function confirmDelete() {
    if (!deleting) return;
    setDeleteBusy(true);
    try {
      await api(`/api/services/${deleting._id}`, { method: "DELETE", auth: true });
      setServices((list) => list?.filter((s) => s._id !== deleting._id) ?? null);
      toast.success("Service deleted");
      setDeleting(null);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not delete the service");
    } finally {
      setDeleteBusy(false);
    }
  }

  if (!services) return <TableSkeleton />;

  if (services.length === 0) {
    return (
      <EmptyState
        title="You have no services yet"
        description="Add your first repair service. It goes live after an admin approves it."
        icon={FilePlus2}
        action={{ label: "Add a Service", href: "/dashboard/technician/add-service" }}
      />
    );
  }

  const actions = (s: Service) => (
    <div className="flex items-center gap-2">
      <Button size="sm" variant="outline" onClick={() => setEditing(s)}><Pencil className="mr-1.5 h-3.5 w-3.5" /> Edit</Button>
      <Button size="sm" variant="outline" className="text-destructive hover:text-destructive" onClick={() => setDeleting(s)}>
        <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Delete
      </Button>
    </div>
  );

  return (
    <>
      <div className="flex justify-end">
        <Button render={<Link href="/dashboard/technician/add-service" />} nativeButton={false}><FilePlus2 className="mr-2 h-4 w-4" /> Add Service</Button>
      </div>

      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-2xl border bg-card md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Service</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Approval</TableHead>
              <TableHead>Available</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.map((s) => (
              <TableRow key={s._id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Image src={s.image} alt="" width={56} height={56} className="h-14 w-14 rounded-lg object-cover" />
                    <div className="min-w-0">
                      <p className="line-clamp-1 font-medium">{s.title}</p>
                      {s.approvalStatus === "rejected" && <p className="text-xs text-red-600 dark:text-red-300">Rejected. Edit and resubmit.</p>}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{s.category}</TableCell>
                <TableCell className="font-medium">${s.basePrice}</TableCell>
                <TableCell><ApprovalBadge status={s.approvalStatus} /></TableCell>
                <TableCell>
                  <Switch checked={s.isAvailable} disabled={togglingId === s._id} onCheckedChange={(v) => toggle(s, v)} aria-label="Toggle availability" />
                </TableCell>
                <TableCell className="text-right"><div className="flex justify-end">{actions(s)}</div></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile cards */}
      <div className="grid gap-4 md:hidden">
        {services.map((s) => (
          <div key={s._id} className="space-y-4 rounded-2xl border bg-card p-4">
            <div className="flex gap-3">
              <Image src={s.image} alt="" width={64} height={64} className="h-16 w-16 rounded-lg object-cover" />
              <div className="min-w-0 flex-1">
                <p className="line-clamp-2 font-medium">{s.title}</p>
                <p className="text-sm text-muted-foreground">{s.category} · ${s.basePrice}</p>
                <div className="mt-1.5"><ApprovalBadge status={s.approvalStatus} /></div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm">
                <Switch checked={s.isAvailable} disabled={togglingId === s._id} onCheckedChange={(v) => toggle(s, v)} />
                Available
              </label>
              {actions(s)}
            </div>
          </div>
        ))}
      </div>

      {/* Edit modal */}
      <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit service</DialogTitle>
            <DialogDescription>Saving changes sends the service back to admin approval.</DialogDescription>
          </DialogHeader>
          {editing && (
            <ServiceForm
              mode="edit"
              technician={technician}
              service={editing}
              onCancel={() => setEditing(null)}
              onSuccess={(saved) => {
                setServices((list) => list?.map((s) => (s._id === saved._id ? saved : s)) ?? null);
                setEditing(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      <ConfirmModal
        open={!!deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="Delete this service?"
        description={`"${deleting?.title ?? ""}" will be removed permanently. Existing bookings keep their own copy of the details.`}
        confirmText="Delete"
        loading={deleteBusy}
        onConfirm={confirmDelete}
      />
    </>
  );
}