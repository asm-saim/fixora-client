import type { Metadata } from "next";
import PaymentResult from "@/components/payments/PaymentResult";

export const metadata: Metadata = { title: "Payment Successful" };

type Props = { searchParams: Promise<{ session_id?: string | string[] }> };

export default async function PaymentSuccessPage({ searchParams }: Props) {
  const { session_id } = await searchParams;
  const sessionId = Array.isArray(session_id) ? session_id[0] : session_id;

  return (
    <div className="container-page py-16 md:py-24">
      <PaymentResult sessionId={sessionId ?? null} />
    </div>
  );
}
