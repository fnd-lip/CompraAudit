import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  erro?: string;
};

export function Input({ label, erro, className = "", ...props }: InputProps) {
  return (
    <div>
      {label && (
        <label className="mb-1.5 block font-mono text-[10px] font-bold uppercase tracking-widest text-slate-400">
          {/* exibe o rótulo do campo */}
          {label}
        </label>
      )}

      <input
        {...props}
        className={`w-full rounded-xl border bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:bg-white focus:ring-2 focus:ring-blue-600/10 ${
          erro ? "border-red-400" : "border-slate-200 focus:border-blue-600"
        } ${className}`}
      />

      {erro && (
        <p className="mt-1 text-xs font-medium text-red-500">
          {/* exibe a mensagem de erro do campo */}
          {erro}
        </p>
      )}
    </div>
  );
}