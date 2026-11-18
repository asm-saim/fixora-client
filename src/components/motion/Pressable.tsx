"use client";

import { m } from "framer-motion";

export function Pressable({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <m.span
      className={`inline-block ${className ?? ""}`}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 26 }}
    >
      {children}
    </m.span>
  );
}