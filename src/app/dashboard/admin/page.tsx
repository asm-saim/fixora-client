import StatsCard from "@/components/shared/StatsCard";
import { ClipboardList, CheckCircle2, Hammer } from "lucide-react";

export default function Page() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Overview</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatsCard title="Total Requests" value={12} icon={ClipboardList} tone="blue" />
        <StatsCard title="Active Jobs" value={3} icon={Hammer} tone="amber" />
        <StatsCard title="Completed Jobs" value={9} icon={CheckCircle2} tone="green" />
      </div>
    </div>
  );
}