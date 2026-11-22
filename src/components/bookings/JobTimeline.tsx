import {
  Ban, CheckCircle2, ClipboardList, CreditCard, UserCheck, Wrench, XCircle, type LucideIcon,
} from "lucide-react";
import { formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Booking } from "@/types";

type StepKey = "requested" | "accepted" | "in-progress" | "completed" | "paid";

type Step = { key: StepKey; label: string; icon: LucideIcon; waiting: string; tone: string };

// Same colours as the status badges, so a step looks like its status everywhere
const STEPS: Step[] = [
  { key: "requested", label: "Requested", icon: ClipboardList, waiting: "Request sent", tone: "bg-blue-500" },
  { key: "accepted", label: "Accepted", icon: UserCheck, waiting: "Waiting for the technician to accept", tone: "bg-indigo-500" },
  { key: "in-progress", label: "In Progress", icon: Wrench, waiting: "Work has not started yet", tone: "bg-amber-500" },
  { key: "completed", label: "Completed", icon: CheckCircle2, waiting: "The technician sets the final amount", tone: "bg-green-500" },
  { key: "paid", label: "Paid", icon: CreditCard, waiting: "You pay after the job is completed", tone: "bg-green-600" },
];

const RANK: Record<string, number> = { requested: 0, accepted: 1, "in-progress": 2, completed: 3 };

/** How far along the normal path a booking is (0 to 4). */
function reached(b: Booking) {
  if (b.paymentStatus === "paid") return 4;
  return RANK[b.status] ?? 0;
}

function timeOf(b: Booking, status: string): string | null {
  const entry = b.statusHistory?.find((h) => h.status === status);
  if (entry) return entry.changedAt;
  if (status === "requested") return b.createdAt; // older bookings have no history
  if (status === "paid") return null;
  return null;
}

type RowProps = { icon: LucideIcon; title: string; note: string; state: "done" | "current" | "upcoming"; tone: string; last?: boolean };

function Row({ icon: Icon, title, note, state, tone, last }: RowProps) {
  return (
    <li className="relative flex gap-4 pb-6 last:pb-0">
      {!last && (
        <span
          aria-hidden
          className={cn("absolute left-[17px] top-9 h-[calc(100%-2.25rem)] w-0.5", state === "done" ? "bg-primary/60" : "bg-border")}
        />
      )}
      <span
        className={cn(
          "relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2",
          state === "upcoming" ? "border-dashed border-border bg-card text-muted-foreground" : cn("border-transparent text-white", tone),
          state === "current" && "ring-4 ring-primary/25"
        )}
      >
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0 pt-1">
        <p className={cn("text-sm font-semibold leading-tight", state === "upcoming" && "text-muted-foreground")}>{title}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{note}</p>
      </div>
    </li>
  );
}

/** Vertical job tracker built from the booking's statusHistory. */
export default function JobTimeline({ booking, audience = "customer" }: { booking: Booking; audience?: "customer" | "technician" }) {
  const when = (status: string) => {
    const t = timeOf(booking, status);
    return t ? formatDateTime(t) : null;
  };

  // A rejected or cancelled job stops early, so the path ends with a red or grey step
  if (booking.status === "rejected" || booking.status === "cancelled") {
    const rejected = booking.status === "rejected";
    return (
      <ol aria-label="Job progress">
        <Row icon={ClipboardList} title="Requested" note={when("requested") ?? "Request sent"} state="done" tone="bg-blue-500" />
        <Row
          icon={rejected ? XCircle : Ban}
          title={rejected ? "Rejected" : "Cancelled"}
          note={
            when(booking.status) ??
            (rejected ? "The technician could not take this job" : "The customer cancelled this request")
          }
          state="current"
          tone={rejected ? "bg-red-500" : "bg-gray-500"}
          last
        />
      </ol>
    );
  }

  const at = reached(booking);

  return (
    <ol aria-label="Job progress">
      {STEPS.map((step, i) => {
        const state = i < at || at === 4 ? "done" : i === at ? "current" : "upcoming";
        const note =
          state === "upcoming"
            ? audience === "technician" && step.key === "paid"
              ? "The customer pays after completion"
              : step.waiting
            : step.key === "completed"
              ? `${when("completed") ?? "Done"} · Final ${formatFinal(booking.finalAmount)}`
              : when(step.key) ?? (state === "current" ? "In progress now" : "Done");
        return <Row key={step.key} icon={step.icon} title={step.label} note={note} state={state} tone={step.tone} last={i === STEPS.length - 1} />;
      })}
    </ol>
  );
}

const formatFinal = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
