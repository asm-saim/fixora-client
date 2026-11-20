import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/utils";

type Props = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  center?: boolean;
  className?: string;
};

export default function SectionHeading({ eyebrow, title, subtitle, center = false, className }: Props) {
  return (
    <Reveal className={cn(center && "text-center", className)}>
      <span className="eyebrow">{eyebrow}</span>
      <h2 className="section-title mt-3">{title}</h2>
      {subtitle && <p className={cn("section-subtitle", center && "mx-auto")}>{subtitle}</p>}
    </Reveal>
  );
}