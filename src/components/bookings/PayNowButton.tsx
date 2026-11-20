"use client";

import { useState } from "react";
import { CreditCard, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import type { Booking } from "@/types";

/** Stripe's hosted checkout always lives on a stripe.com address. Never redirect anywhere else. */
function isStripeUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && (url.hostname === "stripe.com" || url.hostname.endsWith(".stripe.com"));
  } catch {
    return false;
  }
}

export default function PayNowButton({ booking }: { booking: Booking }) {
  const [loading, setLoading] = useState(false);

  // The button exists only for completed jobs that are still unpaid
  if (booking.status !== "completed" || booking.paymentStatus !== "unpaid") return null;

  async function pay() {
    setLoading(true);
    try {
      // Only the booking id is sent. The server decides the amount from its own records.
      const { url } = await api<{ url: string }>("/api/payments/create-checkout-session", {
        method: "POST",
        auth: true,
        body: { bookingId: booking._id },
      });

      if (!isStripeUrl(url)) throw new Error("Received an unexpected payment link. Please try again.");
      window.location.assign(url); // keep the spinner on while the browser leaves for Stripe
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not start the payment. Please try again.");
      setLoading(false);
    }
  }

  return (
    <Button size="sm" onClick={pay} disabled={loading}>
      {loading ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : <CreditCard className="mr-1.5 h-3.5 w-3.5" />}
      Pay Now
    </Button>
  );
}
