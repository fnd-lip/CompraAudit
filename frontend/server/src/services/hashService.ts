import crypto from "node:crypto";
import type { Contratacao } from "../types";

/* normaliza objetos para gerar sempre o mesmo hash */
export function normalizarDados(dados: unknown): string {
  return JSON.stringify(ordenarObjeto(dados));
}

/* ordena chaves para evitar hash diferente por causa da ordem do json */
function ordenarObjeto(valor: unknown): unknown {
  if (Array.isArray(valor)) {
    return valor.map(ordenarObjeto);
  }

  if (valor !== null && typeof valor === "object") {
    return Object.keys(valor as Record<string, unknown>)
      .sort()
      .reduce<Record<string, unknown>>((objetoOrdenado, chave) => {
        objetoOrdenado[chave] = ordenarObjeto(
          (valor as Record<string, unknown>)[chave]
        );

        return objetoOrdenado;
      }, {});
  }

  return valor;
}

/* seleciona os campos usados como prova da contratacao */
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

/* gera hash sha-256 no formato bytes32 */
export function gerarHash(dados: unknown): string {
  const dadosNormalizados = normalizarDados(dados);

  const hash = crypto
    .createHash("sha256")
    .update(dadosNormalizados)
    .digest("hex");

  return `0x${hash}`;
}