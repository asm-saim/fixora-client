"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CATEGORIES, SERVICE_MODES, SORT_OPTIONS } from "@/lib/constants";
import { buildQuery, type ServiceFilterValues } from "@/lib/services";

export default function ServiceFilters({ initial }: { initial: ServiceFilterValues }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [query, setQuery] = useState(initial.search);
  const lastPushed = useRef(initial.search);

  const push = useCallback(
    (next: Partial<ServiceFilterValues>) => {
      const merged = { ...initial, ...next, page: 1 }; // any filter change goes back to page 1
      if (next.search !== undefined) lastPushed.current = next.search;
      const qs = buildQuery(merged);
      startTransition(() => router.replace(qs ? `/services?${qs}` : "/services", { scroll: false }));
    },
    [initial, router]
  );

  // Keep the box in sync when the URL changes from outside (back button, category card)
  useEffect(() => {
    if (initial.search !== lastPushed.current) {
      lastPushed.current = initial.search;
      setQuery(initial.search);
    }
  }, [initial.search]);

  // Debounced search: wait 400ms after the last keystroke
  useEffect(() => {
    if (query.trim() === initial.search) return;
    const timer = setTimeout(() => push({ search: query.trim() }), 400);
    return () => clearTimeout(timer);
  }, [query, initial.search, push]);

  const hasFilters = !!(initial.search || initial.category || initial.serviceMode || initial.sort !== "newest");

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); push({ search: query.trim() }); }}
      className="grid gap-3 rounded-2xl border bg-card p-4 shadow-sm lg:grid-cols-[1fr_190px_190px_200px_auto]"
      role="search"
    >
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title or category"
          className="h-11 pl-9 pr-9"
          aria-label="Search services"
        />
        {pending && <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />}
      </div>

      <Select value={initial.category || "all"} onValueChange={(v) => push({ category: !v || v === "all" ? "" : v })}>
        <SelectTrigger className="h-11 w-full" aria-label="Category"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All categories</SelectItem>
          {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
        </SelectContent>
      </Select>

      <Select value={initial.serviceMode || "all"} onValueChange={(v) => push({ serviceMode: !v || v === "all" ? "" : v })}>
        <SelectTrigger className="h-11 w-full" aria-label="Service mode"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All modes</SelectItem>
          {SERVICE_MODES.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
        </SelectContent>
      </Select>

      <Select value={initial.sort} onValueChange={(v) => push({ sort: v ?? undefined })}>
        <SelectTrigger className="h-11 w-full" aria-label="Sort"><SelectValue /></SelectTrigger>
        <SelectContent>
          {SORT_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
        </SelectContent>
      </Select>

      {hasFilters && (
        <Button
          type="button"
          variant="ghost"
          className="h-11"
          onClick={() => { lastPushed.current = ""; setQuery(""); startTransition(() => router.replace("/services", { scroll: false })); }}
        >
          <X className="mr-1.5 h-4 w-4" /> Clear
        </Button>
      )}
    </form>
  );
}