"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { m, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Activity, BadgeCheck, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";

import { EASE } from "@/lib/motion";
import HeroSearch from "./HeroSearch";
import { Pressable } from "../motion/Pressable";

const HEADLINE = [
  { text: "Broken Device?", accent: false },
  { text: "Get It Fixed by", accent: false },
  { text: "Verified Technicians", accent: true },
];

const TRUST = [
  { icon: BadgeCheck, label: "Verified technicians" },
  { icon: CreditCard, label: "Pay after the job" },
  { icon: Activity, label: "Live job tracking" },
];

const up = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: EASE, delay },
});

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  // Gentle parallax on the background photo
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "16%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.05, 1.14]);

  let wordIndex = 0;

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-secondary pb-40 pt-20 text-white md:pb-44 md:pt-28"
    >
      {/* Background photo + overlay */}
      <m.div
        className="absolute inset-0"
        style={reduce ? undefined : { y, scale }}
      >
        <Image
          src="/images/hero-repair.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </m.div>
      <div className="absolute inset-0 bg-gradient-to-r from-[#0B1F3A] via-[#0B1F3A]/90 to-[#0B1F3A]/55" />
      <div className="pointer-events-none absolute -left-24 top-1/3 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />

      <div className="container-page relative grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
        {/* Left: copy */}
        <div>
          <m.span className="eyebrow" {...up(0)}>
            <BadgeCheck className="h-3.5 w-3.5" /> Five-star repair service
          </m.span>

          <h1 className="mt-5 text-4xl font-bold leading-[1.1] sm:text-5xl lg:text-6xl">
            {HEADLINE.map((line) => (
              <span key={line.text} className="block">
                {line.text.split(" ").map((word) => {
                  const i = wordIndex++;
                  return (
                    <span
                      key={i}
                      className="mr-[0.25em] inline-block overflow-hidden pb-[0.12em] align-bottom"
                    >
                      <m.span
                        className={`inline-block ${line.accent ? "text-primary" : ""}`}
                        initial={{ y: "110%" }}
                        animate={{ y: "0%" }}
                        transition={{
                          duration: 0.8,
                          ease: EASE,
                          delay: 0.2 + i * 0.07,
                        }}
                      >
                        {word}
                      </m.span>
                    </span>
                  );
                })}
              </span>
            ))}
          </h1>

          <m.p
            className="mt-6 max-w-xl text-base text-slate-300 md:text-lg"
            {...up(0.7)}
          >
            Book trusted technicians for phones, laptops and home appliances.
            Follow every repair step, and pay only when the job is done.
          </m.p>

          <m.div
            className="mt-8 flex flex-wrap items-center gap-4"
            {...up(0.85)}
          >
            <Pressable>
              <Button
                render={<Link href="/services" />}
                className="group h-11 px-6"
              >
                Browse Services
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </Pressable>
            <Pressable>
              <Button
                render={<Link href="/about" />}
                variant="outline"
                className="h-11 border-white/30 bg-transparent px-6 text-white hover:bg-white/10 hover:text-white"
              >
                How It Works
              </Button>
            </Pressable>
          </m.div>

          <m.ul
            className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-slate-300"
            {...up(1)}
          >
            {TRUST.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-primary" /> {label}
              </li>
            ))}
          </m.ul>
        </div>

        {/* Right: search card */}
        <m.div
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.6 }}
        >
          <HeroSearch />
        </m.div>
      </div>
    </section>
  );
}
