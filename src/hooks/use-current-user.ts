"use client";

import { authClient } from "@/lib/auth-client";
import type { AppUser } from "@/types";

export function useCurrentUser() {
  const { data, isPending } = authClient.useSession();
  // `role`, `phone`, `area`, `bio` are additionalFields (typed properly in Step 4)
  const user = (data?.user ?? null) as AppUser | null;
  return { user, isPending };
}