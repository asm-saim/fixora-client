import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BadgeCheck, CheckCircle2, ChevronRight, Clock, Home, MapPin, Store, Tag } from "lucide-react";
import { ImageReveal } from "@/components/motion/ImageReveal";
import { Reveal } from "@/components/motion/Reveal";
import ReviewList from "@/components/reviews/ReviewList";
import { RatingSummary } from "@/components/reviews/StarRating";
import UserAvatar from "@/components/shared/UserAvatar";
import { getServiceById } from "@/lib/data";
import RequestRepairButton from "../RequestRepairButton";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const service = await getServiceById(id);
  if (!service) return { title: "Service not found" };
  return {
    title: service.title,
    description: service.description.slice(0, 155),
    openGraph: { images: [service.image] },
  };
}

export default async function ServiceDetailsPage({ params }: Props) {
  const { id } = await params;
  const service = await getServiceById(id);
  if (!service) notFound();

  const ModeIcon = service.serviceMode === "Home Visit" ? Home : Store;
  const facts = [
    { icon: Tag, label: "Category", value: service.category },
    { icon: Clock, label: "Estimated duration", value: service.estimatedDuration },
    { icon: ModeIcon, label: "Service mode", value: service.serviceMode },
    { icon: MapPin, label: "Service area", value: service.serviceArea },
  ];

  return (
    <div className="container-page py-8 md:py-12">
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">Home</Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/services" className="hover:text-foreground">Services</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="line-clamp-1 text-foreground">{service.title}</span>
      </nav>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_380px] lg:grid-rows-[auto_1fr] lg:gap-x-12">
        {/* Top-left: image, title and key facts */}
        <div className="min-w-0 space-y-6 lg:col-start-1 lg:row-start-1">
          <ImageReveal className="relative aspect-[16/10] rounded-2xl border bg-muted">
            <Image
              src={service.image}
              alt={service.title}
              fill
              priority
              sizes="(min-width: 1024px) 60vw, 100vw"
              className="object-cover"
            />
          </ImageReveal>

          <Reveal>
            <span className="eyebrow">{service.category}</span>
            <h1 className="section-title mt-3">{service.title}</h1>
            <div className="mt-3">
              <RatingSummary average={service.ratingAverage} count={service.ratingCount} />
            </div>
          </Reveal>

          <Reveal>
            <dl className="grid grid-cols-2 gap-4">
              {facts.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-3 rounded-xl border bg-card p-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-teal-600 dark:text-teal-300">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <dt className="text-xs text-muted-foreground">{label}</dt>
                    <dd className="truncate text-sm font-semibold">{value}</dd>
                  </div>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        {/* Right: booking card (sticky on desktop, spans both rows) */}
        <aside className="lg:sticky lg:top-24 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-start">
          <Reveal delay={0.1}>
            <div className="space-y-5 rounded-2xl border bg-card p-6 shadow-sm">
              <div>
                <p className="text-sm text-muted-foreground">Starting from</p>
                <p className="font-heading text-4xl font-bold">${service.basePrice}</p>
                <p className="mt-1 text-xs text-muted-foreground">The technician confirms the final amount when the job is completed.</p>
              </div>

              <RequestRepairButton
                service={{
                  _id: service._id,
                  title: service.title,
                  basePrice: service.basePrice,
                  image: service.image,
                  category: service.category,
                }}
              />

              <ul className="space-y-3 border-t pt-5 text-sm text-muted-foreground">
                {[
                  "No payment now. You pay after the job is completed.",
                  "Track every status update from your dashboard.",
                  "Cancel anytime while the request is still pending.",
                ].map((t) => (
                  <li key={t} className="flex gap-2.5">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-600 dark:text-teal-300" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </aside>

        {/* Bottom-left: description and technician */}
        <div className="min-w-0 space-y-8 lg:col-start-1 lg:row-start-2">
          <Reveal>
            <h2 className="text-xl font-bold">About this service</h2>
            <p className="mt-3 whitespace-pre-line leading-7 text-muted-foreground">{service.description}</p>
          </Reveal>

          <Reveal>
            <h2 className="text-xl font-bold">Your technician</h2>
            <div className="mt-4 flex gap-4 rounded-2xl border bg-card p-5 shadow-sm">
              <UserAvatar
                src={service.technician.image}
                name={service.technician.name}
                className="h-16 w-16 border"
                fallbackClassName="bg-secondary text-lg font-semibold text-white"
              />
              <div className="min-w-0">
                <p className="flex flex-wrap items-center gap-2 font-semibold">
                  {service.technician.name}
                  <span className="inline-flex items-center gap-1 rounded-full bg-teal-100 dark:bg-teal-500/15 px-2 py-0.5 text-xs font-medium text-teal-800 dark:text-teal-300">
                    <BadgeCheck className="h-3.5 w-3.5" /> Approved listing
                  </span>
                </p>
                {service.technician.area && (
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" /> {service.technician.area}
                  </p>
                )}
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {service.technician.bio || "This technician has not added a bio yet."}
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal>
            <ReviewList reviews={service.reviews ?? []} average={service.ratingAverage ?? 0} count={service.ratingCount ?? 0} />
          </Reveal>
        </div>
      </div>
    </div>
  );
}