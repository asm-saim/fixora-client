import type { Metadata } from "next";
import { Check, ShieldCheck, Users, Wrench } from "lucide-react";
import JobTrackerMock from "@/components/about/JobTrackerMock";
import CtaBanner from "@/components/home/CtaBanner";
import HowItWorks from "@/components/home/HowItWorks";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import PageHeader from "@/components/shared/PageHeader";
import SectionHeading from "@/components/shared/SectionHeading";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "How It Works & About",
  description: "How Fixora connects customers with repair technicians, tracks every job and takes payment after the work is done.",
};

const ROLES = [
  {
    icon: Users,
    title: "Customers",
    points: ["Browse and compare approved services", "Send a repair request in minutes", "Cancel while a request is still pending", "Pay online only after completion"],
  },
  {
    icon: Wrench,
    title: "Technicians",
    points: ["List the repair services you offer", "Accept or reject incoming requests", "Move each job through its stages", "Set the final amount when the work is done"],
  },
  {
    icon: ShieldCheck,
    title: "Admins",
    points: ["Approve or reject service listings", "Manage users and their roles", "Monitor every booking on the platform", "Track all payments and revenue"],
  },
];

const FAQS = [
  { q: "When do I pay?", a: "Only after the technician marks your job as Completed. A Pay Now button then appears in My Bookings, and you pay securely through Stripe Checkout." },
  { q: "Can I cancel a request?", a: "Yes, while its status is still Requested. Once a technician accepts the job, it can no longer be cancelled from the app." },
  { q: "Who decides the final price?", a: "Each service shows a starting price. When the job is finished, the technician sets the final amount, and that is what you pay." },
  { q: "How are services reviewed?", a: "Every listing is reviewed by an admin before it appears. If a technician edits a service later, it goes back for review." },
  { q: "What if a technician rejects my request?", a: "You will see it marked Rejected in My Bookings, and you can send a new request for a similar service from another technician." },
  { q: "Is my card information safe?", a: "Payments are handled by Stripe Checkout, so your card details never touch Fixora's servers." },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        crumb="How It Works"
        title="About Fixora"
        subtitle="A repair platform where every job is trackable and payment happens only after the work is delivered."
      />

      {/* Story */}
      <section className="container-page section-space">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Our story"
              title="Why we built Fixora"
              subtitle="Finding a trustworthy repair technician is hard, and handing over a device means waiting in the dark."
            />
            <Reveal delay={0.1}>
              <p className="mt-6 leading-7 text-muted-foreground">
                Customers often pay before any work is done and have no idea what is happening with their device. Skilled technicians,
                meanwhile, have no structured place to show their services or manage incoming jobs. Fixora fixes both sides.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  "Every job has a clear status you can follow",
                  "Customers pay after the work, not before",
                  "Technicians get an organised list of requests",
                ].map((t) => (
                  <li key={t} className="flex gap-3 text-sm font-medium">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Check className="h-3 w-3" />
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <Reveal delay={0.15}><JobTrackerMock /></Reveal>
        </div>
      </section>

      <HowItWorks />

      {/* Roles */}
      <section className="container-page section-space">
        <SectionHeading center eyebrow="Built for everyone" title="Three roles, one clear flow" />
        <Stagger className="mt-12 grid gap-6 md:grid-cols-3" gap={0.12}>
          {ROLES.map(({ icon: Icon, title, points }) => (
            <StaggerItem key={title} className="h-full">
              <div className="flex h-full flex-col rounded-2xl border bg-card p-6 shadow-sm">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-teal-600">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 text-lg font-semibold">{title}</h3>
                <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
                  {points.map((p) => (
                    <li key={p} className="flex gap-2.5"><Check className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" />{p}</li>
                  ))}
                </ul>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* FAQ */}
      <section className="bg-muted/60 section-space">
        <div className="container-page max-w-3xl">
          <SectionHeading center eyebrow="FAQ" title="Questions people ask" />
          <Reveal delay={0.1}>
            <Accordion className="mt-10 rounded-2xl border bg-card px-6">
              {FAQS.map((f, i) => (
                <AccordionItem key={f.q} value={`item-${i}`}>
                  <AccordionTrigger className="text-left text-base font-semibold">{f.q}</AccordionTrigger>
                  <AccordionContent className="leading-7 text-muted-foreground">{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </div>
      </section>

      <div className="pt-16 md:pt-24"><CtaBanner /></div>
    </>
  );
}