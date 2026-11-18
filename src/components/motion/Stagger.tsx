"use client";

import { m } from "framer-motion";
import { staggerChild, staggerParent, viewportOnce } from "@/lib/motion";

export function Stagger({
  children, className, gap = 0.1, delay = 0,
}: { children: React.ReactNode; className?: string; gap?: number; delay?: number }) {
  return (
    <m.div
      className={className}
      variants={staggerParent(gap, delay)}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
    >
      {children}
    </m.div>
  );
}

export function StaggerItem({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <m.div className={className} variants={staggerChild}>
      {children}
    </m.div>
  );
}