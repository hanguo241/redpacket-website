import { cn } from "@/lib/cn";

interface SpinnerProps {
  size?: "sm" | "md";
  className?: string;
}

export function Spinner({ size = "md", className }: SpinnerProps) {
  return (
    <div
      className={cn(
        "mx-auto rounded-full border-border-light border-t-magenta animate-spin",
        size === "sm" ? "h-8 w-8 border-2" : "h-12 w-12 border-[3px]",
        className
      )}
    />
  );
}
