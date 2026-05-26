import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

export function Input({ label, className = "", ...props }: InputProps) {
  return (
    <label className="block">
      {label && (
        <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
          {label}
        </span>
      )}

      <input
        className={`mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-600 ${className}`}
        {...props}
      />
    </label>
  );
}