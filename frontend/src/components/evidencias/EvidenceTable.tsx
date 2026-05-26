import { Link } from "react-router-dom";
import type { Evidencia } from "../../types/evidencia";
import { formatarMoeda } from "../../utils/formatCurrency";
import { reduzirHash } from "../../utils/reduceHash";
import { Badge } from "../ui/Badge";

type EvidenceTableProps = {
  evidencias: Evidencia[];
};

export function EvidenceTable({ evidencias }: EvidenceTableProps) {
  if (evidencias.length === 0) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-500">
        Nenhuma evidência registrada ainda.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase tracking-widest text-slate-500">
          <tr>
            <th className="px-5 py-4">Identificador</th>
            <th className="px-5 py-4">Órgão</th>
            <th className="px-5 py-4">Valor</th>
            <th className="px-5 py-4">Hash</th>
            <th className="px-5 py-4">Status</th>
            <th className="px-5 py-4">Ação</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {evidencias.map((evidencia) => (
            <tr key={evidencia.id}>
              <td className="px-5 py-4">{evidencia.identificador}</td>
              <td className="px-5 py-4">{evidencia.contratacao.orgao}</td>
              <td className="px-5 py-4">
                {formatarMoeda(evidencia.contratacao.valor)}
              </td>
              <td className="px-5 py-4 font-mono">
                {reduzirHash(evidencia.hashDados)}
              </td>
              <td className="px-5 py-4">
                <Badge tipo="info">{evidencia.status}</Badge>
              </td>
              <td className="px-5 py-4">
                <Link
                  to={`/evidencias/${evidencia.id}`}
                  className="font-semibold text-blue-600 hover:text-blue-700"
                >
                  Abrir
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}