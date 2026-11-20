import Link from "next/link";
import { Button } from "@/components/ui/button";
import NotFoundArt from "@/components/shared/NotFoundArt";

export default function ServiceNotFound() {
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <NotFoundArt className="h-44 w-44" />
      <h1 className="mt-4 text-2xl font-bold md:text-3xl">This service isn&apos;t available</h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        It may not exist, may be waiting for approval, or has been switched off by the technician.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button render={<Link href="/services" />} nativeButton={false} className="h-11 px-6">Browse Services</Button>
        <Button render={<Link href="/" />} nativeButton={false} variant="outline" className="h-11 px-6">Back to Home</Button>
      </div>
    </div>
  );
}