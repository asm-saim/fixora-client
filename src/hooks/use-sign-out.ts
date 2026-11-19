
"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { clearTokenCache } from "@/lib/api";

export function useSignOut() {
  const router = useRouter();

  return async () => {
    try {
      await authClient.signOut();
      clearTokenCache();

      toast.success("Signed out successfully");
      router.push("/");
      router.refresh();
    } catch {
      toast.error("Could not sign out. Please try again.");
    }
  };
}
