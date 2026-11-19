import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "./auth";
import type { Role } from "./constants";
import { dashboardPath } from "./roles";
import type { AppUser } from "@/types";

export const getSession = cache(async () => auth.api.getSession({ headers: await headers() }));

export async function getCurrentUser(): Promise<AppUser | null> {
  const session = await getSession();
  if (!session) return null;
  const u = session.user as Record<string, unknown>;
  const str = (value: unknown) => (typeof value === "string" ? value : "");
  const role: Role =
    u.role === "admin" || u.role === "technician" || u.role === "customer"
      ? u.role
      : "customer";

  return {
    id: str(u.id),
    name: str(u.name),
    email: str(u.email),
    image: typeof u.image === "string" ? u.image : null,
    role,
    phone: str(u.phone),
    area: str(u.area),
    bio: str(u.bio),
  };
}

/** Logged-out users go to sign-in. Wrong role goes to their own dashboard. */
export async function requireRole(role: Role) {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");
  if (user.role !== role) redirect(dashboardPath(user.role));
  return user;
}