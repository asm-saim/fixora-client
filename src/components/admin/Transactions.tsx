"use client";

import { useEffect, useState } from "react";
import { Receipt, Wallet } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import EmptyState from "@/components/shared/EmptyState";
import ErrorState from "@/components/shared/ErrorState";
import Pager from "@/components/shared/Pager";
import { TableSkeleton } from "@/components/shared/Skeletons";
import { useAuthedApi } from "@/hooks/use-api";
import { formatDateTime, formatMoney } from "@/lib/format";
import type { Paged } from "@/lib/stats-types";
import { cn } from "@/lib/utils";
import type { Payment } from "@/types";

type Response = Paged & { payments: Payment[]; totalRevenue: number };
const LIMIT = 10;

export default function Transactions() {
  const [page, setPage] = useState(1);
  const { data, error, loading, reload } = useAuthedApi<Response>(`/api/admin/payments?page=${page}&limit=${LIMIT}`);

  useEffect(() => {
    if (data && data.page > data.totalPages) {
      queueMicrotask(() => setPage(data.totalPages));
    }
  }, [data]);

  if (!data) return error ? <ErrorState message={error} onRetry={reload} /> : <TableSkeleton />;

  return (
    <div className="space-y-5">
      {/* Total revenue sits above the table, and covers every payment (not just this page) */}
      <div className="flex items-center gap-4 rounded-2xl border bg-card p-5 shadow-sm sm:max-w-sm">
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 dark:bg-green-500/15 text-green-700 dark:text-green-300"><Wallet className="h-6 w-6" /></span>
        <div>
          <p className="text-sm text-muted-foreground">Total revenue</p>
          <p className="font-heading text-3xl font-bold">{formatMoney(data.totalRevenue)}</p>
          <p className="text-xs text-muted-foreground">{data.total} {data.total === 1 ? "transaction" : "transactions"}</p>
        </div>
      </div>

      {data.payments.length === 0 ? (
        <EmptyState icon={Receipt} title="No transactions yet" description="Stripe payments appear here after customers pay for completed jobs." />
      ) : (
        <div className={cn("space-y-4 transition-opacity", loading && "opacity-60")}>
          <div className="hidden overflow-x-auto rounded-2xl border bg-card lg:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Technician</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Paid on</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.payments.map((p) => (
                  <TableRow key={p._id}>
                    <TableCell><p className="text-sm font-medium">{p.customerName}</p><p className="text-xs text-muted-foreground">{p.customerEmail}</p></TableCell>
                    <TableCell><p className="text-sm font-medium">{p.technicianName}</p><p className="text-xs text-muted-foreground">{p.technicianEmail}</p></TableCell>
                    <TableCell className="max-w-[200px]"><span className="line-clamp-2 text-sm">{p.serviceTitle}</span></TableCell>
                    <TableCell className="font-semibold">{formatMoney(p.amount)}</TableCell>
                    <TableCell className="max-w-[220px]"><span className="break-all font-mono text-xs">{p.transactionId}</span></TableCell>
                    <TableCell className="whitespace-nowrap">{formatDateTime(p.paidAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:hidden">
            {data.payments.map((p) => (
              <div key={p._id} className="space-y-3 rounded-2xl border bg-card p-4">
                <div className="flex items-start justify-between gap-3">
                  <p className="line-clamp-2 font-medium">{p.serviceTitle}</p>
                  <p className="font-heading text-lg font-bold">{formatMoney(p.amount)}</p>
                </div>
                <dl className="grid grid-cols-2 gap-3 text-sm">
                  <div><dt className="text-xs text-muted-foreground">Customer</dt><dd className="font-medium">{p.customerName}</dd></div>
                  <div><dt className="text-xs text-muted-foreground">Technician</dt><dd className="font-medium">{p.technicianName}</dd></div>
                </dl>
                <p className="text-xs text-muted-foreground">{formatDateTime(p.paidAt)}</p>
                <p className="break-all font-mono text-xs">{p.transactionId}</p>
              </div>
            ))}
          </div>

          <Pager page={data.page} totalPages={data.totalPages} total={data.total} limit={data.limit} onPage={setPage} busy={loading} />
        </div>
      )}
    </div>
  );
}
