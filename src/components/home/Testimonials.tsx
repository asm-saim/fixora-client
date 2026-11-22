import { Star } from "lucide-react";
import UserAvatar from "@/components/shared/UserAvatar";
import SectionHeading from "@/components/shared/SectionHeading";

const ITEMS = [
  {
    quote: "My laptop hinge broke on a Friday. The technician accepted within the hour, I could follow every step, and I paid only after it was fixed.",
    name: "Nusrat Jahan",
    role: "Customer, Mirpur, Dhaka",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&crop=faces&w=96&h=96&q=80",
  },
  {
    quote: "Fixora gives me a proper place to list my services. Requests arrive with the address and the problem already written down.",
    name: "Rafiq Ahmed",
    role: "AC Technician, Uttara, Dhaka",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&crop=faces&w=96&h=96&q=80",
  },
  {
    quote: "Knowing the starting price first and paying afterwards made me comfortable handing over my phone for a screen replacement.",
    name: "Tanvir Hasan",
    role: "Customer, Dhanmondi, Dhaka",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&crop=faces&w=96&h=96&q=80",
  },
  {
    quote: "I compared a few technicians, but only here could I see the starting price and real reviews before booking my microwave repair.",
    name: "Sharmin Akter",
    role: "Customer, Bashundhara, Dhaka",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&crop=faces&w=96&h=96&q=80",
  },
  {
    quote: "The request tells me exactly what is broken and where to go. I spend less time on the phone and more time actually fixing things.",
    name: "Kamrul Islam",
    role: "Electrician, Mohammadpur, Dhaka",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&crop=faces&w=96&h=96&q=80",
  },
  {
    quote: "Live status updates meant I wasn't stuck waiting at home all day. I could see exactly when my technician was on the way.",
    name: "Ayesha Siddika",
    role: "Customer, Gulshan, Dhaka",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&crop=faces&w=96&h=96&q=80",
  },
  {
    quote: "I joined as a technician last month. Every job is recorded and payment is confirmed right after the work, which builds real trust.",
    name: "Jahangir Alam",
    role: "Fridge Technician, Chittagong",
    avatar: "https://images.unsplash.com/photo-1521119989659-a83eee488004?auto=format&fit=crop&crop=faces&w=96&h=96&q=80",
  },
  {
    quote: "My washing machine stopped working during Eid. Fixora found someone the same day and everything was sorted before dinner.",
    name: "Farhana Rahman",
    role: "Customer, Rangpur",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&crop=faces&w=96&h=96&q=80",
  },
];

type Testimonial = (typeof ITEMS)[number];

function TestimonialCard({ item }: { item: Testimonial }) {
  return (
    <figure className="flex h-full w-[300px] shrink-0 flex-col rounded-2xl border bg-card p-6 shadow-sm sm:w-[340px]">
      <div className="flex gap-1 text-amber-500" aria-label="5 out of 5 stars">
        {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
      </div>
      <blockquote className="mt-4 text-sm leading-7 text-muted-foreground">&ldquo;{item.quote}&rdquo;</blockquote>
      <figcaption className="mt-auto flex items-center gap-3 pt-6">
        <UserAvatar
          src={item.avatar}
          name={item.name}
          className="h-10 w-10"
          fallbackClassName="bg-secondary text-xs font-semibold text-white"
        />
        <span>
          <span className="block text-sm font-semibold">{item.name}</span>
          <span className="block text-xs text-muted-foreground">{item.role}</span>
        </span>
      </figcaption>
    </figure>
  );
}

export default function Testimonials() {
  return (
    <section className="bg-muted/60 section-space">
      <div className="container-page">
        <SectionHeading center eyebrow="Testimonials" title="What people say about Fixora" />

        <div
          className="marquee-viewport mt-12 rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
          role="region"
          aria-label="Customer and technician testimonials"
          tabIndex={0}
        >
          <div className="marquee-track">
            <div className="marquee-group">
              {ITEMS.map((item) => <TestimonialCard key={item.name} item={item} />)}
            </div>
            <div className="marquee-group" aria-hidden="true">
              {ITEMS.map((item) => <TestimonialCard key={`copy-${item.name}`} item={item} />)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
