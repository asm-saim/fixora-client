"use client";

import { m, useReducedMotion } from "framer-motion";
import { EASE, staggerChild, staggerParent, viewportOnce } from "@/lib/motion";

/** Reveal a card as soon as a small part of it is visible. */
const cardInView = { once: true, amount: 0.12 } as const;

export function Stagger({
  children, className, gap = 0.1, delay = 0, perCard = false,
}: { children: React.ReactNode; className?: string; gap?: number; delay?: number; perCard?: boolean }) {
  // Data grids reveal each card on its own. A single container-level trigger
  // hides the whole grid until enough of it is in view, then reveals it all at once.
  if (perCard) {
    return <div className={className}>{children}</div>;
  }

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

export function StaggerItem({
  children, className, index,
}: { children: React.ReactNode; className?: string; index?: number }) {
  const reduce = useReducedMotion();

  // In a per-card grid, each item owns its reveal instead of inheriting a
  // variant from the parent. Keep `initial` identical on server and client;
  // reduced motion only removes the movement from the transition.
  if (index !== undefined) {
    return (
      <m.div
        className={className}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={cardInView}
        transition={{
          duration: reduce ? 0 : 0.45,
          ease: EASE,
          delay: reduce ? 0 : (index % 4) * 0.05,
        }}
      >
        {children}
      </m.div>
    );
  }

  return (
    <m.div className={className} variants={staggerChild}>
      {children}
    </m.div>
  );
}
