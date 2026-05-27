import { CheckCircle2, Database, Layers, ShieldCheck } from "lucide-react";

export function HomeProofPreview() {
  return (
    <section className="bg-slate-50 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="font-mono text-xs font-bold uppercase tracking-widest text-blue-600">
                prova verificável
              </p>

              <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-slate-950">
                O CompraAudit separa dados completos e prova criptográfica.
              </h2>

              <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">
                Os dados detalhados da contratação ficam off-chain para consulta
                e auditoria. A blockchain guarda a prova matemática, permitindo
                verificar depois se os dados continuam compatíveis.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 font-mono text-xs font-bold uppercase tracking-widest text-emerald-700">
              {/* exibe o estado visual da prova */}
              <CheckCircle2 className="h-4 w-4" />
              integridade comprovável
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  {/* exibe o ícone dos dados off-chain */}
                  <Database className="h-5 w-5" />
                </div>

                <div>
                  <h3 className="font-display text-lg font-extrabold text-slate-950">
                    Dados Off-Chain
                  </h3>

                  <p className="text-xs text-slate-500">
                    informações completas para leitura e auditoria
                  </p>
                </div>
              </div>

              <div className="space-y-3 rounded-2xl bg-white p-5">
                <LinhaPreview rotulo="identificador" valor="PNCP-2026-0001" />
                <LinhaPreview rotulo="órgão" valor="Ministério da Educação" />
                <LinhaPreview rotulo="valor" valor="R$ 245.000,00" />
                <LinhaPreview rotulo="modalidade" valor="Pregão eletrônico" />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  {/* exibe o ícone da prova on-chain */}
                  <Layers className="h-5 w-5" />
                </div>

                <div>
                  <h3 className="font-display text-lg font-extrabold text-slate-950">
                    Prova On-Chain
                  </h3>

                  <p className="text-xs text-slate-500">
                    hash, contrato e transação verificáveis
                  </p>
                </div>
              </div>

              <div className="rounded-2xl bg-slate-950 p-5 text-white">
                <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  hash registrado
                </p>

                <div className="mt-3 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 font-mono text-xs font-bold text-emerald-300">
                  {/* exibe um exemplo visual de hash */}
                  0xba5c...3e7ae917
                </div>

                <div className="my-5 h-px bg-slate-800" />

                <div className="flex items-center gap-2 text-emerald-300">
                  {/* exibe o status da comparação */}
                  <ShieldCheck className="h-4 w-4" />

                  <span className="font-mono text-xs font-bold uppercase tracking-widest">
                    hash compatível com a consulta atual
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

type LinhaPreviewProps = {
  rotulo: string;
  valor: string;
};

function LinhaPreview({ rotulo, valor }: LinhaPreviewProps) {
  return (
    <div className="grid grid-cols-[130px_1fr] border-b border-slate-100 py-3 last:border-b-0">
      {/* exibe o rótulo do dado */}
      <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-400">
        {rotulo}
      </span>

      {/* exibe o valor do dado */}
      <strong className="text-sm font-semibold text-slate-900">{valor}</strong>
    </div>
  );
}