"use client";

import { m } from "framer-motion";
import { Search, Send, Wrench, CreditCard } from "lucide-react";
import { EASE, viewportOnce } from "@/lib/motion";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";

const STEPS = [
  {
    icon: Search,
    title: "Find a Service",
    text: "Browse approved repair services and compare technicians, prices and areas.",
  },
  {
    icon: Send,
    title: "Send a Request",
    text: "Describe the problem, add your address and pick a date that suits you.",
  },
  {
    icon: Wrench,
    title: "Technician Fixes It",
    text: "Track every stage live: accepted, in progress, then completed.",
  },
  {
    icon: CreditCard,
    title: "Pay After Completion",
    text: "Pay securely with Stripe only once the job is done and the amount is final.",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-muted/60 section-space">
      <div className="container-page">
        {/* Heading reveal */}
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">How it works</span>
          <h2 className="section-title mt-3">Fixed in four simple steps</h2>
          <p className="section-subtitle mx-auto">
            No upfront payment, no guessing. You always know where your repair stands.
          </p>
        </Reveal>

        <div className="relative mt-14">
          {/* Connecting line: draws left to right (desktop only) */}
          <m.div
            aria-hidden
            className="absolute left-[12.5%] right-[12.5%] top-7 hidden h-px origin-left bg-primary/50 lg:block"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={viewportOnce}
            transition={{ duration: 1.4, ease: EASE }}
          />

          {/* Steps: appear one by one, slightly after the line starts */}
          <Stagger className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4" gap={0.15} delay={0.2}>
            {STEPS.map(({ icon: Icon, title, text }, i) => (
              <StaggerItem key={title} className="h-full">
                <div className="flex h-full flex-col items-center text-center">
                  {/* Icon circle sits above the line (relative z-10 + solid bg) */}
                  <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full border-4 border-background bg-primary text-primary-foreground shadow-md">
                    <Icon className="h-6 w-6" />
                    <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-secondary text-xs font-bold text-secondary-foreground">
                      {i + 1}
                    </span>
                  </div>
                  <h3 className="mt-5 text-lg font-semibold">{title}</h3>
                  <p className="mt-2 max-w-xs text-sm text-muted-foreground">{text}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}