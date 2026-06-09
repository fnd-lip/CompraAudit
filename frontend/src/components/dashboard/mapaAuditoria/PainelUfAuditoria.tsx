import { NOMES_UF } from "./constantesMapaAuditoria";
import type { SugestaoMapaAuditoria } from "./tiposMapaAuditoria";
import { formatarMoeda, rotuloRiscoPorQuantidade } from "./utilsMapaAuditoria";

type PainelUfAuditoriaProps = {
  ufSelecionada: string | null;
  sugestoesDaUf: SugestaoMapaAuditoria[];
};

export function PainelUfAuditoria({
  ufSelecionada,
  sugestoesDaUf,
}: PainelUfAuditoriaProps) {
  return (
    <aside className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
      {!ufSelecionada ? (
        <div className="flex h-full min-h-64 flex-col justify-center text-center">
          <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-400">
            painel de inspeção
          </p>

          <h3 className="mt-2 font-display text-lg font-extrabold text-slate-900">
            Selecione uma UF
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            Clique em um estado para visualizar as contratações de maior risco
            identificadas no PNCP
          </p>
        </div>
      ) : (
        <div>
          <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-400">
            UF selecionada
          </p>

          <h3 className="mt-1 font-display text-xl font-extrabold text-slate-950">
            {NOMES_UF[ufSelecionada]} ({ufSelecionada})
          </h3>

          <p className="mt-1 text-sm font-semibold text-slate-500">
            {rotuloRiscoPorQuantidade(sugestoesDaUf.length)}
          </p>

          <div className="mt-5 space-y-3">
            {sugestoesDaUf.length === 0 ? (
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-500">
                Nenhuma contratação de risco encontrada para esta UF no recorte
                atual
              </div>
            ) : (
              sugestoesDaUf.map((sugestao) => (
                <div
                  key={sugestao.identificador}
                  className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
                >
                  <p className="font-mono text-[11px] font-bold text-blue-700">
                    {sugestao.identificador}
                  </p>

                  <p className="mt-2 text-sm font-bold text-slate-900">
                    {sugestao.orgao}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {sugestao.objeto}
                  </p>

                  <div className="mt-3 flex items-center justify-between gap-3 text-xs">
                    <span className="rounded-full bg-white px-3 py-1 font-semibold text-slate-600">
                      {sugestao.modalidade}
                    </span>

                    <span className="font-mono font-black text-slate-900">
                      {formatarMoeda(sugestao.valor)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </aside>
  );
}
