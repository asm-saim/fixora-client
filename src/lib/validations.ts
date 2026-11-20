
import { z } from "zod";
import { CATEGORIES, SERVICE_MODES } from "./constants";

// Sign-up validation
export const signUpSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(/[A-Z]/, "Include at least one uppercase letter")
    .regex(/[a-z]/, "Include at least one lowercase letter"),
  role: z.enum(["customer", "technician"]),
});

export type SignUpValues = z.infer<typeof signUpSchema>;

// Sign-in validation
export const signInSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export type SignInValues = z.infer<typeof signInSchema>;

// Service form validation
const oneOf = (list: readonly string[], message: string) =>
  z.string().refine((value) => list.includes(value), message);

export const serviceSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title is too long"),

  category: oneOf(CATEGORIES, "Select a category"),

  description: z
    .string()
    .trim()
    .min(20, "Describe the service in at least 20 characters")
    .max(2000, "Description is too long"),

  // Kept as a string while typing, converted to a number on submit.
  basePrice: z
    .string()
    .refine(
      (value) =>
        value.trim() !== "" &&
        Number.isFinite(Number(value)) &&
        Number(value) > 0,
      "Enter a price greater than 0"
    ),

  estimatedDuration: z
    .string()
    .trim()
    .min(2, "Enter a duration, e.g. 2-3 hours")
    .max(50, "Too long"),

  serviceMode: oneOf(SERVICE_MODES, "Select a service mode"),

  serviceArea: z
    .string()
    .trim()
    .min(2, "Enter the area you cover")
    .max(100, "Too long"),
});

export type ServiceValues = z.infer<typeof serviceSchema>;
