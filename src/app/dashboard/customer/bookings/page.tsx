import type { Metadata } from "next";
import MyBookings from "@/components/bookings/MyBookings";

export const metadata: Metadata = { title: "My Bookings" };

export default function CustomerBookingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Bookings</h1>
        <p className="mt-1 text-muted-foreground">Track every repair request and cancel while it is still pending.</p>
      </div>
      <MyBookings />
    </div>
  );
}
