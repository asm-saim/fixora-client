import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { PackageSearch } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

type Props = {
  title: string;
  description?: string;
  icon?: LucideIcon;
  action?: { label: string; href: string };
};

export default function EmptyState({ title, description, icon: Icon = PackageSearch, action }: Props) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed bg-card px-6 py-16 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/15 text-teal-600 dark:text-teal-300">
        <Icon className="h-8 w-8" />
      </span>
      <h3 className="mt-5 text-lg font-semibold">{title}</h3>
      {description && <p className="mt-2 max-w-md text-sm text-muted-foreground">{description}</p>}
      {action && (
        <Link href={action.href} className={buttonVariants({ className: "mt-6" })}>{action.label}</Link>
      )}
    </div>
  );
}