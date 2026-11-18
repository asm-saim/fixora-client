import Link from "next/link";
import { Home } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import Logo from "@/components/shared/Logo";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="container-page flex h-16 items-center"><Logo /></div>

      <div className="container-page flex flex-1 flex-col items-center justify-center pb-16 text-center">
        <svg viewBox="0 0 240 200" className="h-52 w-52" fill="none" aria-hidden="true">
          <circle cx="120" cy="100" r="88" className="fill-primary/15" />
          {/* cracked phone */}
          <rect x="80" y="36" width="80" height="128" rx="13" className="fill-secondary" />
          <rect x="89" y="51" width="62" height="94" rx="4" className="fill-card" />
          <path d="M104 51 L119 82 L108 98 L128 123 L117 145" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="120" cy="154" r="4" className="fill-primary" />
          {/* wrench */}
          <g transform="rotate(35 178 138)">
            <rect x="173" y="104" width="10" height="66" rx="5" className="fill-primary" />
            <circle cx="178" cy="100" r="15" className="fill-primary" />
            <rect x="174" y="80" width="8" height="17" className="fill-background" />
          </g>
        </svg>

        <p className="mt-4 font-heading text-6xl font-bold text-primary">404</p>
        <h1 className="mt-2 text-2xl font-bold md:text-3xl">This page needs repair</h1>
        <p className="mt-3 max-w-md text-muted-foreground">
          The page you are looking for does not exist, was moved, or is not available right now.
        </p>
        <Link href="/" className={buttonVariants({ className: "mt-8 h-11 px-6" })}>
          <Home className="mr-2 h-4 w-4" /> Back to Home
        </Link>
      </div>
    </div>
  );
}