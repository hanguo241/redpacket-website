import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type BadgeTone = "success" | "info" | "error" | "neutral" | "brand";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
}

const toneClasses: Record<BadgeTone, string> = {
  success: "border-success-bg bg-success-bg text-success",
  info: "border-info-bg bg-info-bg text-info",
  error: "border-error-bg bg-error-bg text-error",
  neutral: "border-border-light bg-bg-subtle text-text-tertiary",
  brand: "border-magenta-overlay bg-magenta-overlay text-magenta",
};

export function Badge({ tone = "neutral", className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-1 font-sans text-xs font-medium leading-none",
        toneClasses[tone],
        className
      )}
      {...props}
    />
  );
}
