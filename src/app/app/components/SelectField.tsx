"use client";

import { cn } from "@/lib/cn";

interface SelectFieldProps {
  value: string | number;
  onChange: (value: string) => void;
  options: { value: string | number; label: string }[];
  disabled?: boolean;
  className?: string;
}

export default function SelectField({ value, onChange, options, disabled, className }: SelectFieldProps) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={cn(
          "h-11 w-full cursor-pointer appearance-none rounded-xl border border-border bg-white px-4 py-3 pr-10 font-sans text-base font-normal text-text-primary outline-none transition-[border-color,box-shadow] focus:border-magenta focus:shadow-[0_0_0_3px_rgba(255,55,199,0.1)] disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] leading-none text-text-tertiary">
        ▾
      </div>
    </div>
  );
}
