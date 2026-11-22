"use client";

import { cn } from "@/lib/utils";

type Option = { value: string; label: string; count?: number };
type Props = { options: Option[]; value: string; onChange: (value: string) => void; label: string };

export default function FilterPills({ options, value, onChange, label }: Props) {
  return (
    <div className="flex flex-wrap gap-2" role="tablist" aria-label={label}>
      {options.map((o) => (
        <button
          key={o.value}
          role="tab"
          aria-selected={value === o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            "flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
            value === o.value
              ? "border-primary bg-primary text-primary-foreground"
              : "bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          {o.label}
          {o.count !== undefined && (
            <span className={cn("rounded-full px-2 py-0.5 text-xs", value === o.value ? "bg-black/10" : "bg-muted")}>{o.count}</span>
          )}
        </button>
      ))}
    </div>
  );
}
