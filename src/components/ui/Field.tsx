import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface FieldProps {
  label: ReactNode;
  children: ReactNode;
  className?: string;
}

export function Field({ label, children, className }: FieldProps) {
  return (
    <div className={className}>
      <label className="mb-2 block text-xs font-normal tracking-[0.03em] text-text-tertiary">
        {label}
      </label>
      {children}
    </div>
  );
}

interface FormTitleProps {
  title: ReactNode;
  description?: ReactNode;
  className?: string;
}

export function FormTitle({ title, description, className }: FormTitleProps) {
  return (
    <div className={cn("mb-5", className)}>
      <h3 className="m-0 mb-2 font-sans text-2xl font-semibold text-text-primary">
        {title}
      </h3>
      {description && (
        <p className="mb-0 font-sans text-xs text-text-tertiary">{description}</p>
      )}
    </div>
  );
}
