import type { Evidencia } from "../../../../types/evidencia";
import { lerCampoTexto } from "./textoMapaAuditoria";

function obterObjetoContratacao(evidencia: Evidencia): Record<string, unknown> {
  const registro = evidencia as Record<string, unknown>;
  const contratacao = registro.contratacao;

  if (contratacao && typeof contratacao === "object") {
    return contratacao as Record<string, unknown>;
  }

  return {};
}

// considera on-chain quando existe hash de transação ou status registrada
export function evidenciaEstaNaBlockchain(evidencia: Evidencia): boolean {
  const registro = evidencia as Record<string, unknown>;

  const status =
    typeof registro.status === "string" ? registro.status.toUpperCase() : "";

  const hashTransacao = lerCampoTexto(registro, [
    "hashTransacao",
    "transactionHash",
    "txHash",
  ]);

  return Boolean(hashTransacao) || status.includes("REGISTRADA");
}

// pega o identificador diretamente da evidência ou da contratação interna
export function obterIdentificadorEvidencia(evidencia: Evidencia): string {
  const registro = evidencia as Record<string, unknown>;
  const contratacao = obterObjetoContratacao(evidencia);

  return (
    lerCampoTexto(registro, ["identificador"]) ||
    lerCampoTexto(contratacao, ["identificador"]) ||
    "Identificador não informado"
  );
}

// pega o hash da transação salvo junto da evidência
export function obterHashTransacaoEvidencia(evidencia: Evidencia): string {
  const registro = evidencia as Record<string, unknown>;

  return lerCampoTexto(registro, [
    "hashTransacao",
    "transactionHash",
    "txHash",
  ]);
}