import type { Contratacao } from "../../types";
import { normalizarIdentificador } from "./identificadoresSugestoes";

// verifica se a modalidade indica contratação direta relevante para auditoria
export function possuiModalidadeDeRisco(contratacao: Contratacao): boolean {
  const modalidade = contratacao.modalidade.toLowerCase();

  return (
    modalidade.includes("dispensa") || modalidade.includes("inexigibilidade")
  );
}

// verifica se o valor da contratação passou do limite definido para alerta
export function possuiValorMinimo(
  contratacao: Contratacao,
  valorMinimo: number,
): boolean {
  return contratacao.valor >= valorMinimo;
}

// evita que o PNCP retorne sugestões repetidas no carrossel
export function removerContratacoesDuplicadas(
  contratacoes: Contratacao[],
): Contratacao[] {
  const identificadores = new Set<string>();

  return contratacoes.filter((contratacao) => {
    const identificador = normalizarIdentificador(contratacao.identificador);

    if (identificadores.has(identificador)) {
      return false;
    }

    identificadores.add(identificador);

    return true;
  });
}

// remove da lista as contratações que já possuem evidência salva no Prisma
export function removerContratacoesComEvidencia(
  contratacoes: Contratacao[],
  identificadoresComEvidencia: Set<string>,
): Contratacao[] {
  return contratacoes.filter((contratacao) => {
    const identificador = normalizarIdentificador(contratacao.identificador);

    return !identificadoresComEvidencia.has(identificador);
  });
}