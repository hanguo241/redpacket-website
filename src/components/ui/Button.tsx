import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary" | "ghost" | "dark" | "outline";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: "border-transparent bg-magenta text-text-primary hover:opacity-80",
  secondary: "border-transparent bg-magenta-overlay text-text-primary hover:opacity-80",
  ghost:
    "border-magenta-ghost bg-transparent text-magenta hover:bg-magenta-overlay hover:text-magenta-dark",
  dark: "border-transparent bg-vercel-black text-white hover:opacity-80",
  outline:
    "border-border-light bg-white text-vercel-black shadow-[rgba(0,0,0,0.08)_0px_0px_0px_1px] hover:shadow-[rgba(0,0,0,0.12)_0px_0px_0px_1px]",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-xs",
  md: "h-11 px-4 text-sm",
  lg: "h-14 px-5 text-sm",
};

export function Button({
  variant = "primary",
  size = "md",
  fullWidth = true,
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center rounded-xl border font-sans font-medium leading-none transition-all disabled:cursor-not-allowed disabled:opacity-50",
        fullWidth && "w-full",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    />
  );
}
