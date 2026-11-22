import type { Metadata } from "next";
import Transactions from "@/components/admin/Transactions";

export const metadata: Metadata = { title: "Transactions" };

export default function AdminTransactionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Transactions</h1>
        <p className="mt-1 text-muted-foreground">Every Stripe payment, with total revenue.</p>
      </div>
      <Transactions />
    </div>
  );
}
