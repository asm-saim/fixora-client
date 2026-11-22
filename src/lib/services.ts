import type { ServicesResponse } from "@/types";

export type ServiceFilterValues = {
  search: string;
  category: string;
  serviceMode: string;
  sort: string;
  page: number;
};

export const EMPTY_FILTERS: ServiceFilterValues = { search: "", category: "", serviceMode: "", sort: "newest", page: 1 };

/** Builds the query string, leaving out defaults so URLs stay clean */
export function buildQuery(f: Partial<ServiceFilterValues>) {
  const p = new URLSearchParams();
  if (f.search) p.set("search", f.search);
  if (f.category) p.set("category", f.category);
  if (f.serviceMode) p.set("serviceMode", f.serviceMode);
  if (f.sort && f.sort !== "newest") p.set("sort", f.sort);
  if (f.page && f.page > 1) p.set("page", String(f.page));
  return p.toString();
}

export async function getServices(filters: Partial<ServiceFilterValues>, limit = 12): Promise<ServicesResponse> {
  const qs = new URLSearchParams(buildQuery(filters));
  qs.set("limit", String(limit));

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/services?${qs}`, { next: { revalidate: 30 } });
  if (!res.ok) throw new Error("Could not load services");
  return res.json();
}