import { ArrowRight, SearchX } from "lucide-react";
import { Link } from "react-router-dom";
import type { Evidencia } from "../../types/evidencia";
import { Badge } from "../ui/Badge";
import { formatarMoeda } from "../../utils/formatCurrency";
import { reduzirHash } from "../../utils/reduceHash";

type DashboardUltimasAuditoriasProps = {
  evidencias: Evidencia[];
};

export function DashboardUltimasAuditorias({
  evidencias,
}: DashboardUltimasAuditoriasProps) {
  const ultimas = evidencias.slice(0, 4);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-start justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="font-display text-xl font-extrabold text-slate-950">
            Últimas Auditorias Criptográficas
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Registros mais recentes salvos no CompraAudit.
          </p>
        </div>

        <Link
          to="/historico"
          className="inline-flex items-center font-mono text-xs font-bold text-blue-600 hover:underline"
        >
          Ver tudo
          <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </div>

      {ultimas.length === 0 ? (
        <div className="flex min-h-55 items-center justify-center text-center">
          <div>
            <SearchX className="mx-auto h-10 w-10 text-slate-300" />

            <h3 className="mt-4 font-display text-lg font-extrabold text-slate-950">
              Nenhuma auditoria registrada
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Crie sua primeira evidência em Nova Auditoria.
            </p>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-225 border-collapse">
            <thead>
              <tr className="border-b border-slate-200">
                <Cabecalho texto="timestamp" />
                <Cabecalho texto="contrato id" />
                <Cabecalho texto="órgão" />
                <Cabecalho texto="valor" />
                <Cabecalho texto="status" />
                <Cabecalho texto="sha-256 hash" />
                <Cabecalho texto="ação" alinhamento="right" />
              </tr>
            </thead>

            <tbody>
              {ultimas.map((evidencia) => (
                <tr
                  key={evidencia.id}
                  className="border-b border-slate-100 transition hover:bg-slate-50"
                >
                  <td className="py-4 pr-4 text-sm text-slate-600">
                    {formatarData(evidencia.dataRegistro)}
                  </td>

                  <td className="py-4 pr-4">
                    <span className="rounded-md bg-slate-100 px-3 py-1 font-mono text-xs font-bold text-slate-700">
                      {evidencia.identificador}
                    </span>
                  </td>

                  <td className="max-w-65 truncate py-4 pr-4 text-sm font-bold text-slate-950">
                    {evidencia.contratacao?.orgao || "não informado"}
                  </td>

                  <td className="py-4 pr-4 text-sm font-extrabold text-slate-950">
                    {formatarMoeda(evidencia.contratacao?.valor || 0)}
                  </td>

                  <td className="py-4 pr-4">
                    <Badge tipo="sucesso">
                      {evidencia.status === "REGISTRADA"
                        ? "Registrado"
                        : evidencia.status}
                    </Badge>
                  </td>

                  <td className="py-4 pr-4 font-mono text-xs text-slate-400">
                    {reduzirHash(evidencia.hashDados)}
                  </td>

                  <td className="py-4 text-right">
                    <Link
                      to={`/evidencias/${evidencia.id}`}
                      className="inline-flex items-center justify-center rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-bold text-blue-700 transition hover:bg-blue-100"
                    >
                      Visualizar Detalhes
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

type CabecalhoProps = {
  texto: string;
  alinhamento?: "left" | "right";
};

function Cabecalho({ texto, alinhamento = "left" }: CabecalhoProps) {
  return (
    <th
      className={`py-3 pr-4 font-mono text-[10px] font-bold uppercase tracking-widest text-slate-400 ${
        alinhamento === "right" ? "text-right" : "text-left"
      }`}
    >
      {texto}
    </th>
  );
}

function formatarData(data: string) {
  if (!data) {
    return "sem data";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(data));
}