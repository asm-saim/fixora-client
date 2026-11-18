import { Badge } from "@/components/ui/badge";
import { APPROVAL_STATUS, BOOKING_STATUS, PAYMENT_STATUS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function StatusBadge({ status }: { status: keyof typeof BOOKING_STATUS }) {
  const s = BOOKING_STATUS[status];
  return <Badge variant="outline" className={cn("font-medium", s.className)}>{s.label}</Badge>;
}

export function PaymentBadge({ status }: { status: keyof typeof PAYMENT_STATUS }) {
  const s = PAYMENT_STATUS[status];
  return <Badge variant="outline" className={cn("font-medium", s.className)}>{s.label}</Badge>;
}

export function ApprovalBadge({ status }: { status: keyof typeof APPROVAL_STATUS }) {
  const s = APPROVAL_STATUS[status];
  return <Badge variant="outline" className={cn("font-medium", s.className)}>{s.label}</Badge>;
}