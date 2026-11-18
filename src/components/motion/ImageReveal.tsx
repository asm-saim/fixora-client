"use client";

import { m } from "framer-motion";
import { EASE, viewportOnce } from "@/lib/motion";

export function ImageReveal({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <m.div
      className={`overflow-hidden ${className ?? ""}`}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={viewportOnce}
      transition={{ duration: 0.8, ease: EASE }}
    >
      <m.div
        className="h-full w-full"
        initial={{ scale: 1.12 }}
        whileInView={{ scale: 1 }}
        viewport={viewportOnce}
        transition={{ duration: 1.3, ease: EASE }}
      >
        {children}
      </m.div>
    </m.div>
  );
}