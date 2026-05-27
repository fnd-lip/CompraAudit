import { Plus, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export function HomeHero() {
  const { usuarioLogado } = useAuth();

  const rotaAuditoria = usuarioLogado ? "/nova-auditoria" : "/login";

  return (
    <section className="relative overflow-hidden border-b border-slate-800 bg-slate-900 py-24 text-white sm:py-32">
      {/* cria a grade de fundo do topo */}
      <div className="hero-grid absolute inset-0 opacity-20" />

      {/* cria o brilho central do topo */}
      <div className="absolute left-1/2 top-1/4 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/10 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center space-x-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 font-mono text-xs text-blue-300">
            {/* exibe o indicador de verificabilidade */}
            <span className="h-2 w-2 rounded-full bg-blue-400" />

            {/* exibe o texto do indicador */}
            <span>
              Verificabilidade de compras governamentais sob tecnologia
              blockchain
            </span>
          </div>

          <h1 className="mb-6 font-display text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-6xl">
            Plataforma de Auditoria{" "}
            <span className="text-blue-500">Verificável</span> de Compras
            Públicas
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-lg font-light leading-relaxed text-slate-400 sm:text-xl">
            Garanta que os dados de licitações, empenhos e contratações
            governamentais permaneçam íntegros. Registre evidências
            criptográficas on-chain e audite alterações em segundos.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to={rotaAuditoria}
              className="group flex w-full items-center justify-center rounded-xl bg-blue-600 px-8 py-4 font-bold text-white shadow-lg shadow-blue-600/25 transition-all duration-200 hover:bg-blue-700 hover:shadow-blue-600/35 sm:w-auto"
            >
              {/* exibe a ação principal */}
              Iniciar Nova Auditoria

              <Plus className="ml-2 h-5 w-5 transition-transform group-hover:rotate-90" />
            </Link>

            <Link
              to="/verificar"
              className="group flex w-full items-center justify-center rounded-xl border border-slate-700 bg-slate-950 px-8 py-4 font-bold text-white transition-all duration-200 hover:bg-slate-900 sm:w-auto"
            >
              {/* exibe a ação de verificação pública */}
              Verificar Evidência Pública

              <Search className="ml-3 h-5 w-5 text-blue-400 transition-transform group-hover:scale-110" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}