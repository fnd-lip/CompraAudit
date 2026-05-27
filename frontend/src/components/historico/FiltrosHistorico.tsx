import { Filter } from "lucide-react";

type FiltrosHistoricoProps = {
  filtroIdentificador: string;
  filtroOrgao: string;
  filtroStatus: string;
  onFiltroIdentificadorChange: (valor: string) => void;
  onFiltroOrgaoChange: (valor: string) => void;
  onFiltroStatusChange: (valor: string) => void;
};

export function FiltrosHistorico({
  filtroIdentificador,
  filtroOrgao,
  filtroStatus,
  onFiltroIdentificadorChange,
  onFiltroOrgaoChange,
  onFiltroStatusChange,
}: FiltrosHistoricoProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-5">
        <Filter className="h-5 w-5 text-blue-600" />

        <h2 className="font-display text-lg font-extrabold text-slate-950">
          Filtros de Pesquisa
        </h2>
      </div>

      <div className="space-y-5">
        <div>
          <label className="mb-2 block font-mono text-[10px] font-bold uppercase tracking-widest text-slate-400">
            contrato / processo nº
          </label>

          <input
            value={filtroIdentificador}
            onChange={(evento) =>
              onFiltroIdentificadorChange(evento.target.value)
            }
            placeholder="Ex: PNCP-2026-0001"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/10"
          />
        </div>

        <div>
          <label className="mb-2 block font-mono text-[10px] font-bold uppercase tracking-widest text-slate-400">
            órgão responsável
          </label>

          <input
            value={filtroOrgao}
            onChange={(evento) => onFiltroOrgaoChange(evento.target.value)}
            placeholder="Ex: Ministério"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/10"
          />
        </div>

        <div>
          <label className="mb-2 block font-mono text-[10px] font-bold uppercase tracking-widest text-slate-400">
            situação do registro
          </label>

          <select
            value={filtroStatus}
            onChange={(evento) => onFiltroStatusChange(evento.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/10"
          >
            <option value="">Ver todos</option>
            <option value="REGISTRADA">Registrada</option>
            <option value="COMPATIVEL">Compatível</option>
            <option value="DIVERGENTE">Divergente</option>
            <option value="PENDENTE">Pendente</option>
          </select>
        </div>

        <div className="border-t border-slate-100 pt-5">
          <p className="text-xs leading-6 text-slate-400">
            <strong className="font-mono uppercase tracking-widest text-slate-500">
              mapeador:
            </strong>{" "}
            mostramos os registros salvos no backend e suas provas associadas à
            blockchain.
          </p>
        </div>
      </div>
    </div>
  );
}