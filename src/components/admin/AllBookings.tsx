"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { CalendarX } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import EmptyState from "@/components/shared/EmptyState";
import ErrorState from "@/components/shared/ErrorState";
import Pager from "@/components/shared/Pager";
import { TableSkeleton } from "@/components/shared/Skeletons";
import { PaymentBadge, StatusBadge } from "@/components/shared/StatusBadge";
import { useAuthedApi } from "@/hooks/use-api";
import { BOOKING_STATUS } from "@/lib/constants";
import { formatDate, formatMoney } from "@/lib/format";
import type { Paged } from "@/lib/stats-types";
import { cn } from "@/lib/utils";
import type { Booking } from "@/types";

type Response = Paged & { bookings: Booking[] };
const LIMIT = 10;
const amountOf = (b: Booking) => (b.status === "completed" ? { value: b.finalAmount, label: "Final" } : { value: b.basePrice, label: "Base" });

export default function AllBookings() {
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);

  const params = new URLSearchParams({ page: String(page), limit: String(LIMIT) });
  if (status !== "all") params.set("status", status);
  const { data, error, loading, reload } = useAuthedApi<Response>(`/api/admin/bookings?${params}`);

  useEffect(() => {
    if (data && data.page > data.totalPages) setPage(data.totalPages);
  }, [data]);

  return (
    <div className="space-y-5">
      <div className="sm:max-w-xs">
        <Select value={status} onValueChange={(value) => { setStatus(value); setPage(1); }}>
          <SelectTrigger className="h-11 w-full" aria-label="Filter by status"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {(Object.keys(BOOKING_STATUS) as (keyof typeof BOOKING_STATUS)[]).map((s) => (
              <SelectItem key={s} value={s}>{BOOKING_STATUS[s].label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {!data ? (
        error ? <ErrorState message={error} onRetry={reload} /> : <TableSkeleton />
      ) : data.bookings.length === 0 ? (
        <EmptyState icon={CalendarX} title="No bookings found" description={status === "all" ? "Bookings appear here once customers send requests." : "No bookings have this status."} />
      ) : (
        <div className={cn("space-y-4 transition-opacity", loading && "opacity-60")}>
          <div className="hidden overflow-x-auto rounded-2xl border bg-card lg:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Technician</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.bookings.map((b) => {
                  const amount = amountOf(b);
                  return (
                    <TableRow key={b._id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Image src={b.serviceImage} alt="" width={48} height={48} className="h-12 w-12 rounded-lg object-cover" />
                          <div className="min-w-0">
                            <p className="line-clamp-1 max-w-[200px] font-medium">{b.serviceTitle}</p>
                            <p className="text-xs text-muted-foreground">{b.category}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell><p className="text-sm font-medium">{b.customerName}</p><p className="text-xs text-muted-foreground">{b.customerEmail}</p></TableCell>
                      <TableCell><p className="text-sm font-medium">{b.technicianName}</p><p className="text-xs text-muted-foreground">{b.technicianEmail}</p></TableCell>
                      <TableCell className="whitespace-nowrap">{formatDate(b.preferredDate)}</TableCell>
                      <TableCell><StatusBadge status={b.status} /></TableCell>
                      <TableCell><PaymentBadge status={b.paymentStatus} /></TableCell>
                      <TableCell className="text-right">
                        <p className="font-medium">{formatMoney(amount.value)}</p>
                        <p className="text-xs text-muted-foreground">{amount.label}</p>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:hidden">
            {data.bookings.map((b) => {
              const amount = amountOf(b);
              return (
                <div key={b._id} className="space-y-3 rounded-2xl border bg-card p-4">
                  <div className="flex items-start justify-between gap-3">
                    <p className="line-clamp-2 font-medium">{b.serviceTitle}</p>
                    <StatusBadge status={b.status} />
                  </div>
                  <dl className="grid grid-cols-2 gap-3 text-sm">
                    <div><dt className="text-xs text-muted-foreground">Customer</dt><dd className="font-medium">{b.customerName}</dd></div>
                    <div><dt className="text-xs text-muted-foreground">Technician</dt><dd className="font-medium">{b.technicianName}</dd></div>
                    <div><dt className="text-xs text-muted-foreground">Date</dt><dd className="font-medium">{formatDate(b.preferredDate)}</dd></div>
                    <div><dt className="text-xs text-muted-foreground">{amount.label} amount</dt><dd className="font-medium">{formatMoney(amount.value)}</dd></div>
                  </dl>
                  <PaymentBadge status={b.paymentStatus} />
                </div>
              );
            })}
          </div>

          <Pager page={data.page} totalPages={data.totalPages} total={data.total} limit={data.limit} onPage={setPage} busy={loading} />
        </div>
      )}
    </div>
  );
}
