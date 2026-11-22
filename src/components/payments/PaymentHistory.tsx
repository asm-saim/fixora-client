"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Copy, Receipt, Wallet } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import EmptyState from "@/components/shared/EmptyState";
import { TableSkeleton } from "@/components/shared/Skeletons";
import { api } from "@/lib/api";
import { formatDateTime, formatMoney } from "@/lib/format";
import type { Payment } from "@/types";

function TransactionId({ value }: { value: string }) {
  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      toast.success("Transaction ID copied");
    } catch {
      toast.error("Could not copy. Select the text and copy it manually.");
    }
  }
  return (
    <span className="flex items-center gap-1.5">
      <span className="break-all font-mono text-xs">{value}</span>
      <Button type="button" variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={copy} aria-label="Copy transaction ID">
        <Copy className="h-3.5 w-3.5" />
      </Button>
    </span>
  );
}

export default function PaymentHistory() {
  const [payments, setPayments] = useState<Payment[] | null>(null);

  const load = useCallback(async () => {
    try {
      const data = await api<{ payments: Payment[] }>("/api/payments/my", { auth: true });
      setPayments(data.payments);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not load your payments");
      setPayments([]);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const total = useMemo(() => (payments ?? []).reduce((sum, p) => sum + p.amount, 0), [payments]);

  if (!payments) return <TableSkeleton />;

  if (payments.length === 0) {
    return (
      <EmptyState
        icon={Receipt}
        title="No payments yet"
        description="When you pay for a completed repair, the receipt appears here."
        action={{ label: "View My Bookings", href: "/dashboard/customer/bookings" }}
      />
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-4 rounded-2xl border bg-card p-5 shadow-sm sm:max-w-sm">
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 dark:bg-green-500/15 text-green-700 dark:text-green-300">
          <Wallet className="h-6 w-6" />
        </span>
        <div>
          <p className="text-sm text-muted-foreground">Total paid</p>
          <p className="font-heading text-2xl font-bold">{formatMoney(total)}</p>
          <p className="text-xs text-muted-foreground">{payments.length} {payments.length === 1 ? "payment" : "payments"}</p>
        </div>
      </div>

      {/* Desktop table */}
      <div className="hidden overflow-x-auto rounded-2xl border bg-card md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Service</TableHead>
              <TableHead>Technician</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Transaction ID</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((p) => (
              <TableRow key={p._id}>
                <TableCell className="max-w-[220px] font-medium"><span className="line-clamp-2">{p.serviceTitle}</span></TableCell>
                <TableCell>{p.technicianName}</TableCell>
                <TableCell className="font-semibold">{formatMoney(p.amount)}</TableCell>
                <TableCell className="max-w-[260px]"><TransactionId value={p.transactionId} /></TableCell>
                <TableCell className="whitespace-nowrap">{formatDateTime(p.paidAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile cards */}
      <div className="grid gap-4 md:hidden">
        {payments.map((p) => (
          <div key={p._id} className="space-y-3 rounded-2xl border bg-card p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="line-clamp-2 font-medium">{p.serviceTitle}</p>
                <p className="text-sm text-muted-foreground">{p.technicianName}</p>
              </div>
              <p className="font-heading text-lg font-bold">{formatMoney(p.amount)}</p>
            </div>
            <p className="text-xs text-muted-foreground">{formatDateTime(p.paidAt)}</p>
            <TransactionId value={p.transactionId} />
          </div>
        ))}
      </div>
    </div>
  );
}
