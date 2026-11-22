"use client";

import Link from "next/link";
import { ArrowRight, HardHat, ShieldAlert, Users, Wallet } from "lucide-react";
import { ChartCard, Donut, MonthlyBars, StatusBars } from "@/components/dashboard/charts";
import OverviewSkeleton from "@/components/dashboard/OverviewSkeleton";
import ErrorState from "@/components/shared/ErrorState";
import StatsCard from "@/components/shared/StatsCard";
import { useAuthedApi } from "@/hooks/use-api";
import { formatMoney } from "@/lib/format";
import type { AdminStats } from "@/lib/stats-types";

export default function AdminOverview() {
  const { data, error, reload } = useAuthedApi<AdminStats>("/api/stats/admin");

  if (!data) return error ? <ErrorState message={error} onRetry={reload} /> : <OverviewSkeleton cards={4} />;
  const { stats, usersByRole, byStatus, monthly } = data;

  return (
    <div className="space-y-6">
      {stats.pendingServices > 0 && (
        <Link
          href="/dashboard/admin/services"
          className="flex items-center justify-between gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-900 transition-colors hover:bg-amber-100"
        >
          <span className="flex items-center gap-3">
            <ShieldAlert className="h-5 w-5 shrink-0" />
            <span className="text-sm font-medium">
              {stats.pendingServices === 1 ? "1 service is" : `${stats.pendingServices} services are`} waiting for approval.
            </span>
          </span>
          <span className="flex items-center gap-1 text-sm font-semibold">Review <ArrowRight className="h-4 w-4" /></span>
        </Link>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard title="Total Users" value={stats.totalUsers} icon={Users} tone="teal" hint="Customers, technicians and admins" />
        <StatsCard title="Total Technicians" value={stats.totalTechnicians} icon={HardHat} tone="indigo" hint="Can list services" />
        <StatsCard title="Pending Services" value={stats.pendingServices} icon={ShieldAlert} tone="amber" hint="Need your review" />
        <StatsCard title="Total Revenue" value={formatMoney(stats.totalRevenue)} icon={Wallet} tone="green" hint={`${stats.totalBookings} bookings in total`} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Users by role">
          <Donut
            slices={[
              { name: "Customers", value: usersByRole.customer, color: "#14b8a6" },
              { name: "Technicians", value: usersByRole.technician, color: "#6366f1" },
              { name: "Admins", value: usersByRole.admin, color: "#f59e0b" },
            ]}
            emptyText="No users yet"
          />
        </ChartCard>
        <ChartCard title="Revenue" subtitle="Stripe payments over the last 6 months">
          <MonthlyBars data={monthly} label="Revenue" />
        </ChartCard>
      </div>

      <ChartCard title="Bookings by status" subtitle="Every job on the platform">
        <StatusBars counts={byStatus} />
      </ChartCard>
    </div>
  );
}
