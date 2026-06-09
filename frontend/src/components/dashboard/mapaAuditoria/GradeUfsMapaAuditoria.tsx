import { NOMES_UF } from "./constantesMapaAuditoria";
import { classeRiscoPorQuantidade } from "./utilsMapaAuditoria";

type GradeUfsMapaAuditoriaProps = {
  ufsExibidas: readonly string[];
  contagemPorUf: Map<string, number>;
  ufSelecionada: string | null;
  onSelecionarUf: (uf: string) => void;
};

export function GradeUfsMapaAuditoria({
  ufsExibidas,
  contagemPorUf,
  ufSelecionada,
  onSelecionarUf,
}: GradeUfsMapaAuditoriaProps) {
  return (
    <div className="rounded-3xl border border-slate-100 bg-slate-50 p-5">
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
        {ufsExibidas.map((uf) => {
          const quantidade = contagemPorUf.get(uf) || 0;
          const selecionada = ufSelecionada === uf;

          return (
            <button
              key={uf}
              type="button"
              onClick={() => onSelecionarUf(uf)}
              className={`rounded-2xl border p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${classeRiscoPorQuantidade(
                quantidade,
              )} ${selecionada ? "ring-2 ring-blue-600 ring-offset-2" : ""}`}
            >
              <span className="block font-mono text-lg font-black">{uf}</span>

              <span className="mt-1 block truncate text-xs font-semibold">
                {NOMES_UF[uf]}
              </span>

              <span className="mt-3 block font-mono text-[10px] uppercase tracking-widest">
                {quantidade} alerta(s)
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}