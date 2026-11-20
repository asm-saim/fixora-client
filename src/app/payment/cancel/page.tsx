import type { Metadata } from "next";
import Link from "next/link";
import { RotateCcw, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Payment Cancelled" };

export default function PaymentCancelPage() {
  return (
    <div className="container-page py-16 md:py-24">
      <div className="mx-auto max-w-lg rounded-2xl border bg-card p-8 text-center shadow-sm sm:p-10">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-600">
          <XCircle className="h-8 w-8" />
        </span>
        <h1 className="mt-5 text-2xl font-bold">Payment cancelled</h1>
        <p className="mt-3 text-muted-foreground">
          No money was taken and your booking has not changed. You can pay whenever you are ready.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild className="h-11 px-6">
            <Link href="/dashboard/customer/bookings"><RotateCcw className="mr-2 h-4 w-4" /> Try Again</Link>
          </Button>
          <Button asChild variant="outline" className="h-11 px-6"><Link href="/">Back to Home</Link></Button>
        </div>
      </div>
    </div>
  );
}
