"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import PasswordInput from "@/components/auth/PasswordInput";
import GoogleButton from "@/components/auth/GoogleButton";
import OrDivider from "@/components/auth/OrDivider";

import { authClient } from "@/lib/auth-client";
import type { Role } from "@/lib/constants";
import { dashboardPath } from "@/lib/roles";
import { safeRedirect } from "@/lib/utils";
import { signInSchema, type SignInValues } from "@/lib/validations";

export default function SignInForm() {
  const router = useRouter();
  const params = useSearchParams();

  const redirectTo = safeRedirect(params.get("redirect"));

  // Display an error if Google OAuth fails or is cancelled.
  useEffect(() => {
    if (params.get("error")) {
      toast.error("Google sign-in was cancelled or failed. Please try again.", {
        id: "auth-error",
      });
    }
  }, [params]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: SignInValues) {
    const { data, error } = await authClient.signIn.email(values);

    if (error || !data) {
      toast.error(error?.message || "Invalid email or password");
      return;
    }

    toast.success("Signed in successfully");

    // Redirect to the requested page or the user's role-based dashboard.
    const role: Role =
      data.user.role === "admin" ||
      data.user.role === "technician" ||
      data.user.role === "customer"
        ? data.user.role
        : "customer";

    router.replace(redirectTo ?? dashboardPath(role));
    router.refresh();
  }

  return (
    <div>
      <h1 className="text-3xl font-bold">Welcome back</h1>

      <p className="mt-2 text-muted-foreground">
        Sign in to manage your repairs.
      </p>

      {/* Email and password sign-in */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-8 space-y-5"
        noValidate
      >
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>

          <Input
            id="email"
            type="email"
            autoComplete="email"
            className="h-11"
            aria-invalid={!!errors.email}
            {...register("email")}
          />

          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>

          <PasswordInput
            id="password"
            autoComplete="current-password"
            aria-invalid={!!errors.password}
            {...register("password")}
          />

          {errors.password && (
            <p className="text-sm text-destructive">
              {errors.password.message}
            </p>
          )}
        </div>

        <Button type="submit" className="h-11 w-full" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Sign In
        </Button>
      </form>

      {/* Google OAuth sign-in */}
      <OrDivider />

      <GoogleButton callbackURL={redirectTo ?? "/dashboard"} />

      {/* Registration link */}
      <p className="mt-6 text-center text-sm text-muted-foreground">
        New to Fixora?{" "}
        <Link
          href="/sign-up"
          className="font-semibold text-teal-600 hover:underline"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}
