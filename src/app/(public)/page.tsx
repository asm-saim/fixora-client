import Hero from "@/components/home/Hero";
import QuickCategories from "@/components/home/QuickCategories";
import EmptyState from "@/components/shared/EmptyState";
import ServiceCard from "@/components/shared/ServiceCard";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import type { Service } from "@/types";

// TEMP: replaced in Step 7 with a real fetch from the Express API
async function getFeaturedServices(): Promise<Service[]> {
  return [];
}

export default async function Home() {
  const services = await getFeaturedServices();

  return (
    <>
      <Hero />
      <QuickCategories />

      <section className="container-page section-space">
        <Reveal>
          <span className="eyebrow">Featured</span>
          <h2 className="section-title mt-3">Latest repair services</h2>
          <p className="section-subtitle">Approved by our team and ready to book.</p>
        </Reveal>

        <div className="mt-10">
          {services.length === 0 ? (
            <EmptyState
              title="No services yet"
              description="Approved services will appear here as soon as technicians publish them."
              action={{ label: "Browse Services", href: "/services" }}
            />
          ) : (
            <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" gap={0.08}>
              {services.map((s) => (
                <StaggerItem key={s._id} className="h-full">
                  <ServiceCard service={s} />
                </StaggerItem>
              ))}
            </Stagger>
          )}
        </div>
      </section>
    </>
  );
}