import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";

export default function PageHeader({ title, subtitle, crumb }: { title: string; subtitle: string; crumb: string }) {
  return (
    <section className="relative overflow-hidden bg-secondary py-16 text-white md:py-20">
      <div className="pointer-events-none absolute -right-16 top-0 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
      <div className="container-page relative">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-slate-300">
          <Link href="/" className="hover:text-white">Home</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-white">{crumb}</span>
        </nav>
        <Reveal>
          <h1 className="mt-4 font-heading text-4xl font-bold md:text-5xl">{title}</h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-300">{subtitle}</p>
        </Reveal>
      </div>
    </section>
  );
}