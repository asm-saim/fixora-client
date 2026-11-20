"use client";

import { m } from "framer-motion";
import { CreditCard, Search, Send, Wrench } from "lucide-react";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import SectionHeading from "@/components/shared/SectionHeading";
import { EASE, viewportOnce } from "@/lib/motion";

const STEPS = [
  { icon: Search, title: "Find a Service", text: "Browse approved services, filter by category and compare starting prices." },
  { icon: Send, title: "Send a Request", text: "Share your phone, address, preferred date and what is wrong with the device." },
  { icon: Wrench, title: "Technician Fixes It", text: "Follow the job from Accepted to In Progress to Completed." },
  { icon: CreditCard, title: "Pay After Completion", text: "Pay securely online only once the work is done." },
];

export default function HowItWorks() {
  return (
    <section className="bg-muted/60 section-space">
      <div className="container-page">
        <SectionHeading
          center
          eyebrow="How it works"
          title="Repairs in four simple steps"
          subtitle="No guesswork and no paying upfront. You always know where your device is."
        />

        <div className="relative mt-14">
          {/* connecting line (desktop), drawn on scroll */}
          <m.div
            className="absolute left-[12.5%] right-[12.5%] top-7 hidden h-0.5 origin-left bg-gradient-to-r from-primary/30 via-primary to-primary/30 lg:block"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={viewportOnce}
            transition={{ duration: 1.4, ease: EASE }}
          />

          <Stagger className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4" gap={0.15} delay={0.2}>
            {STEPS.map(({ icon: Icon, title, text }, i) => (
              <StaggerItem key={title} className="h-full">
                <div className="flex h-full flex-col items-center text-center">
                  <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary text-primary shadow-lg ring-8 ring-muted">
                    <Icon className="h-6 w-6" />
                    <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground">
                      {i + 1}
                    </span>
                  </div>
                  <h3 className="mt-6 text-lg font-semibold">{title}</h3>
                  <p className="mt-2 max-w-[16rem] text-sm leading-6 text-muted-foreground">{text}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}