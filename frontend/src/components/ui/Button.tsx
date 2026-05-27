import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variante?: "primario" | "secundario" | "perigo" | "escuro";
};

const estilos = {
  primario:
    "border-blue-700/20 bg-blue-600 text-white shadow-blue-600/10 hover:bg-blue-700",
  secundario:
    "border-slate-200 bg-white text-slate-800 hover:bg-slate-50",
  perigo:
    "border-red-200 bg-red-50 text-red-600 hover:bg-red-100",
  escuro:
    "border-slate-800 bg-slate-950 text-white hover:bg-slate-900",
};

export function Button({
  children,
  variante = "primario",
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center rounded-xl border px-5 py-3 text-sm font-bold shadow-sm transition disabled:cursor-not-allowed disabled:opacity-60 ${estilos[variante]} ${className}`}
    >
      {/* exibe o texto ou conteúdo do botão */}
      {children}
    </button>
  );
}