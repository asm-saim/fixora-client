"use client";

import Link from "next/link";
import { ArrowRight, BadgeCheck, Inbox, Wallet, Wrench } from "lucide-react";
import { ChartCard, MonthlyBars, StatusBars } from "@/components/dashboard/charts";
import OverviewSkeleton from "@/components/dashboard/OverviewSkeleton";
import ErrorState from "@/components/shared/ErrorState";
import StatsCard from "@/components/shared/StatsCard";
import { useAuthedApi } from "@/hooks/use-api";
import { formatMoney } from "@/lib/format";
import type { TechnicianStats } from "@/lib/stats-types";

export default function TechnicianOverview() {
  const { data, error, reload } = useAuthedApi<TechnicianStats>("/api/stats/technician");

  if (!data) return error ? <ErrorState message={error} onRetry={reload} /> : <OverviewSkeleton cards={4} />;
  const { stats, byStatus, monthly } = data;

  return (
    <div className="space-y-6">
      {stats.pendingRequests > 0 && (
        <Link
          href="/dashboard/technician/requests"
          className="flex items-center justify-between gap-4 rounded-2xl border border-blue-200 dark:border-blue-500/30 bg-blue-50 dark:bg-blue-500/15 p-4 text-blue-900 dark:text-blue-300 transition-colors hover:bg-blue-100 dark:hover:bg-blue-500/25"
        >
          <span className="flex items-center gap-3">
            <Inbox className="h-5 w-5 shrink-0" />
            <span className="text-sm font-medium">
              {stats.pendingRequests === 1 ? "1 new request is" : `${stats.pendingRequests} new requests are`} waiting for your answer.
            </span>
          </span>
          <span className="flex items-center gap-1 text-sm font-semibold">Review <ArrowRight className="h-4 w-4" /></span>
        </Link>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard title="Total Services" value={stats.totalServices} icon={Wrench} tone="teal" hint="All services you have added" />
        <StatsCard title="Approved Services" value={stats.approvedServices} icon={BadgeCheck} tone="green" hint="Visible to customers" />
        <StatsCard title="Pending Requests" value={stats.pendingRequests} icon={Inbox} tone="blue" hint={`${stats.activeJobs} jobs in progress`} />
        <StatsCard title="Earnings" value={formatMoney(stats.earnings)} icon={Wallet} tone="amber" hint={`${stats.completedJobs} completed jobs`} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Jobs by status" subtitle="All requests sent to you">
          <StatusBars counts={byStatus} />
        </ChartCard>
        <ChartCard title="Earnings" subtitle="Paid jobs over the last 6 months">
          <MonthlyBars data={monthly} label="Earned" />
        </ChartCard>
      </div>
    </div>
  );
}
