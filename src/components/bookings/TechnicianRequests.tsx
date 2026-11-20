"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Inbox, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import ConfirmModal from "@/components/shared/ConfirmModal";
import EmptyState from "@/components/shared/EmptyState";
import { TableSkeleton } from "@/components/shared/Skeletons";
import { PaymentBadge, StatusBadge } from "@/components/shared/StatusBadge";
import { ApiError, api } from "@/lib/api";
import { formatDate, formatMoney } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Booking, BookingStatus } from "@/types";

const FILTERS = [
  { value: "all", label: "All" },
  { value: "requested", label: "Requested" },
  { value: "accepted", label: "Accepted" },
  { value: "in-progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
] as const;
type Filter = (typeof FILTERS)[number]["value"];

const SUCCESS_MESSAGE: Record<BookingStatus, string> = {
  requested: "Status updated",
  accepted: "Request accepted",
  rejected: "Request rejected",
  "in-progress": "Work started",
  completed: "Job completed. The customer can now pay.",
  cancelled: "Status updated",
};

export default function TechnicianRequests() {
  const [bookings, setBookings] = useState<Booking[] | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [rejecting, setRejecting] = useState<Booking | null>(null);
  const [completing, setCompleting] = useState<Booking | null>(null);
  const [amount, setAmount] = useState("");

  const load = useCallback(async () => {
    try {
      const data = await api<{ bookings: Booking[] }>("/api/bookings/technician", { auth: true });
      setBookings(data.bookings);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not load your requests");
      setBookings([]);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const counts = useMemo(() => {
    const result: Record<string, number> = { all: bookings?.length ?? 0 };
    for (const b of bookings ?? []) result[b.status] = (result[b.status] ?? 0) + 1;
    return result;
  }, [bookings]);

  const visible = useMemo(
    () => (bookings ?? []).filter((b) => filter === "all" || b.status === filter),
    [bookings, filter]
  );

  /** Returns true when the server accepted the change. */
  async function changeStatus(booking: Booking, status: BookingStatus, extra?: { finalAmount: number }) {
    setBusyId(booking._id);
    try {
      const updated = await api<Booking>(`/api/bookings/${booking._id}/status`, {
        method: "PATCH",
        auth: true,
        body: { status, ...extra },
      });
      setBookings((list) => list?.map((b) => (b._id === updated._id ? updated : b)) ?? null);
      toast.success(SUCCESS_MESSAGE[status]);
      return true;
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not update the job");
      if (e instanceof ApiError && e.status === 409) load(); // someone changed it first, so refresh
      return false;
    } finally {
      setBusyId(null);
    }
  }

  function openComplete(booking: Booking) {
    setCompleting(booking);
    setAmount(String(booking.basePrice)); // pre-filled with the base price
  }

  const amountValue = Number(amount);
  const amountValid = amount.trim() !== "" && Number.isFinite(amountValue) && amountValue > 0;

  async function submitComplete() {
    if (!completing || !amountValid) return;
    const ok = await changeStatus(completing, "completed", { finalAmount: amountValue });
    if (ok) setCompleting(null);
  }

  async function confirmReject() {
    if (!rejecting) return;
    const ok = await changeStatus(rejecting, "rejected");
    if (ok) setRejecting(null);
  }

  // Only the buttons that are valid for the current status
  const actions = (b: Booking) => {
    const busy = busyId === b._id;
    switch (b.status) {
      case "requested":
        return (
          <div className="flex gap-2">
            <Button size="sm" disabled={busy} onClick={() => changeStatus(b, "accepted")}>
              {busy && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}Accept
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="text-destructive hover:text-destructive"
              disabled={busy}
              onClick={() => setRejecting(b)}
            >
              Reject
            </Button>
          </div>
        );
      case "accepted":
        return (
          <Button size="sm" disabled={busy} onClick={() => changeStatus(b, "in-progress")}>
            {busy && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}Start Work
          </Button>
        );
      case "in-progress":
        return (
          <Button size="sm" disabled={busy} onClick={() => openComplete(b)}>
            Mark Completed
          </Button>
        );
      case "completed":
        return <PaymentBadge status={b.paymentStatus} />;
      default:
        return <span className="text-sm text-muted-foreground">-</span>;
    }
  };

  if (!bookings) return <TableSkeleton />;

  return (
    <div className="space-y-5">
      {/* Status filter */}
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter requests by status">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            role="tab"
            aria-selected={filter === f.value}
            onClick={() => setFilter(f.value)}
            className={cn(
              "flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
              filter === f.value
                ? "border-primary bg-primary text-primary-foreground"
                : "bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            {f.label}
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-xs",
                filter === f.value ? "bg-black/10" : "bg-muted"
              )}
            >
              {counts[f.value] ?? 0}
            </span>
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title={filter === "all" ? "No requests yet" : "No requests with this status"}
          description={
            filter === "all"
              ? "When a customer requests one of your services, it appears here."
              : "Choose another status, or switch to All."
          }
        />
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden overflow-x-auto rounded-2xl border bg-card lg:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Preferred date</TableHead>
                  <TableHead className="min-w-[220px]">Problem</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visible.map((b) => (
                  <TableRow key={b._id}>
                    <TableCell>
                      <p className="font-medium">{b.customerName}</p>
                      <p className="text-xs text-muted-foreground">{b.customerPhone}</p>
                    </TableCell>
                    <TableCell className="max-w-[200px]">
                      <p className="line-clamp-2 text-sm" title={b.address}>{b.address}</p>
                    </TableCell>
                    <TableCell>{formatDate(b.preferredDate)}</TableCell>
                    <TableCell className="max-w-[280px]">
                      <p className="line-clamp-3 text-sm text-muted-foreground" title={b.problemDescription}>
                        {b.problemDescription}
                      </p>
                    </TableCell>
                    <TableCell className="max-w-[180px]">
                      <p className="line-clamp-2 text-sm font-medium">{b.serviceTitle}</p>
                      <p className="text-xs text-muted-foreground">
                        {b.status === "completed" ? `Final ${formatMoney(b.finalAmount)}` : `Base ${formatMoney(b.basePrice)}`}
                      </p>
                    </TableCell>
                    <TableCell><StatusBadge status={b.status} /></TableCell>
                    <TableCell className="text-right"><div className="flex justify-end">{actions(b)}</div></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile and tablet cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:hidden">
            {visible.map((b) => (
              <div key={b._id} className="flex flex-col gap-4 rounded-2xl border bg-card p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="line-clamp-2 font-medium">{b.serviceTitle}</p>
                    <p className="text-sm text-muted-foreground">{b.customerName}</p>
                  </div>
                  <StatusBadge status={b.status} />
                </div>
                <dl className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <dt className="text-xs text-muted-foreground">Phone</dt>
                    <dd className="font-medium">{b.customerPhone}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">Preferred date</dt>
                    <dd className="font-medium">{formatDate(b.preferredDate)}</dd>
                  </div>
                  <div className="col-span-2">
                    <dt className="text-xs text-muted-foreground">Address</dt>
                    <dd>{b.address}</dd>
                  </div>
                  <div className="col-span-2">
                    <dt className="text-xs text-muted-foreground">Problem</dt>
                    <dd className="text-muted-foreground">{b.problemDescription}</dd>
                  </div>
                </dl>
                <div className="mt-auto flex justify-end">{actions(b)}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Final amount modal */}
      <Dialog open={!!completing} onOpenChange={(open) => !open && !busyId && setCompleting(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Mark job as completed</DialogTitle>
            <DialogDescription>
              Enter the final amount for &quot;{completing?.serviceTitle}&quot;. The customer pays this amount.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="finalAmount">Final amount (USD)</Label>
            <Input
              id="finalAmount"
              type="number"
              inputMode="decimal"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="h-11"
              aria-invalid={!amountValid}
            />
            {!amountValid && <p className="text-sm text-destructive">Enter an amount greater than 0</p>}
            <p className="text-xs text-muted-foreground">
              Starting price was {completing ? formatMoney(completing.basePrice) : ""}.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCompleting(null)} disabled={!!busyId}>Cancel</Button>
            <Button onClick={submitComplete} disabled={!amountValid || !!busyId}>
              {busyId && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Mark Completed
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject confirmation */}
      <ConfirmModal
        open={!!rejecting}
        onOpenChange={(open) => !open && setRejecting(null)}
        title="Reject this request?"
        description={`The request from ${rejecting?.customerName ?? "this customer"} will be marked Rejected. This cannot be undone.`}
        confirmText="Reject request"
        loading={!!rejecting && busyId === rejecting._id}
        onConfirm={confirmReject}
      />
    </div>
  );
}
