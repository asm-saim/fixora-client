"use client";

import { m } from "framer-motion";
import { fadeUp, viewportOnce } from "@/lib/motion";

type Props = { children: React.ReactNode; delay?: number; className?: string };

export function Reveal({ children, delay = 0, className }: Props) {
  return (
    <m.div
      className={className}
      variants={fadeUp}
      custom={delay}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
    >
      {children}
    </m.div>
  );
}