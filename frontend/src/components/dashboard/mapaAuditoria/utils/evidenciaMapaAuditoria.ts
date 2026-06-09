import type { Evidencia } from "../../../../types/evidencia";
import { lerCampoTexto } from "./textoMapaAuditoria";

function obterRegistroEvidencia(evidencia: Evidencia): Record<string, unknown> {
  return evidencia as Record<string, unknown>;
}

function obterObjetoContratacao(evidencia: Evidencia): Record<string, unknown> {
  const registro = obterRegistroEvidencia(evidencia);
  const contratacao = registro.contratacao;

  if (contratacao && typeof contratacao === "object") {
    return contratacao as Record<string, unknown>;
  }

  return {};
}

function lerCampoComoTexto(
  objeto: Record<string, unknown>,
  chaves: string[],
): string {
  for (const chave of chaves) {
    const valor = objeto[chave];

    if (typeof valor === "string" && valor.trim()) {
      return valor.trim();
    }

    if (typeof valor === "number") {
      return String(valor);
    }
  }

  return "";
}

// considera on-chain quando existe hash de transação ou status registrada
export function evidenciaEstaNaBlockchain(evidencia: Evidencia): boolean {
  const registro = obterRegistroEvidencia(evidencia);

  const status =
    typeof registro.status === "string" ? registro.status.toUpperCase() : "";

  const hashTransacao = lerCampoTexto(registro, [
    "hashTransacao",
    "transactionHash",
    "txHash",
  ]);

  return Boolean(hashTransacao) || status.includes("REGISTRADA");
}

// id interno usado para abrir /evidencias/:id
export function obterIdEvidencia(evidencia: Evidencia): string {
  const registro = obterRegistroEvidencia(evidencia);

  return lerCampoComoTexto(registro, ["id", "_id"]);
}

// identificador oficial da contratação
export function obterIdentificadorEvidencia(evidencia: Evidencia): string {
  const registro = obterRegistroEvidencia(evidencia);
  const contratacao = obterObjetoContratacao(evidencia);

  return (
    lerCampoTexto(registro, ["identificador"]) ||
    lerCampoTexto(contratacao, ["identificador"]) ||
    "Identificador não informado"
  );
}

// hash dos dados auditados - este é melhor para verificação pública do que o hash da transação
export function obterHashDadosEvidencia(evidencia: Evidencia): string {
  const registro = obterRegistroEvidencia(evidencia);

  return lerCampoTexto(registro, ["hashDados", "hash", "hashEvidencia"]);
}

// hash da transação na Sepolia - serve para rastrear a transação não como identificador principal
export function obterHashTransacaoEvidencia(evidencia: Evidencia): string {
  const registro = obterRegistroEvidencia(evidencia);

  return lerCampoTexto(registro, [
    "hashTransacao",
    "transactionHash",
    "txHash",
  ]);
}

export function obterOrgaoEvidencia(evidencia: Evidencia): string {
  const contratacao = obterObjetoContratacao(evidencia);

  return lerCampoTexto(contratacao, ["orgao"]) || "Órgão não informado";
}