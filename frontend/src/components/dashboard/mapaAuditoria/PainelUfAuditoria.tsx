import type { Evidencia } from "../../../types/evidencia";
import { NOMES_UF } from "./constantesMapaAuditoria";
import type { SugestaoMapaAuditoria } from "./tiposMapaAuditoria";
import {
  obterHashTransacaoEvidencia,
  obterIdentificadorEvidencia,
} from "./utils/evidenciaMapaAuditoria";
import {
  formatarMoeda,
  rotuloRiscoPorQuantidade,
} from "./utils/formatadoresMapaAuditoria";
type PainelUfAuditoriaProps = {
  ufSelecionada: string | null;
  alertasDaUf: SugestaoMapaAuditoria[];
  evidenciasDaUf: Evidencia[];
};

export function PainelUfAuditoria({
  ufSelecionada,
  alertasDaUf,
  evidenciasDaUf,
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
            Clique em um estado no mapa para visualizar alertas PNCP e
            evidências registradas na blockchain.
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
            {rotuloRiscoPorQuantidade(
              alertasDaUf.length,
              evidenciasDaUf.length,
            )}
          </p>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4">
              <p className="font-mono text-[10px] font-bold uppercase text-amber-600">
                alertas PNCP
              </p>

              <p className="text-2xl font-black text-amber-900">
                {alertasDaUf.length}
              </p>
            </div>

            <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
              <p className="font-mono text-[10px] font-bold uppercase text-blue-600">
                blockchain
              </p>

              <p className="text-2xl font-black text-blue-950">
                {evidenciasDaUf.length}
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-4">
            {alertasDaUf.length > 0 && (
              <div>
                <p className="mb-2 font-mono text-[10px] font-bold uppercase tracking-widest text-amber-600">
                  Contratações com alerta PNCP
                </p>

                <div className="space-y-3">
                  {alertasDaUf.map((alerta) => (
                    <div
                      key={alerta.identificador}
                      className="rounded-2xl border border-amber-100 bg-amber-50 p-4"
                    >
                      <p className="font-mono text-[11px] font-bold text-amber-700">
                        {alerta.identificador}
                      </p>

                      <p className="mt-2 text-sm font-bold text-slate-900">
                        {alerta.orgao}
                      </p>

                      <p className="mt-1 text-xs text-slate-600">
                        {alerta.objeto}
                      </p>

                      <div className="mt-3 flex items-center justify-between gap-3 text-xs">
                        <span className="rounded-full bg-white px-3 py-1 font-semibold text-slate-600">
                          {alerta.modalidade}
                        </span>

                        <span className="font-mono font-black text-slate-900">
                          {formatarMoeda(alerta.valor)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {evidenciasDaUf.length > 0 && (
              <div>
                <p className="mb-2 font-mono text-[10px] font-bold uppercase tracking-widest text-blue-600">
                  Evidências registradas na blockchain
                </p>

                <div className="space-y-3">
                  {evidenciasDaUf.map((evidencia, indice) => {
                    const hashTransacao =
                      obterHashTransacaoEvidencia(evidencia);

                    return (
                      <div
                        key={`${obterIdentificadorEvidencia(
                          evidencia,
                        )}-${indice}`}
                        className="rounded-2xl border border-blue-100 bg-blue-50 p-4"
                      >
                        <p className="font-mono text-[11px] font-bold text-blue-700">
                          {obterIdentificadorEvidencia(evidencia)}
                        </p>

                        <p className="mt-2 text-sm font-bold text-blue-950">
                          Prova registrada on-chain
                        </p>

                        {hashTransacao && (
                          <p className="mt-1 break-all font-mono text-[11px] text-blue-700">
                            {hashTransacao}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {alertasDaUf.length === 0 && evidenciasDaUf.length === 0 && (
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-500">
                Nenhuma contratação de risco ou evidência registrada encontrada
                para esta UF no recorte atual.
              </div>
            )}
          </div>
        </div>
      )}
    </aside>
  );
}
