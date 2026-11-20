import type { Metadata } from "next";
import { Suspense } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { ServiceGridSkeleton } from "@/components/shared/Skeletons";
import ServiceFilters from "@/components/services/ServiceFilters";
import ServiceResults from "@/components/services/ServiceResults";
import { CATEGORIES, SERVICE_MODES, SORT_OPTIONS } from "@/lib/constants";
import type { ServiceFilterValues } from "@/lib/services";

export const metadata: Metadata = {
  title: "Browse Repair Services",
  description: "Search verified technicians for phone, laptop, AC, TV and appliance repairs.",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;
const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export default async function ServicesPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;

  const sort = first(sp.sort) ?? "newest";
  const filters: ServiceFilterValues = {
    search: (first(sp.search) ?? "").trim().slice(0, 60),
    category: (CATEGORIES as readonly string[]).includes(first(sp.category) ?? "") ? first(sp.category)! : "",
    serviceMode: (SERVICE_MODES as readonly string[]).includes(first(sp.serviceMode) ?? "") ? first(sp.serviceMode)! : "",
    sort: SORT_OPTIONS.some((o) => o.value === sort) ? sort : "newest",
    page: Math.max(1, Math.floor(Number(first(sp.page))) || 1),
  };

  return (
    <section className="container-page section-space">
      <Reveal>
        <span className="eyebrow">Services</span>
        <h1 className="section-title mt-3">Browse repair services</h1>
        <p className="section-subtitle">Find the right technician, send a request, and pay only when the job is done.</p>
      </Reveal>

      <div className="mt-8">
        <ServiceFilters initial={filters} />
      </div>

      <div className="mt-8">
        {/* key forces the skeleton to show again every time the filters change */}
        <Suspense key={JSON.stringify(filters)} fallback={<ServiceGridSkeleton count={8} />}>
          <ServiceResults filters={filters} />
        </Suspense>
      </div>
    </section>
  );
}