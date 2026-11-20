import { Check } from "lucide-react";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { cn } from "@/lib/utils";

const STEPS = [
  { label: "Requested", state: "done" },
  { label: "Accepted", state: "done" },
  { label: "In Progress", state: "current" },
  { label: "Completed", state: "todo" },
  { label: "Paid", state: "todo" },
] as const;

export default function JobTrackerMock() {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-secondary p-6 sm:p-10">
      <div className="pointer-events-none absolute -left-10 -top-10 h-48 w-48 rounded-full bg-primary/25 blur-3xl" />
      <div className="relative rounded-2xl bg-card p-6 shadow-xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-semibold">iPhone Screen Replacement</p>
            <p className="text-sm text-muted-foreground">Technician: Rafiq Ahmed</p>
          </div>
          <StatusBadge status="in-progress" />
        </div>

        <ol className="mt-6 space-y-0">
          {STEPS.map((step, i) => (
            <li key={step.label} className="relative flex gap-4 pb-6 last:pb-0">
              {i < STEPS.length - 1 && (
                <span
                  className={cn("absolute left-[13px] top-7 h-[calc(100%-1.75rem)] w-0.5", step.state === "done" ? "bg-primary" : "bg-border")}
                  aria-hidden="true"
                />
              )}
              <span
                className={cn(
                  "relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 text-xs",
                  step.state === "done" && "border-primary bg-primary text-primary-foreground",
                  step.state === "current" && "border-amber-500 bg-amber-100 text-amber-700",
                  step.state === "todo" && "border-border bg-card text-muted-foreground"
                )}
              >
                {step.state === "done" ? <Check className="h-4 w-4" /> : i + 1}
              </span>
              <span className={cn("pt-0.5 text-sm", step.state === "todo" ? "text-muted-foreground" : "font-medium")}>
                {step.label}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}