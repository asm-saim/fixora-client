"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, UserRound, Wrench } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import PasswordInput from "@/components/auth/PasswordInput";
import GoogleButton from "@/components/auth/GoogleButton";
import OrDivider from "@/components/auth/OrDivider";

import { authClient } from "@/lib/auth-client";
import { dashboardPath } from "@/lib/roles";
import { signUpSchema, type SignUpValues } from "@/lib/validations";

const ROLES = [
  {
    value: "customer",
    title: "Customer",
    desc: "I need something repaired",
    icon: UserRound,
  },
  {
    value: "technician",
    title: "Technician",
    desc: "I offer repair services",
    icon: Wrench,
  },
] as const;

export default function SignUpForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "customer",
    },
  });

  async function onSubmit(values: SignUpValues) {
    const { error } = await authClient.signUp.email({
      name: values.name,
      email: values.email,
      password: values.password,
      role: values.role,
    });

    if (error) {
      toast.error(error.message || "Could not create your account");
      return;
    }

    toast.success("Account created. Welcome to Fixora!");

    router.replace(dashboardPath(values.role));
    router.refresh();
  }

  return (
    <div>
      <h1 className="text-3xl font-bold">Create your account</h1>

      <p className="mt-2 text-muted-foreground">
        Join Fixora as a customer or a technician.
      </p>

      {/* Email and password registration */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-8 space-y-5"
        noValidate
      >
        <fieldset className="space-y-2">
          <legend className="mb-2 text-sm leading-none font-medium">
            I am a
          </legend>

          <div className="grid grid-cols-2 gap-3">
            {ROLES.map(({ value, title, desc, icon: Icon }) => (
              <label key={value} className="cursor-pointer">
                <input
                  type="radio"
                  value={value}
                  className="peer sr-only"
                  {...register("role")}
                />

                <div className="h-full rounded-xl border-2 bg-card p-4 transition peer-checked:border-primary peer-checked:bg-primary/10 peer-focus-visible:ring-2 peer-focus-visible:ring-ring">
                  <Icon className="h-5 w-5 text-teal-600 dark:text-teal-300" />

                  <p className="mt-2 text-sm font-semibold">{title}</p>

                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
              </label>
            ))}
          </div>

          {errors.role && (
            <p className="text-sm text-destructive">Please choose a role</p>
          )}
        </fieldset>

        <div className="space-y-2">
          <Label htmlFor="name">Full name</Label>

          <Input
            id="name"
            autoComplete="name"
            className="h-11"
            aria-invalid={!!errors.name}
            {...register("name")}
          />

          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>

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
            autoComplete="new-password"
            aria-invalid={!!errors.password}
            {...register("password")}
          />

          {errors.password ? (
            <p className="text-sm text-destructive">
              {errors.password.message}
            </p>
          ) : (
            <p className="text-xs text-muted-foreground">
              At least 6 characters, with an uppercase and a lowercase letter.
            </p>
          )}
        </div>

        <Button type="submit" className="h-11 w-full" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create Account
        </Button>
      </form>

      {/* Google OAuth registration */}
      <OrDivider />

      <GoogleButton label="Sign up with Google" />

      <p className="mt-2 text-center text-xs text-muted-foreground">
        Google sign-up creates a Customer account.
      </p>

      {/* Sign-in link */}
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/sign-in"
          className="font-semibold text-teal-600 dark:text-teal-300 hover:underline"
        >
          Sign In
        </Link>
      </p>
    </div>
  );
}
