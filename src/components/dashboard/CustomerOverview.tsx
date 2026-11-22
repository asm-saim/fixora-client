"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, ClipboardList, CreditCard, Hammer } from "lucide-react";
import { ChartCard, MonthlyBars, StatusDonut } from "@/components/dashboard/charts";
import OverviewSkeleton from "@/components/dashboard/OverviewSkeleton";
import ErrorState from "@/components/shared/ErrorState";
import StatsCard from "@/components/shared/StatsCard";
import { useAuthedApi } from "@/hooks/use-api";
import { formatMoney } from "@/lib/format";
import type { CustomerStats } from "@/lib/stats-types";

export default function CustomerOverview() {
  const { data, error, reload } = useAuthedApi<CustomerStats>("/api/stats/customer");

  if (!data) return error ? <ErrorState message={error} onRetry={reload} /> : <OverviewSkeleton />;
  const { stats, byStatus, monthly } = data;

  return (
    <div className="space-y-6">
      {stats.awaitingPayment > 0 && (
        <Link
          href="/dashboard/customer/bookings"
          className="flex items-center justify-between gap-4 rounded-2xl border border-amber-200 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/15 p-4 text-amber-900 dark:text-amber-300 transition-colors hover:bg-amber-100 dark:hover:bg-amber-500/25"
        >
          <span className="flex items-center gap-3">
            <CreditCard className="h-5 w-5 shrink-0" />
            <span className="text-sm font-medium">
              {stats.awaitingPayment === 1 ? "1 completed job is" : `${stats.awaitingPayment} completed jobs are`} waiting for your payment.
            </span>
          </span>
          <span className="flex items-center gap-1 text-sm font-semibold">Pay now <ArrowRight className="h-4 w-4" /></span>
        </Link>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatsCard title="Total Requests" value={stats.totalRequests} icon={ClipboardList} tone="blue" hint="Everything you have requested" />
        <StatsCard title="Active Jobs" value={stats.activeJobs} icon={Hammer} tone="amber" hint="Requested, accepted or in progress" />
        <StatsCard title="Completed Jobs" value={stats.completedJobs} icon={CheckCircle2} tone="green" hint={`${formatMoney(stats.totalPaid)} paid so far`} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Your requests by status" subtitle="Colours match the status badges">
          <StatusDonut counts={byStatus} />
        </ChartCard>
        <ChartCard title="Your spending" subtitle="Payments over the last 6 months">
          <MonthlyBars data={monthly} label="Paid" />
        </ChartCard>
      </div>
    </div>
  );
}
