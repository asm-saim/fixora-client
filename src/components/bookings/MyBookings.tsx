"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { ClipboardList } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import ConfirmModal from "@/components/shared/ConfirmModal";
import EmptyState from "@/components/shared/EmptyState";
import { TableSkeleton } from "@/components/shared/Skeletons";
import { PaymentBadge, StatusBadge } from "@/components/shared/StatusBadge";
import { api } from "@/lib/api";
import { formatDate, formatMoney } from "@/lib/format";
import type { Booking } from "@/types";

/** Base price until the technician completes the job, then the final amount. */
const amountOf = (b: Booking) =>
  b.status === "completed" ? { value: b.finalAmount, label: "Final" } : { value: b.basePrice, label: "Base" };

export default function MyBookings() {
  const [bookings, setBookings] = useState<Booking[] | null>(null);
  const [cancelling, setCancelling] = useState<Booking | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await api<{ bookings: Booking[] }>("/api/bookings/my", { auth: true });
      setBookings(data.bookings);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not load your bookings");
      setBookings([]);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function confirmCancel() {
    if (!cancelling) return;
    setBusy(true);
    try {
      const updated = await api<Booking>(`/api/bookings/${cancelling._id}/cancel`, { method: "PATCH", auth: true });
      setBookings((list) => list?.map((b) => (b._id === updated._id ? updated : b)) ?? null);
      toast.success("Request cancelled");
      setCancelling(null);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not cancel the request");
      setCancelling(null);
      load(); // the technician may have just accepted it, so show the real status
    } finally {
      setBusy(false);
    }
  }

  if (!bookings) return <TableSkeleton />;

  if (bookings.length === 0) {
    return (
      <EmptyState
        icon={ClipboardList}
        title="You have no bookings yet"
        description="Find a repair service, send a request, and track it here."
        action={{ label: "Browse Services", href: "/services" }}
      />
    );
  }

  // Cancel only while the request is still "requested"
  const actions = (b: Booking) => {
    if (b.status === "requested") {
      return (
        <Button size="sm" variant="outline" className="text-destructive hover:text-destructive" onClick={() => setCancelling(b)}>
          Cancel request
        </Button>
      );
    }
    if (b.status === "completed" && b.paymentStatus === "unpaid") {
      // STEP 9: replace this line with the Pay Now button
      return <span className="text-sm font-medium text-amber-700">Payment due</span>;
    }
    return <span className="text-sm text-muted-foreground">-</span>;
  };

  return (
    <>
      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-2xl border bg-card md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Service</TableHead>
              <TableHead>Technician</TableHead>
              <TableHead>Preferred date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((b) => {
              const amount = amountOf(b);
              return (
                <TableRow key={b._id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Image src={b.serviceImage} alt="" width={56} height={56} className="h-14 w-14 rounded-lg object-cover" />
                      <div className="min-w-0">
                        <p className="line-clamp-1 font-medium">{b.serviceTitle}</p>
                        <p className="text-xs text-muted-foreground">{b.category}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{b.technicianName}</TableCell>
                  <TableCell>{formatDate(b.preferredDate)}</TableCell>
                  <TableCell>
                    <p className="font-medium">{formatMoney(amount.value)}</p>
                    <p className="text-xs text-muted-foreground">{amount.label}</p>
                  </TableCell>
                  <TableCell><StatusBadge status={b.status} /></TableCell>
                  <TableCell><PaymentBadge status={b.paymentStatus} /></TableCell>
                  <TableCell className="text-right"><div className="flex justify-end">{actions(b)}</div></TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Mobile cards */}
      <div className="grid gap-4 md:hidden">
        {bookings.map((b) => {
          const amount = amountOf(b);
          return (
            <div key={b._id} className="space-y-4 rounded-2xl border bg-card p-4">
              <div className="flex gap-3">
                <Image src={b.serviceImage} alt="" width={64} height={64} className="h-16 w-16 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 font-medium">{b.serviceTitle}</p>
                  <p className="text-sm text-muted-foreground">{b.technicianName}</p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    <StatusBadge status={b.status} />
                    <PaymentBadge status={b.paymentStatus} />
                  </div>
                </div>
              </div>
              <dl className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <dt className="text-xs text-muted-foreground">Preferred date</dt>
                  <dd className="font-medium">{formatDate(b.preferredDate)}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">{amount.label} amount</dt>
                  <dd className="font-medium">{formatMoney(amount.value)}</dd>
                </div>
              </dl>
              <div className="flex justify-end">{actions(b)}</div>
            </div>
          );
        })}
      </div>

      <ConfirmModal
        open={!!cancelling}
        onOpenChange={(open) => !open && setCancelling(null)}
        title="Cancel this request?"
        description={`Your request for "${cancelling?.serviceTitle ?? ""}" will be cancelled. You can send a new request later.`}
        confirmText="Cancel request"
        loading={busy}
        onConfirm={confirmCancel}
      />
    </>
  );
}
