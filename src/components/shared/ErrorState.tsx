"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed bg-card px-6 py-12 text-center" role="alert">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100 dark:bg-red-500/15 text-red-600 dark:text-red-300">
        <AlertTriangle className="h-7 w-7" />
      </span>
      <h3 className="mt-4 text-lg font-semibold">We could not load this</h3>
      <p className="mt-1 max-w-md text-sm text-muted-foreground">{message}</p>
      {onRetry && (
        <Button variant="outline" className="mt-5" onClick={onRetry}>
          <RotateCcw className="mr-2 h-4 w-4" /> Try again
        </Button>
      )}
    </div>
  );
}
