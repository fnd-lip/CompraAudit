import type { Contratacao } from "../types/contratacao";
import { normalizarDados } from "../utils/normalizeData";

export async function gerarHashDosDados(dados: unknown): Promise<string> {
  const dadosNormalizados = normalizarDados(dados);
  const codificador = new TextEncoder();
  const dadosCodificados = codificador.encode(dadosNormalizados);
  const hashBuffer = await crypto.subtle.digest("SHA-256", dadosCodificados);

  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHexadecimal = hashArray
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");

  return `0x${hashHexadecimal}`;
}

export function prepararDadosParaHash(contratacao: Contratacao) {
  return {
    fonte: contratacao.fonte,
    identificador: contratacao.identificador,
    orgao: contratacao.orgao,
    objeto: contratacao.objeto,
    valor: contratacao.valor,
    modalidade: contratacao.modalidade,
    dataPublicacao: contratacao.dataPublicacao,
  };
}