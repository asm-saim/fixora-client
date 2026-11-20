import { cache } from "react";
import type { ServiceDetail } from "@/types";

/** Deduplicated per request, so generateMetadata and the page share one fetch. Returns null on 404. */
export const getServiceById = cache(async (id: string): Promise<ServiceDetail | null> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/services/${encodeURIComponent(id)}`, {
    cache: "no-store",
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Could not load the service");
  return res.json();
});