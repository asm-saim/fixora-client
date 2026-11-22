
import type { Role } from "@/lib/constants";

export type AppUser = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role: Role;
  phone?: string;
  area?: string;
  bio?: string;
};

export type Service = {
  _id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  basePrice: number;
  estimatedDuration: string;
  serviceMode: "Home Visit" | "Shop Drop-off";
  serviceArea: string;
  technicianName: string;
  technicianEmail?: string;
  approvalStatus: "pending" | "approved" | "rejected";
  isAvailable: boolean;
  createdAt: string;
  /** 0 and 0 when nobody has reviewed the service yet */
  ratingAverage?: number;
  ratingCount?: number;
};

/** A public review: the customer name is already shortened by the server ("Sarah K."). */
export type ServiceReview = {
  _id: string;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: string;
};

export type ServiceDetail = Service & {
  technician: {
    name: string;
    image: string | null;
    area: string;
    bio: string;
  };
  reviews?: ServiceReview[];
};

export type ServicesResponse = {
  services: Service[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type BookingStatus =
  | "requested"
  | "accepted"
  | "rejected"
  | "in-progress"
  | "completed"
  | "cancelled";

/** One step of a job, written by the server every time the status changes. "paid" is added after Stripe confirms. */
export type StatusHistoryEntry = {
  status: BookingStatus | "paid";
  changedAt: string;
};

export type BookingReview = {
  rating: number;
  comment: string;
  createdAt: string;
};

export type Booking = {
  _id: string;
  serviceId: string;
  serviceTitle: string;
  serviceImage: string;
  category: string;
  basePrice: number;
  technicianName: string;
  technicianEmail: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  preferredDate: string;
  problemDescription: string;
  status: BookingStatus;
  finalAmount: number;
  paymentStatus: "unpaid" | "paid";
  createdAt: string;
  statusHistory?: StatusHistoryEntry[];
  review?: BookingReview;
};

export type Payment = {
  _id: string;
  bookingId: string;
  serviceTitle: string;
  customerName: string;
  customerEmail: string;
  technicianName: string;
  technicianEmail: string;
  amount: number;
  currency: string;
  transactionId: string;
  stripeSessionId: string;
  paymentStatus: "paid";
  paidAt: string;
};
