import Link from "next/link";
import type { ComponentProps, HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

interface SectionHeaderProps {
  title: ReactNode;
  description?: ReactNode;
  className?: string;
  descriptionClassName?: string;
}

export function SectionHeader({
  title,
  description,
  className,
  descriptionClassName,
}: SectionHeaderProps) {
  return (
    <div className={cn("mb-16 text-center", className)}>
      <h2 className="mb-4 text-[40px] font-semibold leading-[1.2] tracking-[-2.4px] text-vercel-black">
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "mx-auto max-w-[36rem] text-xl font-normal leading-[1.8] text-text-secondary",
            descriptionClassName
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}

type MarketingCardVariant = "default" | "elevated" | "highlighted";

interface MarketingCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: MarketingCardVariant;
}

const cardVariants: Record<MarketingCardVariant, string> = {
  default:
    "rounded-lg bg-white p-6 shadow-[rgba(0,0,0,0.08)_0_0_0_1px,rgba(0,0,0,0.04)_0_2px_2px]",
  elevated:
    "rounded-xl bg-white p-8 shadow-[rgba(0,0,0,0.08)_0_0_0_1px,rgba(0,0,0,0.04)_0_2px_2px,rgba(0,0,0,0.04)_0_8px_8px_-8px,#fafafa_0_0_0_1px]",
  highlighted:
    "rounded-xl bg-white p-8 shadow-[rgba(10,114,239,0.15)_0_0_0_2px,rgba(0,0,0,0.04)_0_2px_2px,rgba(0,0,0,0.04)_0_8px_8px_-8px,#fafafa_0_0_0_1px]",
};

export function MarketingCard({
  variant = "default",
  className,
  ...props
}: MarketingCardProps) {
  return <div className={cn(cardVariants[variant], className)} {...props} />;
}

interface PillProps extends HTMLAttributes<HTMLSpanElement> {
  withDot?: boolean;
}

export function Pill({ withDot = false, className, children, ...props }: PillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full bg-badge-bg px-2.5 text-xs font-medium leading-6 text-badge-text",
        className
      )}
      {...props}
    >
      {withDot && <span className="h-1.5 w-1.5 rounded-full bg-badge-text" />}
      {children}
    </span>
  );
}

type MarketingLinkVariant = "dark" | "outline";

interface MarketingLinkProps extends ComponentProps<typeof Link> {
  variant?: MarketingLinkVariant;
}

const linkVariants: Record<MarketingLinkVariant, string> = {
  dark: "bg-vercel-black text-white hover:opacity-80",
  outline:
    "bg-white text-vercel-black shadow-[rgba(0,0,0,0.08)_0_0_0_1px] hover:shadow-[rgba(0,0,0,0.12)_0_0_0_1px]",
};

export function MarketingLink({
  variant = "dark",
  className,
  ...props
}: MarketingLinkProps) {
  return (
    <Link
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md px-5 py-2.5 text-sm font-medium leading-[1.43] transition-all no-underline",
        linkVariants[variant],
        className
      )}
      {...props}
    />
  );
}
