import { StatsSkeleton } from "@/components/shared/Skeletons";
import { Skeleton } from "@/components/ui/skeleton";

export default function OverviewSkeleton({ cards = 3 }: { cards?: number }) {
  return (
    <div className="space-y-6">
      <StatsSkeleton count={cards} />
      <div className="grid gap-6 lg:grid-cols-2">
        <Skeleton className="h-80 rounded-2xl" />
        <Skeleton className="h-80 rounded-2xl" />
      </div>
    </div>
  );
}
