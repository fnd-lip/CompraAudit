import { AlertTriangle } from "lucide-react";

export function HomeProblem() {
  return (
    <section className="bg-slate-50 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="grid gap-8 lg:grid-cols-[1fr_260px] lg:items-center">
            <div className="flex gap-5">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-amber-200 bg-amber-50 text-amber-600">
                {/* exibe o alerta do problema */}
                <AlertTriangle className="h-6 w-6" />
              </div>

              <div>
                <h2 className="font-display text-2xl font-extrabold text-slate-950">
                  O problema das alterações retroativas nos portais oficiais
                </h2>

                <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
                  Portais de transparência governamentais e APIs públicas são
                  frequentemente atualizados, mas também podem sofrer
                  indisponibilidade, correções ou mudanças retroativas. Sem um
                  histórico verificável, é difícil provar se um valor, órgão ou
                  objeto foi alterado depois da consulta original.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              {/* exibe o posicionamento da solução */}
              <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-400">
                CompraAudit solução
              </p>

              <p className="mt-3 font-display text-2xl font-extrabold text-blue-600">
                Integridade Trustless
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}