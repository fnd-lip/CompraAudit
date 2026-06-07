import type { Request, Response } from "express";
import { buscarContratacaoPncp } from "../services/pncpService";
import { gerarHash } from "../services/hashService";
import { obterParametro } from "../utils/requestUtils";
import type { Contratacao } from "../types";

// lê o identificador vindo por parâmetro de rota ou por query string
function obterIdentificadorConsulta(request: Request): string {
  const identificadorParametro = obterParametro(request.params.identificador);

  if (identificadorParametro) {
    return identificadorParametro;
  }

  const identificadorQuery = request.query.identificador;

  if (typeof identificadorQuery === "string") {
    return identificadorQuery;
  }

  if (
    Array.isArray(identificadorQuery) &&
    typeof identificadorQuery[0] === "string"
  ) {
    return identificadorQuery[0];
  }

  return "";
}

// melhora textos de exibição sem alterar datas e identificadores
function normalizarTextoExibicao(texto: string): string {
  return texto
    .replace(/\s+/g, " ")
    .replace(/para\s*fornecimento/gi, "para fornecimento")
    .replace(/,([^\s])/g, ", $1")
    .replace(/\.([^\s])/g, ". $1")
    .replace(/;([^\s])/g, "; $1")
    .replace(/([a-záéíóúàâêôãõç])([A-ZÁÉÍÓÚÀÂÊÔÃÕÇ])/g, "$1 $2")
    .replace(/\bÉA\b/g, "É A")
    .trim();
}

// garante que a contratação exibida esteja normalizada antes do hash
function normalizarContratacaoResposta(contratacao: Contratacao): Contratacao {
  return {
    ...contratacao,
    orgao: normalizarTextoExibicao(contratacao.orgao),
    objeto: normalizarTextoExibicao(contratacao.objeto),
    modalidade: contratacao.modalidade.trim(),
    dataPublicacao: contratacao.dataPublicacao.trim(),
    fonte: contratacao.fonte.trim(),
  };
}

// seleciona exatamente os campos exibidos que entram no hash
function prepararDadosParaHashDaResposta(contratacao: Contratacao) {
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

// garante que o hash use os mesmos dados normalizados exibidos na resposta
function prepararRespostaComHash(contratacao: Contratacao) {
  const contratacaoNormalizada = normalizarContratacaoResposta(contratacao);
  const dadosParaHash = prepararDadosParaHashDaResposta(contratacaoNormalizada);
  const hashDados = gerarHash(dadosParaHash);

  return {
    contratacao: contratacaoNormalizada,
    dadosParaHash,
    hashDados,
  };
}

// consulta a contratação no PNCP, normaliza os dados e gera o hash
export async function consultarContratacaoPncp(
  request: Request,
  response: Response,
) {
  try {
    const identificador = obterIdentificadorConsulta(request);

    if (!identificador) {
      response.status(400).json({ mensagem: "Identificador não informado." });
      return;
    }

    const contratacao = await buscarContratacaoPncp(identificador);

    response.json(prepararRespostaComHash(contratacao));
  } catch (erro) {
    response.status(404).json({
      mensagem:
        erro instanceof Error
          ? erro.message
          : "Erro ao consultar contratação no PNCP.",
    });
  }
}

/* gera hash para uma contratação já carregada pelo frontend */
export async function gerarHashContratacao(
  request: Request,
  response: Response,
) {
  const contratacao = request.body as Contratacao;

  if (
    !contratacao ||
    !contratacao.identificador ||
    !contratacao.orgao ||
    !contratacao.objeto ||
    !contratacao.modalidade ||
    !contratacao.dataPublicacao ||
    !contratacao.fonte
  ) {
    response.status(400).json({
      mensagem: "Contratação inválida para geração de hash.",
    });
    return;
  }

  response.json(prepararRespostaComHash(contratacao));
}