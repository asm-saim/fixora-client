import { Badge } from "@/components/ui/badge";
import type { Role } from "@/lib/constants";
import { ROLE_LABEL } from "@/lib/roles";
import { cn } from "@/lib/utils";

const STYLE: Record<Role, string> = {
  customer: "bg-teal-100 text-teal-800 border-teal-200",
  technician: "bg-indigo-100 text-indigo-700 border-indigo-200",
  admin: "bg-amber-100 text-amber-800 border-amber-200",
};

export default function RoleBadge({ role, className }: { role: Role; className?: string }) {
  return <Badge variant="outline" className={cn("font-medium", STYLE[role], className)}>{ROLE_LABEL[role]}</Badge>;
}