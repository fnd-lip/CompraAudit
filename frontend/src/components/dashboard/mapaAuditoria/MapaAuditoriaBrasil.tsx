import { FiltrosMapaAuditoria } from "./FiltrosMapaAuditoria";
import { GradeUfsMapaAuditoria } from "./GradeUfsMapaAuditoria";
import { PainelUfAuditoria } from "./PainelUfAuditoria";
import { useMapaAuditoria } from "./useMapaAuditoria";

export function MapaAuditoriaBrasil() {
  const {
    sugestoes,
    carregando,
    erro,
    regiaoSelecionada,
    ufSelecionada,
    buscaUf,
    contagemPorUf,
    ufsExibidas,
    sugestoesDaUf,
    setBuscaUf,
    setUfSelecionada,
    selecionarRegiao,
    contarRegiao,
  } = useMapaAuditoria();

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-400">
            painel territorial de auditoria
          </p>

          <h2 className="mt-1 font-display text-xl font-extrabold text-slate-950">
            Mapa Brasil de Auditorias PNCP
          </h2>

          <p className="mt-2 max-w-2xl text-sm text-slate-500">
            Visualize por UF as contratações diretas acima do limite de alerta e inspecione os itens de maior risco.
          </p>
        </div>

        <div className="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3">
          <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-blue-500">
            alertas ativos
          </p>

          <p className="text-2xl font-black text-blue-950">
            {sugestoes.length}
          </p>
        </div>
      </div>

      <FiltrosMapaAuditoria
        regiaoSelecionada={regiaoSelecionada}
        buscaUf={buscaUf}
        onBuscaUfChange={setBuscaUf}
        onSelecionarRegiao={selecionarRegiao}
        contarRegiao={contarRegiao}
      />

      {carregando ? (
        <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500">
          Carregando mapa de auditoria...
        </div>
      ) : erro ? (
        <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-semibold text-red-700">
          {erro}
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <GradeUfsMapaAuditoria
            ufsExibidas={ufsExibidas}
            contagemPorUf={contagemPorUf}
            ufSelecionada={ufSelecionada}
            onSelecionarUf={setUfSelecionada}
          />

          <PainelUfAuditoria
            ufSelecionada={ufSelecionada}
            sugestoesDaUf={sugestoesDaUf}
          />
        </div>
      )}
    </section>
  );
}