import { Database, ExternalLink, Layers, ShieldCheck } from "lucide-react";
import type { ResultadoVerificacaoPublica } from "../../types/evidencia";
import { EXPLORER_URL } from "../../services/contracts";
import { reduzirHash } from "../../utils/reduceHash";

type CardsComparacaoVerificacaoProps = {
  resultado: ResultadoVerificacaoPublica;
};

const formatadorMoeda = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function CardsComparacaoVerificacao({
  resultado,
}: CardsComparacaoVerificacaoProps) {
  const evidencia = resultado.evidencia;
  const dados = resultado.dadosAtuais;

  const linkTransacao = evidencia.hashTransacao
    ? `${EXPLORER_URL}/tx/${evidencia.hashTransacao}`
    : "";

  const linkContrato = evidencia.enderecoContrato
    ? `${EXPLORER_URL}/address/${evidencia.enderecoContrato}`
    : "";

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              {/* exibe o ícone dos dados off-chain */}
              <Database className="h-5 w-5" />
            </div>

            <h2 className="font-display text-lg font-extrabold text-slate-950">
              Banco de Dados Off-Chain
            </h2>
          </div>

          <span className="rounded-md border border-slate-200 bg-slate-50 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-slate-400">
            dados completos
          </span>
        </div>

        <p className="mb-6 text-sm leading-7 text-slate-600">
          Os dados completos da contratação ficam armazenados fora da blockchain
          para permitir consulta, auditoria e leitura detalhada.
        </p>

        <div className="rounded-2xl bg-slate-50 p-5">
          <LinhaDado rotulo="identificador" valor={dados.identificador} />
          <LinhaDado rotulo="órgão" valor={dados.orgao} />
          <LinhaDado rotulo="valor" valor={formatadorMoeda.format(dados.valor)} />
          <LinhaDado rotulo="modalidade" valor={dados.modalidade} />
          <LinhaDado rotulo="fonte" valor={dados.fonte} />
          <LinhaDado
            rotulo="data publicação"
            valor={dados.dataPublicacao || "não informada"}
          />
        </div>

        <div className="mt-6 border-t border-slate-100 pt-5">
          <p className="mb-2 font-mono text-[10px] font-bold uppercase tracking-widest text-slate-400">
            hash calculado com os dados atuais
          </p>

          <div className="break-all rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 font-mono text-xs font-bold text-blue-700">
            {/* exibe o hash atual da fonte pública */}
            {resultado.hashAtual}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              {/* exibe o ícone da prova on-chain */}
              <Layers className="h-5 w-5" />
            </div>

            <h2 className="font-display text-lg font-extrabold text-slate-950">
              Ledger Blockchain On-Chain
            </h2>
          </div>

          <span className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-emerald-700">
            prova registrada
          </span>
        </div>

        <p className="mb-6 text-sm leading-7 text-slate-600">
          A blockchain guarda a prova matemática da auditoria: o hash da
          evidência, a transação e o endereço do contrato.
        </p>

        <div className="rounded-2xl bg-slate-950 p-5 text-white">
          <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-400">
            registro do contrato seguro
          </p>

          <p className="mt-2 break-all font-mono text-xs font-bold">
            {evidencia.enderecoContrato || "não informado"}
          </p>

          <div className="my-5 h-px bg-slate-800" />

          <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-400">
            hash imutável registrado
          </p>

          <div className="mt-3 break-all rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 font-mono text-xs font-bold text-emerald-300">
            {/* exibe o hash salvo originalmente */}
            {resultado.hashSalvo}
          </div>
        </div>

        <div className="mt-6 border-t border-slate-100 pt-5">
          <p className="mb-3 font-mono text-[10px] font-bold uppercase tracking-widest text-slate-400">
            rastreabilidade pública
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            {linkTransacao && (
              <a
                href={linkTransacao}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700"
              >
                {/* abre a transação no explorador */}
                Ver transação
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            )}

            {linkContrato && (
              <a
                href={linkContrato}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"
              >
                {/* abre o contrato no explorador */}
                Ver contrato
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            )}
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-800">
          <div className="flex items-center gap-2">
            {/* exibe o status da comparação */}
            <ShieldCheck className="h-4 w-4" />

            <span className="font-mono text-xs font-bold uppercase tracking-widest">
              {resultado.status === "COMPATIVEL"
                ? "100% autêntico e conforme"
                : "divergência entre os hashes"}
            </span>
          </div>

          <p className="mt-2 font-mono text-xs text-emerald-700">
            Transação: {reduzirHash(evidencia.hashTransacao || "")}
          </p>
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
    <div className="grid grid-cols-[150px_1fr] border-b border-slate-200 py-3 last:border-b-0">
      {/* exibe o rótulo do dado */}
      <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-400">
        {rotulo}:
      </span>

      {/* exibe o valor do dado */}
      <strong className="text-sm font-semibold text-slate-900">
        {valor || "não informado"}
      </strong>
    </div>
  );
}