import type { Role } from "@/lib/constants";
import type { BookingStatus } from "@/types";

export type StatusCounts = Record<BookingStatus, number>;
export type MonthlyPoint = { month: string; amount: number };

/** Added to every paginated admin response. */
export type Paged = { total: number; page: number; limit: number; totalPages: number };

export type CustomerStats = {
  stats: { totalRequests: number; activeJobs: number; completedJobs: number; awaitingPayment: number; totalPaid: number };
  byStatus: StatusCounts;
  monthly: MonthlyPoint[];
};

export type TechnicianStats = {
  stats: { totalServices: number; approvedServices: number; pendingRequests: number; activeJobs: number; completedJobs: number; earnings: number };
  byStatus: StatusCounts;
  monthly: MonthlyPoint[];
};

export type AdminStats = {
  stats: { totalUsers: number; totalTechnicians: number; pendingServices: number; totalBookings: number; totalRevenue: number };
  usersByRole: Record<Role, number>;
  byStatus: StatusCounts;
  monthly: MonthlyPoint[];
};
