import type { Variants } from "framer-motion";

/** Soft ease-out: quick start, long gentle landing (premium feel) */
export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** Trigger once, slightly before the element is fully in view */
export const viewportOnce = { once: true, amount: 0.2, margin: "0px 0px -60px 0px" } as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE, delay },
  }),
};

export const staggerParent = (gap = 0.1, delay = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: gap, delayChildren: delay } },
});

export const staggerChild: Variants = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
};