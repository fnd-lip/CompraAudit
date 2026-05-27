import type { ReactNode } from "react";

type BadgeProps = {
  children: ReactNode;
  tipo?: "neutro" | "sucesso" | "alerta" | "aviso" | "erro" | "info";
  className?: string;
};

const estilos = {
  neutro: "border-slate-200 bg-slate-50 text-slate-600",
  sucesso: "border-emerald-200 bg-emerald-50 text-emerald-700",
  alerta: "border-amber-200 bg-amber-50 text-amber-700",
  aviso: "border-amber-200 bg-amber-50 text-amber-700",
  erro: "border-red-200 bg-red-50 text-red-700",
  info: "border-blue-200 bg-blue-50 text-blue-700",
};

export function Badge({ children, tipo = "neutro", className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest ${estilos[tipo]} ${className}`}
    >
      {/* exibe o status visual */}
      {children}
    </span>
  );
}