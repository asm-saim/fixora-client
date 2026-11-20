import { AirVent, Laptop, Refrigerator, Smartphone, Tv, WashingMachine, Zap, type LucideIcon } from "lucide-react";
import type { CATEGORIES } from "@/lib/constants";

export const CATEGORY_ICONS: Record<(typeof CATEGORIES)[number], LucideIcon> = {
  Smartphone,
  "Laptop & PC": Laptop,
  AC: AirVent,
  Refrigerator,
  TV: Tv,
  "Washing Machine": WashingMachine,
  Electrical: Zap,
};