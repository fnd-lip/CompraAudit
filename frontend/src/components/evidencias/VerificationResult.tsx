import type { Evidencia } from "../../types/evidencia";
import { Badge } from "../ui/Badge";
import { reduzirHash } from "../../utils/reduceHash";

type VerificationResultProps = {
  evidencia: Evidencia | null;
};

export function VerificationResult({ evidencia }: VerificationResultProps) {
  if (!evidencia) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-800">
        Evidência não encontrada.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-green-200 bg-green-50 p-5">
      <Badge tipo="sucesso">Evidência encontrada</Badge>

      <div className="mt-4 space-y-2 text-sm text-slate-700">
        <p>Identificador: {evidencia.identificador}</p>
        <p>Órgão: {evidencia.contratacao.orgao}</p>
        <p>Hash: {reduzirHash(evidencia.hashDados)}</p>
        <p>Status: {evidencia.status}</p>
      </div>
    </div>
  );
}