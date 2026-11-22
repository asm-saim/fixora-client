import { Activity, BadgeDollarSign, CreditCard, ShieldCheck } from "lucide-react";
import { Counter } from "@/components/motion/Counter";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import SectionHeading from "@/components/shared/SectionHeading";

const POINTS = [
  { icon: ShieldCheck, title: "Reviewed listings", text: "Every service is checked and approved by our admin team before it appears." },
  { icon: Activity, title: "Live job tracking", text: "See each stage of your repair, from request to completion." },
  { icon: CreditCard, title: "Pay after service", text: "Nothing is charged until the technician marks the job completed." },
  { icon: BadgeDollarSign, title: "Clear pricing", text: "Starting prices up front, with the final amount confirmed when the work is done." },
];

export default function WhyChooseUs() {
  return (
    <section className="container-page section-space">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <SectionHeading
            eyebrow="Why Fixora"
            title="Repairs you can trust and track"
            subtitle="We built Fixora so customers stay informed and technicians get a proper place to work."
          />
          <Stagger className="mt-8 space-y-6" gap={0.1}>
            {POINTS.map(({ icon: Icon, title, text }) => (
              <StaggerItem key={title}>
                <div className="flex gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-teal-600 dark:text-teal-300">
                    <Icon className="h-6 w-6" />
                  </span>
                  <div>
                    <h3 className="font-semibold">{title}</h3>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">{text}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>

        <Reveal delay={0.15}>
          <div className="relative overflow-hidden rounded-3xl bg-secondary p-8 text-white shadow-xl sm:p-10">
            <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-primary/20 blur-3xl" />
            <p className="relative text-sm font-semibold uppercase tracking-wider text-primary">Fixora in numbers</p>
            <div className="relative mt-8 grid grid-cols-2 gap-8">
              {[
                { value: <Counter to={250} suffix="+" />, label: "Verified technicians" },
                { value: <Counter to={1800} suffix="+" />, label: "Jobs completed" },
                { value: "4.8/5", label: "Average rating" },
                { value: <Counter to={100} suffix="%" />, label: "Pay after service" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="font-heading text-4xl font-bold text-primary">{stat.value}</p>
                  <p className="mt-1 text-sm text-slate-300">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}