import type { Role } from "./constants";

export const dashboardPath = (role?: Role | null) =>
  role === "admin" ? "/dashboard/admin"
  : role === "technician" ? "/dashboard/technician"
  : "/dashboard/customer";

export const ROLE_LABEL: Record<Role, string> = {
  customer: "Customer",
  technician: "Technician",
  admin: "Admin",
};