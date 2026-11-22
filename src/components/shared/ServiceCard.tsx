import Image from "next/image";
import Link from "next/link";
import { Home, MapPin, Store, UserRound } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { RatingSummary } from "@/components/reviews/StarRating";
import type { Service } from "@/types";

export default function ServiceCard({ service }: { service: Service }) {
  const ModeIcon = service.serviceMode === "Home Visit" ? Home : Store;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl motion-reduce:transition-none motion-reduce:hover:translate-y-0">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <Image
          src={service.image}
          alt={service.title}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105 motion-reduce:transform-none"
        />
        <span className="absolute left-3 top-3 rounded-full bg-secondary/90 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
          {service.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-2 min-h-[3.5rem] text-lg font-semibold leading-7">{service.title}</h3>

        {/* Fixed height, so cards stay equal whether or not a service has reviews */}
        <div className="mt-1 flex h-6 items-center">
          <RatingSummary average={service.ratingAverage} count={service.ratingCount} />
        </div>

        <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
          <li className="flex items-center gap-2"><ModeIcon className="h-4 w-4 shrink-0 text-teal-600 dark:text-teal-300" />{service.serviceMode}</li>
          <li className="flex items-center gap-2"><MapPin className="h-4 w-4 shrink-0 text-teal-600 dark:text-teal-300" /><span className="truncate">{service.serviceArea}</span></li>
          <li className="flex items-center gap-2"><UserRound className="h-4 w-4 shrink-0 text-teal-600 dark:text-teal-300" /><span className="truncate">{service.technicianName}</span></li>
        </ul>

        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          <div>
            <p className="text-xs text-muted-foreground">Starting from</p>
            <p className="font-heading text-xl font-bold">${service.basePrice}</p>
          </div>
          <Link href={`/services/${service._id}`} className={buttonVariants({ size: "sm" })}>View Details</Link>
        </div>
      </div>
    </article>
  );
}