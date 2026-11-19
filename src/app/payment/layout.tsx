import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { requireRole } from "@/lib/session";

export default async function PaymentLayout({ children }: { children: React.ReactNode }) {
  await requireRole("customer");
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}