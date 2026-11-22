"use client";

import { authClient } from "@/lib/auth-client";
import type { AppUser } from "@/types";

export function useCurrentUser() {
  const { data, isPending, refetch } = authClient.useSession();
  // `role`, `phone`, `area`, `bio` are additionalFields (typed properly in Step 4)
  const user = (data?.user ?? null) as AppUser | null;
  // refetch() re-reads the session from the database, so a profile change shows in the navbar at once
  return { user, isPending, refetch };
}
