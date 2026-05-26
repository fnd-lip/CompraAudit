import type { ReactNode } from "react";

type BadgeProps = {
  children: ReactNode;
  tipo?: "sucesso" | "erro" | "aviso" | "info";
};

export function Badge({ children, tipo = "info" }: BadgeProps) {
  const estilos = {
    sucesso: "bg-green-50 text-green-700 border-green-200",
    erro: "bg-red-50 text-red-700 border-red-200",
    aviso: "bg-amber-50 text-amber-700 border-amber-200",
    info: "bg-blue-50 text-blue-700 border-blue-200",
  };

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${estilos[tipo]}`}
    >
      {children}
    </span>
  );
}