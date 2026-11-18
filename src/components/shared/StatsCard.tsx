import type { LucideIcon } from "lucide-react";
import { Counter } from "@/components/motion/Counter";
import { cn } from "@/lib/utils";

const TONE = {
  teal: "bg-teal-100 text-teal-700",
  blue: "bg-blue-100 text-blue-700",
  indigo: "bg-indigo-100 text-indigo-700",
  amber: "bg-amber-100 text-amber-700",
  green: "bg-green-100 text-green-700",
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