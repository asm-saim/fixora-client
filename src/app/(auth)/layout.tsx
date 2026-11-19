import { redirect } from "next/navigation";
import { BadgeCheck, CreditCard, Activity } from "lucide-react";
import Logo from "@/components/shared/Logo";
import { getCurrentUser } from "@/lib/session";
import { dashboardPath } from "@/lib/roles";

const POINTS = [
  { icon: BadgeCheck, text: "Every technician is verified before listing" },
  { icon: Activity, text: "Track each repair, step by step" },
  { icon: CreditCard, text: "Pay only after the job is completed" },
];

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (user) redirect(dashboardPath(user.role));

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-secondary p-12 text-white lg:flex">
        <div className="pointer-events-none absolute -right-20 top-1/4 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
        <Logo light />
        <div className="relative">
          <h2 className="max-w-md text-4xl font-bold leading-tight">
            Repairs you can <span className="text-primary">trust</span> and track.
          </h2>
          <ul className="mt-8 space-y-4">
            {POINTS.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-slate-300">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-primary">
                  <Icon className="h-4 w-4" />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>
        <p className="relative text-sm text-slate-400">© {new Date().getFullYear()} Fixora</p>
      </aside>

      <main className="flex flex-col justify-center px-4 py-10 sm:px-10">
        <div className="mx-auto mb-8 w-full max-w-md lg:hidden"><Logo /></div>
        <div className="mx-auto w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}