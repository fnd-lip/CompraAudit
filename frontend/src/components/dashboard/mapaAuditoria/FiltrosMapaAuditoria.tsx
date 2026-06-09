import { REGIOES, type RegiaoMapa } from "./constantesMapaAuditoria";

type FiltrosMapaAuditoriaProps = {
  regiaoSelecionada: RegiaoMapa;
  buscaUf: string;
  onBuscaUfChange: (valor: string) => void;
  onSelecionarRegiao: (regiao: RegiaoMapa) => void;
  contarRegiao: (regiao: RegiaoMapa) => number;
};

export function FiltrosMapaAuditoria({
  regiaoSelecionada,
  buscaUf,
  onBuscaUfChange,
  onSelecionarRegiao,
  contarRegiao,
}: FiltrosMapaAuditoriaProps) {
  return (
    <>
      {/* filtros por região */}
      <div className="mb-5 flex flex-wrap gap-2">
        {(Object.keys(REGIOES) as RegiaoMapa[]).map((regiao) => {
          const selecionada = regiao === regiaoSelecionada;

          return (
            <button
              key={regiao}
              type="button"
              onClick={() => onSelecionarRegiao(regiao)}
              className={`rounded-xl border px-4 py-2 font-mono text-xs font-bold transition ${
                selecionada
                  ? "border-slate-950 bg-slate-950 text-white"
                  : "border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:text-blue-700"
              }`}
            >
              {regiao}{" "}
              <span className="ml-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-500">
                {contarRegiao(regiao)}
              </span>
            </button>
          );
        })}
      </div>

      {/* busca e legenda do mapa */}
      <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <input
          value={buscaUf}
          onChange={(evento) => onBuscaUfChange(evento.target.value)}
          placeholder="Pesquisar UF. Ex: PA"
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/10 lg:max-w-xs"
        />

        <div className="flex flex-wrap gap-3 text-xs text-slate-500">
          <span className="inline-flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-amber-400" />
            Alerta PNCP
          </span>

          <span className="inline-flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-blue-500" />
            Registrada na blockchain
          </span>

          <span className="inline-flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-emerald-500" />
            Ambos
          </span>

          <span className="inline-flex items-center gap-2">
            <span className="h-3 w-3 rounded-full border border-slate-300 bg-white" />
            Sem dados
          </span>
        </div>
      </div>
    </>
  );
}