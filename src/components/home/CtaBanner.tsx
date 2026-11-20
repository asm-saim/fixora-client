"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Pressable } from "@/components/motion/Pressable";
import { Reveal } from "@/components/motion/Reveal";
import { useCurrentUser } from "@/hooks/use-current-user";
import { dashboardPath } from "@/lib/roles";

export default function CtaBanner() {
  const { user } = useCurrentUser();

  return (
    <section className="container-page pb-16 md:pb-24">
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl bg-secondary px-6 py-12 text-center text-white sm:px-12 md:py-16">
          <div className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -right-10 h-64 w-64 rounded-full bg-accent/20 blur-3xl" />
          <h2 className="relative font-heading text-3xl font-bold md:text-4xl">Are you a repair technician?</h2>
          <p className="relative mx-auto mt-3 max-w-xl text-slate-300">
            List your services on Fixora, receive organised repair requests, and get paid when the job is done.
          </p>
          <div className="relative mt-8 flex flex-wrap justify-center gap-4">
            <Pressable>
              <Button
                render={<Link href={user ? dashboardPath(user.role) : "/sign-up"} />}
                nativeButton={false}
                className="h-11 px-6"
              >
                {user ? "Go to Dashboard" : "Join as a Technician"}
              </Button>
            </Pressable>
            <Pressable>
              <Button
                render={<Link href="/services" />}
                nativeButton={false}
                variant="outline"
                className="h-11 border-white/30 bg-transparent px-6 text-white hover:bg-white/10 hover:text-white"
              >
                Browse Services
              </Button>
            </Pressable>
          </div>
        </div>
      </Reveal>
    </section>
  );
}