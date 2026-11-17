export const CATEGORIES = [
  "Smartphone",
  "Laptop & PC",
  "AC",
  "Refrigerator",
  "TV",
  "Washing Machine",
  "Electrical",
] as const;

export const SERVICE_MODES = ["Home Visit", "Shop Drop-off"] as const;

export const BOOKING_STATUS = {
  requested:    { label: "Requested",   className: "bg-blue-100 text-blue-700 border-blue-200" },
  accepted:     { label: "Accepted",    className: "bg-indigo-100 text-indigo-700 border-indigo-200" },
  "in-progress":{ label: "In Progress", className: "bg-amber-100 text-amber-700 border-amber-200" },
  completed:    { label: "Completed",   className: "bg-green-100 text-green-700 border-green-200" },
  rejected:     { label: "Rejected",    className: "bg-red-100 text-red-700 border-red-200" },
  cancelled:    { label: "Cancelled",   className: "bg-gray-100 text-gray-600 border-gray-200" },
} as const;

export const PAYMENT_STATUS = {
  unpaid: { label: "Unpaid", className: "bg-orange-100 text-orange-700 border-orange-200" },
  paid:   { label: "Paid",   className: "bg-green-100 text-green-700 border-green-200" },
} as const;

export const APPROVAL_STATUS = {
  pending:  { label: "Pending",  className: "bg-amber-100 text-amber-700 border-amber-200" },
  approved: { label: "Approved", className: "bg-green-100 text-green-700 border-green-200" },
  rejected: { label: "Rejected", className: "bg-red-100 text-red-700 border-red-200" },
} as const;

export type Role = "customer" | "technician" | "admin";