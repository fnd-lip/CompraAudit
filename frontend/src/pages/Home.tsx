import { Link } from "react-router-dom";
import { Database, Fingerprint, SearchCheck, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";

export function Home() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div>
          <span className="rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
            Auditoria verificável com blockchain
          </span>

          <h1 className="mt-6 text-5xl font-bold tracking-tight text-slate-950">
            Registre provas de integridade para compras públicas.
          </h1>

          <p className="mt-6 text-lg leading-8 text-slate-600">
            O CompraAudit consulta dados públicos de contratações, gera um hash
            dos dados retornados e registra essa evidência em blockchain para
            verificação posterior.
          </p>

          <div className="mt-8 flex gap-4">
            <Link
              to="/cadastro"
              className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Começar auditoria
            </Link>

            <Link
              to="/verificar"
              className="rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-800 hover:bg-slate-100"
            >
              Verificar evidência
            </Link>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="grid gap-4">
            <CardFluxo
              icone={<SearchCheck />}
              titulo="1. Consulte dados públicos"
              texto="Busque uma contratação pública por meio da API integrada ao backend."
            />

            <CardFluxo
              icone={<Fingerprint />}
              titulo="2. Gere o hash"
              texto="Os dados normalizados geram uma impressão digital criptográfica."
            />

            <CardFluxo
              icone={<ShieldCheck />}
              titulo="3. Registre on-chain"
              texto="O hash é registrado em blockchain com a carteira MetaMask."
            />

            <CardFluxo
              icone={<Database />}
              titulo="4. Verifique depois"
              texto="Compare o hash registrado com os dados atuais da fonte pública."
            />
          </div>
        </div>
      </div>
    </section>
  );
}

type CardFluxoProps = {
  icone: ReactNode;
  titulo: string;
  texto: string;
};

function CardFluxo({ icone, titulo, texto }: CardFluxoProps) {
  return (
    <div className="flex gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white">
        {icone}
      </div>

      <div>
        <h3 className="font-bold text-slate-950">{titulo}</h3>
        <p className="mt-1 text-sm leading-6 text-slate-600">{texto}</p>
      </div>
    </div>
  );
}