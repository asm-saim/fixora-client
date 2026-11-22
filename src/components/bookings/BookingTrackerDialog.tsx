"use client";

import Image from "next/image";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import JobTimeline from "@/components/bookings/JobTimeline";
import StarRating from "@/components/reviews/StarRating";
import { PaymentBadge, StatusBadge } from "@/components/shared/StatusBadge";
import { formatDate, formatMoney } from "@/lib/format";
import type { Booking } from "@/types";

type Props = {
  booking: Booking | null;
  onClose: () => void;
  audience?: "customer" | "technician";
};

export default function BookingTrackerDialog({ booking, onClose, audience = "customer" }: Props) {
  return (
    <Dialog open={!!booking} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
        {booking && (
          <>
            <DialogHeader>
              <DialogTitle>Job tracker</DialogTitle>
              <DialogDescription>
                {audience === "customer" ? `Repair by ${booking.technicianName}` : `Request from ${booking.customerName}`}
              </DialogDescription>
            </DialogHeader>

            <div className="flex gap-3 rounded-xl border bg-muted/40 p-3">
              <Image src={booking.serviceImage} alt="" width={56} height={56} className="h-14 w-14 shrink-0 rounded-lg object-cover" />
              <div className="min-w-0 flex-1">
                <p className="line-clamp-2 text-sm font-semibold">{booking.serviceTitle}</p>
                <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                  <StatusBadge status={booking.status} />
                  {booking.status === "completed" && <PaymentBadge status={booking.paymentStatus} />}
                </div>
              </div>
            </div>

            <dl className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-xs text-muted-foreground">Preferred date</dt>
                <dd className="font-medium">{formatDate(booking.preferredDate)}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">{booking.status === "completed" ? "Final amount" : "Base price"}</dt>
                <dd className="font-medium">{formatMoney(booking.status === "completed" ? booking.finalAmount : booking.basePrice)}</dd>
              </div>
            </dl>

            <div className="pt-1">
              <JobTimeline booking={booking} audience={audience} />
            </div>

            {booking.review && (
              <div className="rounded-xl border bg-card p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {audience === "customer" ? "Your review" : "Customer review"}
                </p>
                <StarRating value={booking.review.rating} className="mt-1.5 h-4 w-4" />
                {booking.review.comment && <p className="mt-2 text-sm text-muted-foreground">{booking.review.comment}</p>}
              </div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
