import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variante?: "primario" | "secundario" | "perigo";
};

export function Button({
  children,
  variante = "primario",
  className = "",
  ...props
}: ButtonProps) {
  const estilos = {
    primario: "bg-blue-600 text-white hover:bg-blue-700",
    secundario: "border border-slate-300 bg-white text-slate-800 hover:bg-slate-100",
    perigo: "border border-red-200 bg-red-50 text-red-600 hover:bg-red-100",
  };

  return (
    <button
      className={`rounded-xl px-5 py-3 font-semibold transition ${estilos[variante]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}