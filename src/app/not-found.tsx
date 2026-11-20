import Link from "next/link";
import { Home } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import Logo from "@/components/shared/Logo";
import NotFoundArt from "@/components/shared/NotFoundArt";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="container-page flex h-16 items-center">
        <Logo />
      </div>

      <div className="container-page flex flex-1 flex-col items-center justify-center pb-16 text-center">
        <NotFoundArt></NotFoundArt>
        <p className="mt-4 font-heading text-6xl font-bold text-primary">404</p>
        <h1 className="mt-2 text-2xl font-bold md:text-3xl">
          This page needs repair
        </h1>
        <p className="mt-3 max-w-md text-muted-foreground">
          The page you are looking for does not exist, was moved, or is not
          available right now.
        </p>
        <Link
          href="/"
          className={buttonVariants({ className: "mt-8 h-11 px-6" })}
        >
          <Home className="mr-2 h-4 w-4" /> Back to Home
        </Link>
      </div>
    </div>
  );
}
