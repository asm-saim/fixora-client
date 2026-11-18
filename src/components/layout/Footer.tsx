import Link from "next/link";
import { cacheLife } from "next/cache";
import { Mail, MapPin, Phone } from "lucide-react";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaXTwitter, FaYoutube } from "react-icons/fa6";
import Logo from "@/components/shared/Logo";
import { CATEGORIES } from "@/lib/constants";

const QUICK = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
];

const SOCIALS = [
  { href: "#", label: "X", icon: FaXTwitter },
  { href: "#", label: "Facebook", icon: FaFacebookF },
  { href: "#", label: "Instagram", icon: FaInstagram },
  { href: "#", label: "YouTube", icon: FaYoutube },
  { href: "#", label: "LinkedIn", icon: FaLinkedinIn },
];

export default async function Footer() {
  "use cache";
  cacheLife("days");

  const year = new Date().getFullYear();

  return (
    <footer className="bg-secondary text-slate-300">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo light />
          <p className="mt-4 max-w-xs text-sm leading-6">
            Verified technicians, transparent job tracking, and payment only after the work is done.
          </p>
          <div className="mt-5 flex gap-2">
            {SOCIALS.map(({ href, label, icon: Icon }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-heading text-base font-semibold text-white">Quick Links</h4>
          <ul className="mt-4 space-y-2.5 text-sm">
            {QUICK.map((l) => (
              <li key={l.href}><Link href={l.href} className="transition-colors hover:text-primary">{l.label}</Link></li>
            ))}
            <li><Link href="/sign-in" className="transition-colors hover:text-primary">Sign In</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-heading text-base font-semibold text-white">Popular Categories</h4>
          <ul className="mt-4 space-y-2.5 text-sm">
            {CATEGORIES.slice(0, 6).map((c) => (
              <li key={c}>
                <Link href={`/services?category=${encodeURIComponent(c)}`} className="transition-colors hover:text-primary">{c}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-heading text-base font-semibold text-white">Contact</h4>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex gap-3"><Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> support@fixora.com</li>
            <li className="flex gap-3"><Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> +880 1700-000000</li>
            <li className="flex gap-3"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> House 12, Road 5, Dhanmondi, Dhaka 1205</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-5 text-xs sm:flex-row">
          <p>© {year} Fixora. All rights reserved.</p>
          <p>Built for trustworthy repairs.</p>
        </div>
      </div>
    </footer>
  );
}