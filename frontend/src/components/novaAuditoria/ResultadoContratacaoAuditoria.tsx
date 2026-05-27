import { CheckCircle2, ExternalLink, FileCheck2, Layers } from "lucide-react";
import type { Contratacao } from "../../types/contratacao";
import { ENDERECO_CONTRATO, EXPLORER_URL } from "../../services/contracts";
import { formatarMoeda } from "../../utils/formatCurrency";
import { reduzirHash } from "../../utils/reduceHash";
import { Button } from "../ui/Button";

type ResultadoContratacaoAuditoriaProps = {
  contratacao: Contratacao;
  hashDados: string;
  registrando: boolean;
  onRegistrar: () => void;
};

export function ResultadoContratacaoAuditoria({
  contratacao,
  hashDados,
  registrando,
  onRegistrar,
}: ResultadoContratacaoAuditoriaProps) {
  const linkContrato = ENDERECO_CONTRATO
    ? `${EXPLORER_URL}/address/${ENDERECO_CONTRATO}`
    : "";

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-900 shadow-sm">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />

          <div>
            <h2 className="font-mono text-sm font-bold uppercase tracking-widest">
              dados oficiais localizados
            </h2>

            <p className="mt-2 text-sm leading-7">
              A contratação foi consultada e já possui uma impressão digital
              pronta para registro em blockchain.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <FileCheck2 className="h-5 w-5 text-blue-600" />

              <h2 className="font-display text-lg font-extrabold text-slate-950">
                Dados Detalhados da Contratação
              </h2>
            </div>

            <span className="rounded-md border border-slate-200 bg-slate-50 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-slate-400">
              off-chain
            </span>
          </div>

          <div className="rounded-2xl bg-slate-50 p-5">
            <LinhaDado rotulo="identificador" valor={contratacao.identificador} />
            <LinhaDado rotulo="órgão" valor={contratacao.orgao} />
            <LinhaDado rotulo="objeto" valor={contratacao.objeto} />
            <LinhaDado
              rotulo="valor"
              valor={formatarMoeda(contratacao.valor)}
            />
            <LinhaDado rotulo="modalidade" valor={contratacao.modalidade} />
            <LinhaDado
              rotulo="data publicação"
              valor={contratacao.dataPublicacao || "não informada"}
            />
            <LinhaDado rotulo="fonte" valor={contratacao.fonte} />
          </div>

          <div className="mt-6 border-t border-slate-100 pt-5">
            <p className="mb-2 font-mono text-[10px] font-bold uppercase tracking-widest text-slate-400">
              impressão digital computada localmente
            </p>

            <div className="break-all rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 font-mono text-xs font-bold text-blue-700">
              {hashDados}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <Layers className="h-5 w-5 text-blue-600" />

              <h2 className="font-display text-lg font-extrabold text-slate-950">
                Prova Criptográfica
              </h2>
            </div>

            <span className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-emerald-700">
              pronta para registro
            </span>
          </div>

          <p className="text-sm leading-7 text-slate-600">
            O contrato inteligente grava apenas a prova matemática dos dados. Os
            detalhes completos permanecem fora da blockchain para consulta e
            auditoria.
          </p>

          <div className="mt-6 rounded-2xl bg-slate-950 p-5 text-white">
            <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-400">
              hash sha-256 da evidência
            </p>

            <div className="mt-3 break-all rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 font-mono text-xs font-bold text-emerald-300">
              {hashDados}
            </div>

            <div className="my-5 h-px bg-slate-800" />

            <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-400">
              contrato Sepolia
            </p>

            <p className="mt-2 font-mono text-xs font-bold text-slate-200">
              {reduzirHash(ENDERECO_CONTRATO)}
            </p>
          </div>

          {linkContrato && (
            <a
              href={linkContrato}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center font-mono text-xs font-bold text-blue-600 hover:underline"
            >
              visualizar contrato no explorador
              <ExternalLink className="ml-1 h-3.5 w-3.5" />
            </a>
          )}

          <Button
            type="button"
            onClick={onRegistrar}
            disabled={registrando}
            className="mt-6 w-full"
          >
            {registrando ? "Registrando na Blockchain..." : "Registrar Prova On-chain"}
          </Button>
        </div>
      </div>
    </div>
  );
}

type LinhaDadoProps = {
  rotulo: string;
  valor: string;
};

function LinhaDado({ rotulo, valor }: LinhaDadoProps) {
  return (
    <div className="grid grid-cols-[140px_1fr] border-b border-slate-200 py-3 last:border-b-0">
      <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-400">
        {rotulo}
      </span>

      <strong className="text-sm font-semibold text-slate-900">
        {valor || "não informado"}
      </strong>
    </div>
  );
}