import { Wrench } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center" role="status" aria-label="Loading">
      <span className="flex h-14 w-14 animate-spin items-center justify-center rounded-xl bg-primary text-primary-foreground [animation-duration:1.4s] motion-reduce:animate-none">
        <Wrench className="h-7 w-7" />
      </span>
    </div>
  );
}