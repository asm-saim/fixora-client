"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CATEGORIES } from "@/lib/constants";

export default function HeroSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("search", query.trim());
    if (category !== "all") params.set("category", category);
    const qs = params.toString();
    router.push(qs ? `/services?${qs}` : "/services");
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-white/25 bg-white/10 p-6 text-white shadow-[0_20px_60px_rgba(0,0,0,0.35)] ring-1 ring-white/10 backdrop-blur-xl sm:p-8"
    >
      <h2 className="font-heading text-xl font-bold text-white">Find a Repair</h2>
      <p className="mt-1 text-sm text-white/70">
        Search verified technicians near you.
      </p>

      <div className="mt-5 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="hero-search" className="text-white/85">What needs fixing?</Label>
          <Input
            id="hero-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. iPhone screen, AC servicing"
            className="h-11 border-white/20 bg-white/10 text-white placeholder:text-white/55 focus-visible:border-primary focus-visible:ring-primary/40"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-white/85">Category</Label>
          {/* <Select value={category} onValueChange={setCategory}> */}
          <Select
            value={category}
            onValueChange={(value) => setCategory(value ?? "all")}
          >
            <SelectTrigger className="h-11 w-full border-white/20 bg-white/10 text-white [&_svg]:text-white/70 focus-visible:border-primary focus-visible:ring-primary/40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button type="submit" className="h-11 w-full">
          <Search className="mr-2 h-4 w-4" /> Search Services
        </Button>
      </div>
    </form>
  );
}
