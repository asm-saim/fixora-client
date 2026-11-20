import { Star } from "lucide-react";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import SectionHeading from "@/components/shared/SectionHeading";
import { initials } from "@/lib/utils";

const ITEMS = [
  {
    quote: "My laptop hinge broke on a Friday. The technician accepted within the hour, I could follow every step, and I paid only after it was fixed.",
    name: "Nusrat Jahan",
    role: "Customer, Mirpur, Dhaka",
  },
  {
    quote: "Fixora gives me a proper place to list my services. Requests arrive with the address and the problem already written down.",
    name: "Rafiq Ahmed",
    role: "AC Technician, Uttara, Dhaka",
  },
  {
    quote: "Knowing the starting price first and paying afterwards made me comfortable handing over my phone for a screen replacement.",
    name: "Tanvir Hasan",
    role: "Customer, Dhanmondi, Dhaka",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-muted/60 section-space">
      <div className="container-page">
        <SectionHeading center eyebrow="Testimonials" title="What people say about Fixora" />

        <Stagger className="mt-12 grid gap-6 md:grid-cols-3" gap={0.12}>
          {ITEMS.map((t) => (
            <StaggerItem key={t.name} className="h-full">
              <figure className="flex h-full flex-col rounded-2xl border bg-card p-6 shadow-sm">
                <div className="flex gap-1 text-amber-500" aria-label="5 out of 5 stars">
                  {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                </div>
                <blockquote className="mt-4 text-sm leading-7 text-muted-foreground">&ldquo;{t.quote}&rdquo;</blockquote>
                <figcaption className="mt-auto flex items-center gap-3 pt-6">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-white">
                    {initials(t.name)}
                  </span>
                  <span>
                    <span className="block text-sm font-semibold">{t.name}</span>
                    <span className="block text-xs text-muted-foreground">{t.role}</span>
                  </span>
                </figcaption>
              </figure>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}