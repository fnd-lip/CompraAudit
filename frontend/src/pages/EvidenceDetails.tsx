import { Link, useParams } from "react-router-dom";
import { Card } from "../components/ui/Card";
import { HashBlock } from "../components/evidencias/HashBlock";
import { buscarEvidenciaPorId } from "../services/evidenciasService";
import { formatarMoeda } from "../utils/formatCurrency";
import { reduzirHash } from "../utils/reduceHash";

export function EvidenceDetails() {
  const { id } = useParams();
  const evidencia = id ? buscarEvidenciaPorId(id) : null;

  if (!evidencia) {
    return (
      <div>
        <h1 className="text-3xl font-bold">Evidência não encontrada</h1>

        <Link className="mt-6 inline-flex text-blue-600" to="/historico">
          Voltar ao histórico
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-950">
        Detalhes da Evidência
      </h1>

      <p className="mt-2 text-slate-600">
        Consulte os dados off-chain e a prova registrada on-chain.
      </p>

      <Card className="mt-8">
        <h2 className="text-xl font-bold">Contratação</h2>

        <div className="mt-4 grid gap-3 text-sm text-slate-700">
          <p>Identificador: {evidencia.identificador}</p>
          <p>Órgão: {evidencia.contratacao.orgao}</p>
          <p>Objeto: {evidencia.contratacao.objeto}</p>
          <p>Valor: {formatarMoeda(evidencia.contratacao.valor)}</p>
          <p>Modalidade: {evidencia.contratacao.modalidade}</p>
          <p>Carteira: {reduzirHash(evidencia.carteiraRegistradora || "")}</p>
          <p>Transação: {reduzirHash(evidencia.hashTransacao || "")}</p>
        </div>

        <div className="mt-6">
          <HashBlock hash={evidencia.hashDados} />
        </div>
      </Card>
    </div>
  );
}