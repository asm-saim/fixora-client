"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Check, Eye, ShieldCheck, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import ConfirmModal from "@/components/shared/ConfirmModal";
import EmptyState from "@/components/shared/EmptyState";
import ErrorState from "@/components/shared/ErrorState";
import FilterPills from "@/components/shared/FilterPills";
import Pager from "@/components/shared/Pager";
import { TableSkeleton } from "@/components/shared/Skeletons";
import { ApprovalBadge } from "@/components/shared/StatusBadge";
import { useAuthedApi } from "@/hooks/use-api";
import { api } from "@/lib/api";
import { formatDate, formatMoney } from "@/lib/format";
import type { Paged } from "@/lib/stats-types";
import { cn } from "@/lib/utils";
import type { Service } from "@/types";

type Counts = { pending: number; approved: number; rejected: number; all: number };
type Response = Paged & { services: Service[]; counts: Counts };
type Decision = "approved" | "rejected";

const LIMIT = 8;

export default function ServiceApproval() {
  const [status, setStatus] = useState("pending"); // pending services are what the admin needs first
  const [page, setPage] = useState(1);
  const [reviewing, setReviewing] = useState<Service | null>(null);
  const [rejecting, setRejecting] = useState<Service | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const params = new URLSearchParams({ page: String(page), limit: String(LIMIT) });
  if (status !== "all") params.set("status", status);
  const { data, error, loading, reload } = useAuthedApi<Response>(`/api/admin/services?${params}`);

  useEffect(() => {
    if (data && data.page > data.totalPages) setPage(data.totalPages);
  }, [data]);

  async function decide(service: Service, approvalStatus: Decision) {
    setBusyId(service._id);
    try {
      await api(`/api/admin/services/${service._id}/approval`, { method: "PATCH", auth: true, body: { approvalStatus } });
      toast.success(approvalStatus === "approved" ? `"${service.title}" is approved and live` : `"${service.title}" was rejected`);
      setReviewing(null);
      setRejecting(null);
      await reload();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not update the service");
    } finally {
      setBusyId(null);
    }
  }

  const counts = data?.counts;
  const options = [
    { value: "pending", label: "Pending", count: counts?.pending },
    { value: "approved", label: "Approved", count: counts?.approved },
    { value: "rejected", label: "Rejected", count: counts?.rejected },
    { value: "all", label: "All", count: counts?.all },
  ];

  const actions = (s: Service) => {
    const busy = busyId === s._id;
    return (
      <div className="flex flex-wrap justify-end gap-2">
        <Button size="sm" variant="outline" onClick={() => setReviewing(s)}><Eye className="mr-1.5 h-3.5 w-3.5" /> Review</Button>
        <Button size="sm" disabled={busy || s.approvalStatus === "approved"} onClick={() => decide(s, "approved")}>
          <Check className="mr-1.5 h-3.5 w-3.5" /> Approve
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="text-destructive hover:text-destructive"
          disabled={busy || s.approvalStatus === "rejected"}
          onClick={() => setRejecting(s)}
        >
          <X className="mr-1.5 h-3.5 w-3.5" /> Reject
        </Button>
      </div>
    );
  };

  return (
    <div className="space-y-5">
      <FilterPills label="Filter services by approval status" options={options} value={status} onChange={(v) => { setStatus(v); setPage(1); }} />

      {!data ? (
        error ? <ErrorState message={error} onRetry={reload} /> : <TableSkeleton />
      ) : data.services.length === 0 ? (
        <EmptyState
          icon={ShieldCheck}
          title={status === "pending" ? "Nothing is waiting for review" : "No services here"}
          description={status === "pending" ? "New and edited services from technicians appear here for approval." : "Try another filter."}
        />
      ) : (
        <div className={cn("space-y-4 transition-opacity", loading && "opacity-60")}>
          <div className="hidden overflow-x-auto rounded-2xl border bg-card lg:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service</TableHead>
                  <TableHead>Technician</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Added</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.services.map((s) => (
                  <TableRow key={s._id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Image src={s.image} alt="" width={56} height={56} className="h-14 w-14 rounded-lg object-cover" />
                        <div className="min-w-0">
                          <p className="line-clamp-1 font-medium">{s.title}</p>
                          <p className="text-xs text-muted-foreground">{s.category} · {s.serviceMode}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm font-medium">{s.technicianName}</p>
                      <p className="text-xs text-muted-foreground">{s.technicianEmail}</p>
                    </TableCell>
                    <TableCell className="font-medium">{formatMoney(s.basePrice)}</TableCell>
                    <TableCell className="whitespace-nowrap">{formatDate(s.createdAt)}</TableCell>
                    <TableCell>
                      <ApprovalBadge status={s.approvalStatus} />
                      {!s.isAvailable && <p className="mt-1 text-xs text-muted-foreground">Switched off</p>}
                    </TableCell>
                    <TableCell className="text-right">{actions(s)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:hidden">
            {data.services.map((s) => (
              <div key={s._id} className="space-y-4 rounded-2xl border bg-card p-4">
                <div className="flex gap-3">
                  <Image src={s.image} alt="" width={64} height={64} className="h-16 w-16 rounded-lg object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 font-medium">{s.title}</p>
                    <p className="text-sm text-muted-foreground">{s.technicianName} · {formatMoney(s.basePrice)}</p>
                    <div className="mt-1.5"><ApprovalBadge status={s.approvalStatus} /></div>
                  </div>
                </div>
                {actions(s)}
              </div>
            ))}
          </div>

          <Pager page={data.page} totalPages={data.totalPages} total={data.total} limit={data.limit} onPage={setPage} busy={loading} />
        </div>
      )}

      {/* Review dialog: everything the admin needs to decide */}
      <Dialog open={!!reviewing} onOpenChange={(open) => !open && setReviewing(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          {reviewing && (
            <>
              <DialogHeader>
                <DialogTitle>{reviewing.title}</DialogTitle>
                <DialogDescription>{reviewing.category} · added {formatDate(reviewing.createdAt)}</DialogDescription>
              </DialogHeader>
              <div className="relative aspect-[16/9] overflow-hidden rounded-xl border bg-muted">
                <Image src={reviewing.image} alt={reviewing.title} fill sizes="(min-width: 640px) 640px, 100vw" className="object-cover" />
              </div>
              <dl className="grid grid-cols-2 gap-4 text-sm">
                <div><dt className="text-xs text-muted-foreground">Starting price</dt><dd className="font-semibold">{formatMoney(reviewing.basePrice)}</dd></div>
                <div><dt className="text-xs text-muted-foreground">Duration</dt><dd className="font-semibold">{reviewing.estimatedDuration}</dd></div>
                <div><dt className="text-xs text-muted-foreground">Mode</dt><dd className="font-semibold">{reviewing.serviceMode}</dd></div>
                <div><dt className="text-xs text-muted-foreground">Area</dt><dd className="font-semibold">{reviewing.serviceArea}</dd></div>
                <div className="col-span-2"><dt className="text-xs text-muted-foreground">Technician</dt><dd className="font-semibold">{reviewing.technicianName} ({reviewing.technicianEmail})</dd></div>
              </dl>
              <p className="whitespace-pre-line text-sm leading-6 text-muted-foreground">{reviewing.description}</p>
              <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-4">
                <ApprovalBadge status={reviewing.approvalStatus} />
                <div className="flex gap-2">
                  <Button variant="outline" className="text-destructive hover:text-destructive" disabled={!!busyId || reviewing.approvalStatus === "rejected"} onClick={() => setRejecting(reviewing)}>
                    Reject
                  </Button>
                  <Button disabled={!!busyId || reviewing.approvalStatus === "approved"} onClick={() => decide(reviewing, "approved")}>
                    Approve
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <ConfirmModal
        open={!!rejecting}
        onOpenChange={(open) => !open && !busyId && setRejecting(null)}
        title="Reject this service?"
        description={`"${rejecting?.title ?? ""}" will be hidden from customers. The technician can edit it and submit it again.`}
        confirmText="Reject service"
        loading={!!rejecting && busyId === rejecting._id}
        onConfirm={() => rejecting ? decide(rejecting, "rejected") : undefined}
      />
    </div>
  );
}
