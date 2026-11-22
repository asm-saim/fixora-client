"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import StarInput from "@/components/reviews/StarInput";
import { api } from "@/lib/api";
import { reviewSchema } from "@/lib/validations";
import type { Booking } from "@/types";

type Props = {
  booking: Booking | null;
  onClose: () => void;
  onReviewed: (updated: Booking) => void;
};

/** The form resets itself every time it opens for a different booking (it is keyed by booking id). */
export default function ReviewDialog({ booking, onClose, onReviewed }: Props) {
  return (
    <Dialog open={!!booking} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        {booking && <ReviewForm key={booking._id} booking={booking} onClose={onClose} onReviewed={onReviewed} />}
      </DialogContent>
    </Dialog>
  );
}

function ReviewForm({ booking, onClose, onReviewed }: { booking: Booking; onClose: () => void; onReviewed: (b: Booking) => void }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit() {
    const parsed = reviewSchema.safeParse({ rating, comment });
    if (!parsed.success) return setError(parsed.error.issues[0]?.message ?? "Check your review");
    setError("");
    setBusy(true);
    try {
      const updated = await api<Booking>(`/api/bookings/${booking._id}/review`, { method: "POST", auth: true, body: parsed.data });
      toast.success("Thanks for your review!");
      onReviewed(updated);
      onClose();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not save your review");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Rate this repair</DialogTitle>
        <DialogDescription>
          How was &quot;{booking.serviceTitle}&quot; by {booking.technicianName}? Your review helps other customers choose.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-5 py-1">
        <StarInput value={rating} onChange={(v) => { setRating(v); setError(""); }} disabled={busy} />

        <div className="space-y-2">
          <Label htmlFor="review-comment">Comment (optional)</Label>
          <Textarea
            id="review-comment"
            rows={4}
            maxLength={500}
            placeholder="What went well? Was the technician on time and clear about the cost?"
            value={comment}
            disabled={busy}
            onChange={(e) => setComment(e.target.value)}
          />
          <p className="text-right text-xs text-muted-foreground">{comment.length}/500</p>
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onClose} disabled={busy}>Not now</Button>
        <Button onClick={submit} disabled={busy}>
          {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Submit review
        </Button>
      </DialogFooter>
    </>
  );
}
