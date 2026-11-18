import Link from "next/link";
import { AirVent, ArrowUpRight, Laptop, LifeBuoy, Smartphone } from "lucide-react";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";

const ITEMS = [
  { no: "01", category: "Smartphone", icon: Smartphone, text: "Screen, battery, charging port, water damage." },
  { no: "02", category: "Laptop & PC", icon: Laptop, text: "Keyboard, RAM and SSD upgrades, OS and virus fixes." },
  { no: "03", category: "AC", icon: AirVent, text: "Servicing, gas refill, installation and leak repair." },
];

export default function QuickCategories() {
  return (
    <section className="container-page relative z-10 -mt-28">
      <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4" gap={0.12}>
        {ITEMS.map(({ no, category, icon: Icon, text }) => (
          <StaggerItem key={category} className="h-full">
            <Link
              href={`/services?category=${encodeURIComponent(category)}`}
              className="group relative flex h-full flex-col rounded-2xl border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/60 hover:shadow-xl motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              <span className="absolute right-5 top-4 font-heading text-5xl font-bold text-muted-foreground/15">{no}</span>
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-teal-600 transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon className="h-6 w-6" />
              </span>
              <h3 className="mt-5 text-lg font-semibold">{category} Repair</h3>
              <p className="mt-2 text-sm text-muted-foreground">{text}</p>
              <span className="mt-auto flex items-center gap-1 pt-5 text-sm font-semibold text-teal-600">
                Browse services
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </span>
            </Link>
          </StaggerItem>
        ))}

        <StaggerItem className="h-full">
          <div className="flex h-full flex-col rounded-2xl bg-secondary p-6 text-secondary-foreground shadow-sm">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-primary">
              <LifeBuoy className="h-6 w-6" />
            </span>
            <h3 className="mt-5 text-lg font-semibold">Need help choosing?</h3>
            <p className="mt-2 text-sm text-slate-300">Mon to Sat, 8:00 to 18:00<br />support@fixora.com</p>
            <Link href="/about" className="mt-auto pt-5 text-sm font-semibold text-primary hover:underline">
              See how it works
            </Link>
          </div>
        </StaggerItem>
      </Stagger>
    </section>
  );
}