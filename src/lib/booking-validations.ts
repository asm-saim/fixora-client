import { z } from "zod";
import { todayLocalISO } from "./format";

export const requestSchema = z.object({
  customerPhone: z
    .string()
    .trim()
    .regex(/^\+?[0-9][0-9\s-]{6,18}$/, "Enter a valid phone number"),
  address: z.string().trim().min(5, "Enter the full service address").max(200, "Address is too long"),
  preferredDate: z
    .string()
    .min(1, "Choose a preferred date")
    .refine((value) => value >= todayLocalISO(), "The date must be today or later"),
  problemDescription: z
    .string()
    .trim()
    .min(20, "Describe the problem in at least 20 characters")
    .max(1000, "Description is too long"),
});

export type RequestValues = z.infer<typeof requestSchema>;
