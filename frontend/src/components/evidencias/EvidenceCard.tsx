import type { Evidencia } from "../../types/evidencia";
import { formatarMoeda } from "../../utils/formatCurrency";
import { reduzirHash } from "../../utils/reduceHash";
import { Badge } from "../ui/Badge";

type EvidenceCardProps = {
  evidencia: Evidencia;
};

export function EvidenceCard({ evidencia }: EvidenceCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-bold text-slate-950">
            {evidencia.contratacao.orgao}
          </h3>

          <p className="mt-1 line-clamp-2 text-sm text-slate-600">
            {evidencia.contratacao.objeto}
          </p>
        </div>

        <Badge tipo="info">{evidencia.status}</Badge>
      </div>

      <div className="mt-4 grid gap-2 text-sm text-slate-600">
        <p>Identificador: {evidencia.identificador}</p>
        <p>Valor: {formatarMoeda(evidencia.contratacao.valor)}</p>
        <p>Hash: {reduzirHash(evidencia.hashDados)}</p>
      </div>
    </div>
  );
}