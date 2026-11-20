"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

type Props = { callbackURL?: string; label?: string };

export default function GoogleButton({ callbackURL = "/dashboard", label = "Continue with Google" }: Props) {
  const [loading, setLoading] = useState(false);

  async function onClick() {
    setLoading(true);
    const { error } = await authClient.signIn.social({
      provider: "google",
      callbackURL,
      errorCallbackURL: "/sign-in",
    });
    // On success the browser leaves for Google, so we only get here on failure
    if (error) {
      toast.error(error.message || "Google sign-in failed");
      setLoading(false);
    }
  }

  return (
    <Button type="button" variant="outline" className="h-11 w-full gap-3" onClick={onClick} disabled={loading}>
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <FcGoogle className="h-5 w-5" />}
      {label}
    </Button>
  );
}