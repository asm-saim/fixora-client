import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buildQuery, type ServiceFilterValues } from "@/lib/services";
import { cn } from "@/lib/utils";

function pageList(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const wanted = [...new Set([1, total, current - 1, current, current + 1])]
    .filter((p) => p >= 1 && p <= total)
    .sort((a, b) => a - b);
  const out: (number | "…")[] = [];
  let prev = 0;
  for (const p of wanted) {
    if (p - prev > 1) out.push("…");
    out.push(p);
    prev = p;
  }
  return out;
}

export default function Pagination({ page, totalPages, filters }: { page: number; totalPages: number; filters: ServiceFilterValues }) {
  if (totalPages <= 1) return null;

  const href = (p: number) => {
    const qs = buildQuery({ ...filters, page: p });
    return qs ? `/services?${qs}` : "/services";
  };

  return (
    <nav className="mt-10 flex flex-wrap items-center justify-center gap-2" aria-label="Pagination">
      {page > 1 ? (
        <Button render={<Link href={href(page - 1)} />} nativeButton={false} variant="outline" size="sm"><ChevronLeft className="mr-1 h-4 w-4" /> Previous</Button>
      ) : (
        <Button variant="outline" size="sm" disabled><ChevronLeft className="mr-1 h-4 w-4" /> Previous</Button>
      )}

      {pageList(page, totalPages).map((p, i) =>
        p === "…" ? (
          <span key={`gap-${i}`} className="px-1 text-muted-foreground">…</span>
        ) : (
          <Link
            key={p}
            href={href(p)}
            aria-current={p === page ? "page" : undefined}
            className={cn(
              "flex h-9 min-w-9 items-center justify-center rounded-lg border px-3 text-sm font-medium transition-colors",
              p === page ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:bg-muted"
            )}
          >
            {p}
          </Link>
        )
      )}

      {page < totalPages ? (
        <Button render={<Link href={href(page + 1)} />} nativeButton={false} variant="outline" size="sm">Next <ChevronRight className="ml-1 h-4 w-4" /></Button>
      ) : (
        <Button variant="outline" size="sm" disabled>Next <ChevronRight className="ml-1 h-4 w-4" /></Button>
      )}
    </nav>
  );
}