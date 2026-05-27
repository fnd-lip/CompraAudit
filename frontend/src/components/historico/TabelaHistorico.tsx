import { Link } from "react-router-dom";
import { Eye, SearchX } from "lucide-react";
import type { Evidencia, StatusEvidencia } from "../../types/evidencia";
import { Badge } from "../ui/Badge";
import { formatarMoeda } from "../../utils/formatCurrency";
import { reduzirHash } from "../../utils/reduceHash";

type TabelaHistoricoProps = {
  evidencias: Evidencia[];
};

export function TabelaHistorico({ evidencias }: TabelaHistoricoProps) {
  if (evidencias.length === 0) {
    return (
      <div className="flex min-h-75 items-center justify-center rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div>
          <SearchX className="mx-auto h-12 w-12 text-slate-300" />

          <h2 className="mt-5 font-display text-xl font-extrabold text-slate-950">
            Nenhuma evidência encontrada
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-slate-500">
            Ajuste os filtros ou registre uma nova auditoria para visualizar
            evidências criptográficas nesta área.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 border-b border-slate-100 pb-5">
        <h2 className="font-mono text-lg font-bold uppercase tracking-[0.25em] text-slate-950">
          assinaturas ativas
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Localizamos {evidencias.length} evidência
          {evidencias.length === 1 ? "" : "s"} criptográfica
          {evidencias.length === 1 ? "" : "s"}.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-245 border-collapse">
          <thead>
            <tr className="border-b border-slate-200">
              <CabecalhoTabela texto="data do audit" />
              <CabecalhoTabela texto="id contratação" />
              <CabecalhoTabela texto="órgão" />
              <CabecalhoTabela texto="valor" />
              <CabecalhoTabela texto="sha-256 resumo" />
              <CabecalhoTabela texto="status" />
              <CabecalhoTabela texto="inspeção" alinhamento="right" />
            </tr>
          </thead>

          <tbody>
            {evidencias.map((evidencia) => (
              <tr
                key={evidencia.id}
                className="border-b border-slate-100 transition hover:bg-slate-50"
              >
                <td className="py-4 pr-4 text-sm text-slate-600">
                  {formatarDataAuditoria(evidencia.dataRegistro)}
                </td>

                <td className="py-4 pr-4">
                  <span className="rounded-md border border-slate-200 bg-slate-50 px-3 py-1 font-mono text-xs font-bold text-slate-700">
                    {evidencia.identificador}
                  </span>
                </td>

                <td className="max-w-65 truncate py-4 pr-4 text-sm font-bold text-slate-950">
                  {evidencia.contratacao?.orgao || "não informado"}
                </td>

                <td className="py-4 pr-4 text-sm font-extrabold text-slate-950">
                  {formatarMoeda(evidencia.contratacao?.valor || 0)}
                </td>

                <td className="py-4 pr-4 font-mono text-xs text-slate-400">
                  {reduzirHash(evidencia.hashDados)}
                </td>

                <td className="py-4 pr-4">
                  <StatusHistorico status={evidencia.status} />
                </td>

                <td className="py-4 text-right">
                  <Link
                    to={`/evidencias/${evidencia.id}`}
                    className="inline-flex items-center justify-center rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-bold text-blue-700 transition hover:bg-blue-100"
                  >
                    {/* abre os detalhes da evidência */}
                    Detalhes
                    <Eye className="ml-2 h-3.5 w-3.5" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

type CabecalhoTabelaProps = {
  texto: string;
  alinhamento?: "left" | "right";
};

function CabecalhoTabela({ texto, alinhamento = "left" }: CabecalhoTabelaProps) {
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

type StatusHistoricoProps = {
  status: StatusEvidencia;
};

function StatusHistorico({ status }: StatusHistoricoProps) {
  const tipo =
    status === "DIVERGENTE"
      ? "erro"
      : status === "PENDENTE"
        ? "alerta"
        : "sucesso";

  const texto =
    status === "REGISTRADA"
      ? "Registrado"
      : status === "COMPATIVEL"
        ? "Compatível"
        : status === "DIVERGENTE"
          ? "Divergente"
          : "Pendente";

  return <Badge tipo={tipo}>{texto}</Badge>;
}

function formatarDataAuditoria(data: string) {
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