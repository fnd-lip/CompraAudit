import { ArrowRight, SearchCheck } from "lucide-react";
import { Link } from "react-router-dom";

export function HomeCallToAction() {
  return (
    <section className="bg-slate-50 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-slate-950 p-8 text-white shadow-sm">
          <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-center">
            <div>
              <p className="font-mono text-xs font-bold uppercase tracking-widest text-blue-300">
                comece a verificar
              </p>

              <h2 className="mt-3 font-display text-3xl font-extrabold">
                Registre uma evidência ou consulte uma prova pública.
              </h2>

              <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-400">
                O fluxo foi pensado para transformar uma consulta pública em uma
                evidência verificável, com hash, transação e comparação futura.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
              >
                {/* leva para iniciar auditoria */}
                Iniciar auditoria
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>

              <Link
                to="/verificar"
                className="inline-flex items-center justify-center rounded-xl border border-slate-700 bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
              >
                {/* leva para verificação pública */}
                Verificar prova
                <SearchCheck className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}