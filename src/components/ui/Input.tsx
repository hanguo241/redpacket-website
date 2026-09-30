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
    <div className="flex min-w-0 items-center rounded-xl border border-border bg-white focus-within:border-magenta focus-within:shadow-[0_0_0_3px_rgba(255,55,199,0.1)]">
      <input
        className={cn(
          "h-16 min-w-0 flex-1 rounded-xl border-0 bg-transparent py-3 pl-4 pr-2 text-right font-sans text-3xl font-semibold text-text-primary outline-none transition-[border-color,box-shadow] placeholder:text-text-placeholder",
          className
        )}
        {...props}
      />
      <span className="pointer-events-none shrink-0 pr-4 font-sans text-xl font-semibold text-text-tertiary">
        {symbol}
      </span>
    </div>
  );
}
