import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  value: number;
  /** icon size in Tailwind units, default h-4 w-4 */
  className?: string;
  label?: string;
};

/** Read-only stars. Decimals fill partially (4.5 shows four and a half stars). */
export default function StarRating({ value, className, label }: Props) {
  const clamped = Math.max(0, Math.min(5, value));
  const row = (filled: boolean) => (
    <span className="flex">
      {[0, 1, 2, 3, 4].map((i) => (
        <Star
          key={i}
          aria-hidden
          className={cn("shrink-0", className ?? "h-4 w-4", filled ? "fill-amber-400 text-amber-400" : "text-muted-foreground/40")}
        />
      ))}
    </span>
  );

  return (
    <span className="relative inline-flex" role="img" aria-label={label ?? `${clamped} out of 5 stars`}>
      {row(false)}
      <span className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${(clamped / 5) * 100}%` }}>
        {row(true)}
      </span>
    </span>
  );
}

/** "4.8 (12)" next to the stars, or "New" when nothing has been reviewed yet. */
export function RatingSummary({ average = 0, count = 0 }: { average?: number; count?: number }) {
  if (!count) return <span className="text-xs font-medium text-muted-foreground">New, no reviews yet</span>;
  return (
    <span className="inline-flex items-center gap-1.5 text-sm">
      <StarRating value={average} className="h-3.5 w-3.5" label={`Rated ${average} out of 5 from ${count} reviews`} />
      <span className="font-semibold">{average.toFixed(1)}</span>
      <span className="text-muted-foreground">({count})</span>
    </span>
  );
}
