import { Badge } from "@/components/ui/badge";
import type { Role } from "@/lib/constants";
import { ROLE_LABEL } from "@/lib/roles";
import { cn } from "@/lib/utils";

const STYLE: Record<Role, string> = {
  customer: "bg-teal-100 dark:bg-teal-500/15 text-teal-800 dark:text-teal-300 border-teal-200 dark:border-teal-500/30",
  technician: "bg-indigo-100 dark:bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-500/30",
  admin: "bg-amber-100 dark:bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-500/30",
};

export default function RoleBadge({ role, className }: { role: Role; className?: string }) {
  return <Badge variant="outline" className={cn("font-medium", STYLE[role], className)}>{ROLE_LABEL[role]}</Badge>;
}