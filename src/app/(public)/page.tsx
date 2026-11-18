import Hero from "@/components/home/Hero";
import QuickCategories from "@/components/home/QuickCategories";
import HowItWorks from "@/components/home/HowItWorks";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import ServiceCard from "@/components/shared/ServiceCard";

export default async function Home() {
  const services = await getFeaturedServices(); // Step 7

  return (
    <>
      <Hero />
      <QuickCategories />

      {/* Featured services: heading reveal, then staggered equal-height cards */}
      <section className="container-page section-space">
        <Reveal>
          <span className="eyebrow">Featured</span>
          <h2 className="section-title mt-3">Latest repair services</h2>
          <p className="section-subtitle">Approved by our team and ready to book.</p>
        </Reveal>

        <Stagger className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" gap={0.08}>
          {services.map((s) => (
            <StaggerItem key={s._id} className="h-full">
              <ServiceCard service={s} />
            </StaggerItem>
          ))}
        </Stagger>
      </section>
      <HowItWorks /> 
    </>
  );
}