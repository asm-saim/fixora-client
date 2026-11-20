import Image from "next/image";
import Link from "next/link";

export default function Logo({ light = false, compact = false }: { light?: boolean; compact?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2" aria-label="Fixora home">
      <Image
        src="/images/logo.png"
        alt=""
        width={36}
        height={36}
        className="h-9 w-9 shrink-0 object-contain"
      />
      {!compact && (
        <span className={`font-heading text-xl font-bold ${light ? "text-white" : "text-foreground"}`}>
          Fix<span className="text-primary">ora</span>
        </span>
      )}
    </Link>
  );
}
