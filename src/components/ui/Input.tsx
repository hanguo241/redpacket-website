import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-xl border border-border bg-white px-4 py-3 font-sans text-base font-normal text-text-primary outline-none transition-[border-color,box-shadow] placeholder:text-text-placeholder focus:border-magenta focus:shadow-[0_0_0_3px_rgba(255,55,199,0.1)]",
        className
      )}
      {...props}
    />
  );
}

interface AmountInputProps extends InputHTMLAttributes<HTMLInputElement> {
  symbol: string;
}

export function AmountInput({ symbol, className, ...props }: AmountInputProps) {
  return (
    <div className="relative">
      <input
        className={cn(
          "h-16 w-full rounded-xl border border-border bg-white py-3 pl-4 pr-14 text-right font-sans text-3xl font-semibold text-text-primary outline-none transition-[border-color,box-shadow] placeholder:text-text-placeholder focus:border-magenta focus:shadow-[0_0_0_3px_rgba(255,55,199,0.1)]",
          className
        )}
        {...props}
      />
      <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 font-sans text-xl font-semibold text-text-tertiary">
        {symbol}
      </span>
    </div>
  );
}
