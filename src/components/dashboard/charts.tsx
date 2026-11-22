"use client";

import type { ReactNode } from "react";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { BOOKING_STATUS } from "@/lib/constants";
import { formatMoney } from "@/lib/format";
import type { MonthlyPoint, StatusCounts } from "@/lib/stats-types";

/** The same colours as the status badges, so a status looks identical everywhere. */
export const STATUS_COLORS: Record<keyof typeof BOOKING_STATUS, string> = {
  requested: "#3b82f6",
  accepted: "#6366f1",
  "in-progress": "#f59e0b",
  completed: "#22c55e",
  rejected: "#ef4444",
  cancelled: "#9ca3af",
};

const TOOLTIP = {
  contentStyle: { background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--foreground)", fontSize: 13 },
  cursor: { fill: "var(--muted)" },
};
const AXIS_TICK = { fill: "var(--muted-foreground)", fontSize: 12 };

const monthLabel = (month: string) =>
  new Intl.DateTimeFormat("en-US", { month: "short", timeZone: "UTC" }).format(new Date(`${month}-01T00:00:00Z`));

export function ChartCard({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col rounded-2xl border bg-card p-5 shadow-sm">
      <h2 className="text-base font-semibold">{title}</h2>
      {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      <div className="mt-4 flex-1">{children}</div>
    </div>
  );
}

function EmptyChart({ text }: { text: string }) {
  return <div className="flex h-64 items-center justify-center rounded-xl bg-muted/50 text-sm text-muted-foreground">{text}</div>;
}

export type Slice = { name: string; value: number; color: string };

/** Donut with the total in the middle and a legend underneath. */
export function Donut({ slices, emptyText = "No data yet" }: { slices: Slice[]; emptyText?: string }) {
  const visible = slices.filter((s) => s.value > 0);
  const total = visible.reduce((sum, s) => sum + s.value, 0);
  if (total === 0) return <EmptyChart text={emptyText} />;

  return (
    <div>
      <div className="relative h-56" role="img" aria-label={visible.map((s) => `${s.name}: ${s.value}`).join(", ")}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={visible} dataKey="value" nameKey="name" innerRadius="62%" outerRadius="90%" paddingAngle={2} stroke="none">
              {visible.map((s) => <Cell key={s.name} fill={s.color} />)}
            </Pie>
            <Tooltip {...TOOLTIP} />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-heading text-3xl font-bold">{total}</span>
          <span className="text-xs text-muted-foreground">total</span>
        </div>
      </div>
      <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
        {visible.map((s) => (
          <li key={s.name} className="flex items-center gap-2">
            <span className="h-3 w-3 shrink-0 rounded-full" style={{ background: s.color }} />
            <span className="truncate text-muted-foreground">{s.name}</span>
            <span className="ml-auto font-medium">{s.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Donut of booking statuses. */
export function StatusDonut({ counts }: { counts: StatusCounts }) {
  const slices = (Object.keys(BOOKING_STATUS) as (keyof typeof BOOKING_STATUS)[]).map((key) => ({
    name: BOOKING_STATUS[key].label,
    value: counts[key] ?? 0,
    color: STATUS_COLORS[key],
  }));
  return <Donut slices={slices} emptyText="No bookings yet" />;
}

/** One bar per booking status. */
export function StatusBars({ counts }: { counts: StatusCounts }) {
  const keys = Object.keys(BOOKING_STATUS) as (keyof typeof BOOKING_STATUS)[];
  const data = keys.map((key) => ({ key, name: BOOKING_STATUS[key].label, value: counts[key] ?? 0 }));
  if (data.every((d) => d.value === 0)) return <EmptyChart text="No bookings yet" />;

  return (
    <div className="h-64" role="img" aria-label={data.map((d) => `${d.name}: ${d.value}`).join(", ")}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
          <XAxis dataKey="name" tick={{ ...AXIS_TICK, fontSize: 11 }} tickLine={false} axisLine={false} interval={0} />
          <YAxis allowDecimals={false} tick={AXIS_TICK} tickLine={false} axisLine={false} />
          <Tooltip {...TOOLTIP} />
          <Bar dataKey="value" name="Bookings" radius={[6, 6, 0, 0]}>
            {data.map((d) => <Cell key={d.key} fill={STATUS_COLORS[d.key]} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/** Money per month for the last six months. */
export function MonthlyBars({ data, label }: { data: MonthlyPoint[]; label: string }) {
  if (data.every((d) => d.amount === 0)) return <EmptyChart text="No payments in the last 6 months" />;
  const rows = data.map((d) => ({ name: monthLabel(d.month), amount: d.amount }));

  return (
    <div className="h-64" role="img" aria-label={rows.map((r) => `${r.name}: ${formatMoney(r.amount)}`).join(", ")}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={rows} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
          <XAxis dataKey="name" tick={AXIS_TICK} tickLine={false} axisLine={false} />
          <YAxis tick={AXIS_TICK} tickLine={false} axisLine={false} tickFormatter={(v: number) => `$${v}`} />
          <Tooltip {...TOOLTIP} formatter={(value) => [formatMoney(Number(value)), label]} />
          <Bar dataKey="amount" name={label} fill="#14b8a6" radius={[6, 6, 0, 0]} maxBarSize={48} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
