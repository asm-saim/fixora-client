import Link from "next/link";
import { ArrowRight, LayoutGrid } from "lucide-react";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import SectionHeading from "@/components/shared/SectionHeading";
import { CATEGORIES } from "@/lib/constants";
import { CATEGORY_ICONS } from "./category-icons";

export default function PopularCategories() {
  return (
    <section className="container-page section-space">
      <SectionHeading
        center
        eyebrow="Categories"
        title="Popular repair categories"
        subtitle="Pick a category to see approved technicians and their services."
      />

      <Stagger className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6" gap={0.06}>
        {CATEGORIES.map((category) => {
          const Icon = CATEGORY_ICONS[category];
          return (
            <StaggerItem key={category} className="h-full">
              <Link
                href={`/services?category=${encodeURIComponent(category)}`}
                className="group flex h-full flex-col items-center rounded-2xl border bg-card p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/60 hover:shadow-xl motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-teal-600 dark:text-teal-300 transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="h-7 w-7" />
                </span>
                <h3 className="mt-4 font-semibold">{category}</h3>
                <span className="mt-1 text-sm text-muted-foreground">View services</span>
              </Link>
            </StaggerItem>
          );
        })}

        <StaggerItem className="h-full">
          <Link
            href="/services"
            className="group flex h-full flex-col items-center justify-center rounded-2xl bg-secondary p-6 text-center text-secondary-foreground shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl motion-reduce:transition-none motion-reduce:hover:translate-y-0"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-primary">
              <LayoutGrid className="h-7 w-7" />
            </span>
            <h3 className="mt-4 font-semibold">All services</h3>
            <span className="mt-1 flex items-center gap-1 text-sm text-primary">
              Browse everything <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </Link>
        </StaggerItem>
      </Stagger>
    </section>
  );
}