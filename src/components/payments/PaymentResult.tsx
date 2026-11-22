"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { api } from "@/lib/api";
import { formatDateTime, formatMoney } from "@/lib/format";
import type { Payment } from "@/types";

type VerifyResponse = { payment: Payment; alreadyRecorded: boolean };
type State =
  | { phase: "loading" }
  | { phase: "success"; payment: Payment }
  | { phase: "error"; message: string };

export default function PaymentResult({ sessionId }: { sessionId: string | null }) {
  const [state, setState] = useState<State>(
    sessionId ? { phase: "loading" } : { phase: "error", message: "This page needs a payment session. Open it from your bookings." }
  );
  const started = useRef(false);

  const verify = useCallback(async () => {
    if (!sessionId) return;
    setState({ phase: "loading" });
    try {
      const data = await api<VerifyResponse>(`/api/payments/verify?session_id=${encodeURIComponent(sessionId)}`, { auth: true });
      setState({ phase: "success", payment: data.payment });
    } catch (e) {
      setState({ phase: "error", message: e instanceof Error ? e.message : "We could not confirm your payment." });
    }
  }, [sessionId]);

  // Verify once on arrival. The server is safe to call again, so Try Again can never double-save.
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    verify();
  }, [verify]);

  if (state.phase === "loading") {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center rounded-2xl border bg-card p-10 text-center shadow-sm" role="status">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <h1 className="mt-5 text-xl font-bold">Confirming your payment</h1>
        <p className="mt-2 text-sm text-muted-foreground">This takes a few seconds. Please do not close this page.</p>
      </div>
    );
  }

  if (state.phase === "error") {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border bg-card p-8 text-center shadow-sm sm:p-10">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-500/15 text-amber-600 dark:text-amber-300">
          <AlertTriangle className="h-8 w-8" />
        </span>
        <h1 className="mt-5 text-2xl font-bold">We could not confirm your payment</h1>
        <p className="mt-3 text-muted-foreground">{state.message}</p>
        <p className="mt-2 text-sm text-muted-foreground">
          If you were charged, your payment is safe. Check My Bookings in a minute, or try confirming again.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {sessionId && <Button onClick={verify} className="h-11 px-6">Confirm again</Button>}
          <Link href="/dashboard/customer/bookings" className={buttonVariants({ variant: "outline", className: "h-11 px-6" })}>My Bookings</Link>
        </div>
      </div>
    );
  }

  const { payment } = state;
  return (
    <div className="mx-auto max-w-lg rounded-2xl border bg-card p-8 text-center shadow-sm sm:p-10">
      <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-500/15 text-green-600 dark:text-green-300">
        <CheckCircle2 className="h-8 w-8" />
      </span>
      <h1 className="mt-5 text-2xl font-bold">Payment successful</h1>
      <p className="mt-2 text-muted-foreground">Thank you. Your payment for {payment.serviceTitle} was received.</p>

      <dl className="mt-8 space-y-4 rounded-xl bg-muted/60 p-5 text-left text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Amount paid</dt>
          <dd className="font-heading text-lg font-bold">{formatMoney(payment.amount)}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Technician</dt>
          <dd className="font-medium">{payment.technicianName}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Paid on</dt>
          <dd className="font-medium">{formatDateTime(payment.paidAt)}</dd>
        </div>
        <div className="gap-1">
          <dt className="text-muted-foreground">Transaction ID</dt>
          <dd className="mt-1 break-all font-mono text-xs">{payment.transactionId}</dd>
        </div>
      </dl>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/dashboard/customer/bookings" className={buttonVariants({ className: "h-11 px-6" })}>Back to My Bookings</Link>
        <Link href="/dashboard/customer/payments" className={buttonVariants({ variant: "outline", className: "h-11 px-6" })}>Payment History</Link>
      </div>
    </div>
  );
}
