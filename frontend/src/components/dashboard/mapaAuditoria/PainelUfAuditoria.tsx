import { Link } from "react-router-dom";
import type { Evidencia } from "../../../types/evidencia";
import { NOMES_UF } from "./constantesMapaAuditoria";
import type { SugestaoMapaAuditoria } from "./tiposMapaAuditoria";
import {
  obterHashDadosEvidencia,
  obterHashTransacaoEvidencia,
  obterIdEvidencia,
  obterIdentificadorEvidencia,
  obterOrgaoEvidencia,
} from "./utils/evidenciaMapaAuditoria";
import {
  formatarMoeda,
  rotuloRiscoPorQuantidade,
} from "./utils/formatadoresMapaAuditoria";

type PainelUfAuditoriaProps = {
  ufSelecionada: string | null;
  alertasDaUf: SugestaoMapaAuditoria[];
  evidenciasDaUf: Evidencia[];
  evidenciasOnChain: Evidencia[];
};

function CartaoEvidenciaBlockchain({ evidencia }: { evidencia: Evidencia }) {
  const idEvidencia = obterIdEvidencia(evidencia);
  const identificador = obterIdentificadorEvidencia(evidencia);
  const orgao = obterOrgaoEvidencia(evidencia);
  const hashDados = obterHashDadosEvidencia(evidencia);
  const hashTransacao = obterHashTransacaoEvidencia(evidencia);

  return (
    <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
      <p className="font-mono text-[11px] font-bold text-blue-700">
        {identificador}
      </p>

      <p className="mt-2 text-sm font-bold text-blue-950">
        Auditoria registrada na blockchain
      </p>

      <p className="mt-1 text-xs font-semibold text-slate-600">{orgao}</p>

      {hashDados && (
        <div className="mt-3 rounded-xl bg-white/70 p-3">
          <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-blue-600">
            hash da evidência
          </p>

          <p className="mt-1 break-all font-mono text-[11px] text-blue-900">
            {hashDados}
          </p>
        </div>
      )}

      {hashTransacao && (
        <div className="mt-3 rounded-xl bg-white/70 p-3">
          <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-500">
            transação Sepolia
          </p>

          <p className="mt-1 break-all font-mono text-[11px] text-slate-600">
            {hashTransacao}
          </p>
        </div>
      )}

      {idEvidencia && (
        <Link
          to={`/evidencias/${idEvidencia}`}
          className="mt-3 inline-flex rounded-xl bg-blue-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-blue-700"
        >
          Abrir detalhes da evidência
        </Link>
      )}
    </div>
  );
}

export function PainelUfAuditoria({
  ufSelecionada,
  alertasDaUf,
  evidenciasDaUf,
  evidenciasOnChain,
}: PainelUfAuditoriaProps) {
  const evidenciasExibidas = ufSelecionada ? evidenciasDaUf : evidenciasOnChain;

  return (
    <aside className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
      {!ufSelecionada ? (
        <div>
          <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-400">
            registros on-chain
          </p>

          <h3 className="mt-1 font-display text-xl font-extrabold text-slate-950">
            Auditorias registradas na blockchain
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            Estes são os registros que o CompraAudit já salvou como evidência
            on-chain. Clique em uma UF no mapa para filtrar por estado.
          </p>

          <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50 p-4">
            <p className="font-mono text-[10px] font-bold uppercase text-blue-600">
              total blockchain
            </p>

            <p className="text-2xl font-black text-blue-950">
              {evidenciasOnChain.length}
            </p>
          </div>

          <div className="mt-5 space-y-3">
            {evidenciasExibidas.length === 0 ? (
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-500">
                Nenhuma evidência registrada na blockchain foi encontrada.
              </div>
            ) : (
              evidenciasExibidas.map((evidencia, indice) => (
                <CartaoEvidenciaBlockchain
                  key={`${obterIdentificadorEvidencia(evidencia)}-${indice}`}
                  evidencia={evidencia}
                />
              ))
            )}
          </div>
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
            {rotuloRiscoPorQuantidade(alertasDaUf.length, evidenciasDaUf.length)}
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

            {evidenciasExibidas.length > 0 && (
              <div>
                <p className="mb-2 font-mono text-[10px] font-bold uppercase tracking-widest text-blue-600">
                  Auditorias já registradas
                </p>

                <div className="space-y-3">
                  {evidenciasExibidas.map((evidencia, indice) => (
                    <CartaoEvidenciaBlockchain
                      key={`${obterIdentificadorEvidencia(evidencia)}-${indice}`}
                      evidencia={evidencia}
                    />
                  ))}
                </div>
              </div>
            )}

            {alertasDaUf.length === 0 && evidenciasExibidas.length === 0 && (
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-500">
                Nenhuma contratação de risco ou auditoria registrada encontrada
                para esta UF no recorte atual.
              </div>
            )}
          </div>
        </div>
      )}
    </aside>
  );
}