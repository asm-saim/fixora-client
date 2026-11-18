import Link from "next/link";
import { Wrench } from "lucide-react";

export default function Logo({ light = false, compact = false }: { light?: boolean; compact?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2" aria-label="Fixora home">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <Wrench className="h-5 w-5" />
      </span>
      {!compact && (
        <span className={`font-heading text-xl font-bold ${light ? "text-white" : "text-foreground"}`}>
          Fix<span className="text-primary">ora</span>
        </span>
      )}
    </Link>
  );
}