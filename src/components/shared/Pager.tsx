"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = { page: number; totalPages: number; total: number; limit: number; onPage: (page: number) => void; busy?: boolean };

export default function Pager({ page, totalPages, total, limit, onPage, busy }: Props) {
  if (total === 0) return null;
  const from = (page - 1) * limit + 1;
  const to = Math.min(total, page * limit);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <p className="text-sm text-muted-foreground">
        Showing <span className="font-semibold text-foreground">{from}-{to}</span> of{" "}
        <span className="font-semibold text-foreground">{total}</span>
      </p>
      {totalPages > 1 && (
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled={page <= 1 || busy} onClick={() => onPage(page - 1)}>
            <ChevronLeft className="mr-1 h-4 w-4" /> Previous
          </Button>
          <span className="px-2 text-sm text-muted-foreground">Page {page} of {totalPages}</span>
          <Button variant="outline" size="sm" disabled={page >= totalPages || busy} onClick={() => onPage(page + 1)}>
            Next <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
