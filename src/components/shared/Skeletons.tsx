import { Skeleton } from "@/components/ui/skeleton";

export function ServiceCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border bg-card">
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <div className="space-y-3 p-5">
        <Skeleton className="h-6 w-4/5" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex items-center justify-between pt-4">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-9 w-28" />
        </div>
      </div>
    </div>
  );
}

export function ServiceGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => <ServiceCardSkeleton key={i} />)}
    </div>
  );
}

export function StatsSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 rounded-2xl border bg-card p-5">
          <Skeleton className="h-12 w-12 rounded-xl" />
          <div className="space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-6 w-16" /></div>
        </div>
      ))}
    </div>
  );
}

export function TableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="space-y-3 rounded-2xl border bg-card p-4">
      <Skeleton className="h-10 w-full" />
      {Array.from({ length: rows }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}
    </div>
  );
}