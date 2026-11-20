import Link from "next/link";
import Hero from "@/components/home/Hero";
import QuickCategories from "@/components/home/QuickCategories";
import HowItWorks from "@/components/home/HowItWorks";
import PopularCategories from "@/components/home/PopularCategories";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import Testimonials from "@/components/home/Testimonials";
import CtaBanner from "@/components/home/CtaBanner";
import EmptyState from "@/components/shared/EmptyState";
import SectionHeading from "@/components/shared/SectionHeading";
import ServiceCard from "@/components/shared/ServiceCard";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { Button } from "@/components/ui/button";
import { EMPTY_FILTERS, getServices } from "@/lib/services";
import type { Service } from "@/types";

// 6 latest approved + available services
async function getFeaturedServices(): Promise<Service[]> {
  try {
    const data = await getServices(EMPTY_FILTERS, 6);
    return data.services;
  } catch {
    return [];
  }
}

export default async function Home() {
  const services = await getFeaturedServices();

  return (
    <>
      <Hero />
      <QuickCategories />

      <section className="container-page section-space">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            eyebrow="Featured"
            title="Latest repair services"
            subtitle="Approved by our team and ready to book."
          />
          <Button render={<Link href="/services" />} nativeButton={false} variant="outline">View all services</Button>
        </div>

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

      <HowItWorks />
      <PopularCategories />
      <WhyChooseUs />
      <Testimonials />
      <CtaBanner />
    </>
  );
}