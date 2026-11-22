import type { LucideIcon } from "lucide-react";
import { Counter } from "@/components/motion/Counter";
import { cn } from "@/lib/utils";

const TONE = {
  teal: "bg-teal-100 dark:bg-teal-500/15 text-teal-700 dark:text-teal-300",
  blue: "bg-blue-100 dark:bg-blue-500/15 text-blue-700 dark:text-blue-300",
  indigo: "bg-indigo-100 dark:bg-indigo-500/15 text-indigo-700 dark:text-indigo-300",
  amber: "bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-300",
  green: "bg-green-100 dark:bg-green-500/15 text-green-700 dark:text-green-300",
} as const;

type Props = {
  title: string;
  value: number | string;
  icon: LucideIcon;
  hint?: string;
  tone?: keyof typeof TONE;
};

export default function StatsCard({ title, value, icon: Icon, hint, tone = "teal" }: Props) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border bg-card p-5 shadow-sm">
      <span className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-xl", TONE[tone])}>
        <Icon className="h-6 w-6" />
      </span>
      <div className="min-w-0">
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="font-heading text-2xl font-bold">
          {typeof value === "number" ? <Counter to={value} /> : value}
        </p>
        {hint && <p className="truncate text-xs text-muted-foreground">{hint}</p>}
      </div>
    </div>
  );
}