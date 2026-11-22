import type { Metadata } from "next";
import AllBookings from "@/components/admin/AllBookings";

export const metadata: Metadata = { title: "All Bookings" };

export default function AdminBookingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">All Bookings</h1>
        <p className="mt-1 text-muted-foreground">Every repair job on the platform. This page is read-only.</p>
      </div>
      <AllBookings />
    </div>
  );
}
