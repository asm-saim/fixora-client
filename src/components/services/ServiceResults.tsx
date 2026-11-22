import { redirect } from "next/navigation";
import EmptyState from "@/components/shared/EmptyState";
import ServiceCard from "@/components/shared/ServiceCard";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import Pagination from "@/components/services/Pagination";
import { buildQuery, getServices, type ServiceFilterValues } from "@/lib/services";

const PAGE_SIZE = 12;

export default async function ServiceResults({ filters }: { filters: ServiceFilterValues }) {
  const data = await getServices(filters, PAGE_SIZE);

  // ?page=99 on a smaller result set: send them to the last real page
  if (data.total > 0 && data.services.length === 0) {
    const qs = buildQuery({ ...filters, page: data.totalPages });
    redirect(qs ? `/services?${qs}` : "/services");
  }

  if (data.total === 0) {
    return (
      <EmptyState
        title="No services match your search"
        description="Try a different keyword, or clear the filters to see every available service."
        action={{ label: "Clear filters", href: "/services" }}
      />
    );
  }

  const from = (data.page - 1) * data.limit + 1;
  const to = from + data.services.length - 1;

  return (
    <>
      <p className="mb-5 text-sm text-muted-foreground">
        Showing <span className="font-semibold text-foreground">{from}-{to}</span> of{" "}
        <span className="font-semibold text-foreground">{data.total}</span> services
      </p>

      <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" gap={0.03} immediate>
        {data.services.map((s) => (
          <StaggerItem key={s._id} className="h-full">
            <ServiceCard service={s} />
          </StaggerItem>
        ))}
      </Stagger>

      <Pagination page={data.page} totalPages={data.totalPages} filters={filters} />
    </>
  );
}