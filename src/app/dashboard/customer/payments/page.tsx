import type { Metadata } from "next";
import PaymentHistory from "@/components/payments/PaymentHistory";

export const metadata: Metadata = { title: "Payment History" };

export default function CustomerPaymentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Payment History</h1>
        <p className="mt-1 text-muted-foreground">Every payment you have made, with its Stripe transaction ID.</p>
      </div>
      <PaymentHistory />
    </div>
  );
}
