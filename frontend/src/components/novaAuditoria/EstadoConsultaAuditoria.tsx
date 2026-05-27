import { Database } from "lucide-react";

export function EstadoConsultaAuditoria() {
  return (
    <div className="flex min-h-80 items-center justify-center rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
      <div>
        <Database className="mx-auto h-14 w-14 text-slate-300" />

        <h2 className="mt-6 font-mono text-sm font-bold uppercase tracking-[0.25em] text-slate-500">
          aguardando consulta...
        </h2>

        <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-slate-400">
          Digite um identificador de contratação ou use um dos atalhos rápidos à
          esquerda para iniciar a auditoria.
        </p>
      </div>
    </div>
  );
}