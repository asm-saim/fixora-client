import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container-page grid gap-8 py-10 lg:grid-cols-[1fr_380px] lg:gap-12">
      <div className="space-y-6">
        <Skeleton className="aspect-[16/10] w-full rounded-2xl" />
        <Skeleton className="h-9 w-3/4" />
        <div className="grid grid-cols-2 gap-4"><Skeleton className="h-20" /><Skeleton className="h-20" /></div>
        <Skeleton className="h-40 w-full" />
      </div>
      <Skeleton className="h-72 w-full rounded-2xl" />
    </div>
  );
}