"use client";

import { m } from "framer-motion";
import { staggerChild, staggerParent, viewportOnce } from "@/lib/motion";

export function Stagger({
  children, className, gap = 0.1, delay = 0, immediate = false,
}: { children: React.ReactNode; className?: string; gap?: number; delay?: number; immediate?: boolean }) {
  const variants = staggerParent(gap, delay);

  // Data grids must be visible as soon as the HTML arrives. Waiting for an
  // in-view trigger hides the whole grid until the user scrolls, and the
  // threshold is measured against the entire grid (not the visible cards).
  if (immediate) {
    return (
      <m.div className={className} variants={variants} initial={false} animate="show">
        {children}
      </m.div>
    );
  }

  return (
    <m.div
      className={className}
      variants={variants}
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