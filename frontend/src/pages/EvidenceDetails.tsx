import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import type { Evidencia } from "../types/evidencia";
import { Card } from "../components/ui/Card";
import { HashBlock } from "../components/evidencias/HashBlock";
import { buscarEvidenciaPorId } from "../services/evidenciasService";
import { formatarMoeda } from "../utils/formatCurrency";
import { reduzirHash } from "../utils/reduceHash";
import { EXPLORER_URL } from "../services/contracts";

export function EvidenceDetails() {
  const { id } = useParams();
  const [evidencia, setEvidencia] = useState<Evidencia | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  // busca os detalhes da evidencia no backend 
  useEffect(() => {
    async function carregarEvidencia() {
      if (!id) {
        setErro("Identificador da evidência não informado.");
        setCarregando(false);
        return;
      }

      try {
        const resposta = await buscarEvidenciaPorId(id);
        setEvidencia(resposta);
      } catch {
        setErro("Evidência não encontrada.");
      } finally {
        setCarregando(false);
      }
    }

    carregarEvidencia();
  }, [id]);

  if (carregando) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-slate-950">
          Carregando evidência...
        </h1>
      </div>
    );
  }

  if (erro || !evidencia) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-slate-950">
          Evidência não encontrada
        </h1>

        <p className="mt-2 text-slate-600">{erro}</p>

        <Link className="mt-6 inline-flex text-blue-600" to="/historico">
          Voltar ao histórico
        </Link>
      </div>
    );
  }

  const linkTransacao = evidencia.hashTransacao
    ? `${EXPLORER_URL}/tx/${evidencia.hashTransacao}`
    : "";

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
          <p>Contrato: {reduzirHash(evidencia.enderecoContrato || "")}</p>
          <p>Status: {evidencia.status}</p>
        </div>

        {linkTransacao && (
          <a
            href={linkTransacao}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100"
          >
            Abrir transação no explorador
          </a>
        )}

        <div className="mt-6">
          <HashBlock hash={evidencia.hashDados} />
        </div>
      </Card>
    </div>
  );
}