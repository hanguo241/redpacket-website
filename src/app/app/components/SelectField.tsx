"use client";

interface SelectFieldProps {
  value: string | number;
  onChange: (value: string) => void;
  options: { value: string | number; label: string }[];
  disabled?: boolean;
}

export default function SelectField({ value, onChange, options, disabled }: SelectFieldProps) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full px-4 py-3 pr-10 rounded-xl text-base font-normal font-sans text-[#131313] bg-white border border-[#CBCDE1] outline-none h-11 box-border cursor-pointer appearance-none transition-colors duration-150 focus:border-[#FF37C7] focus:shadow-[0px_0px_0px_3px_rgba(255,55,199,0.1)]"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#808080] text-[10px] leading-none">
        ▾
      </div>
    </div>
  );
}
