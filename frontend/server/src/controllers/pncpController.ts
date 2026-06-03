import type { Request, Response } from "express";
import { buscarContratacaoPncp } from "../services/pncpService";
import { gerarHash, prepararDadosParaHash } from "../services/hashService";
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

// consulta a contratação no PNCP, normaliza os dados e gera o hash 
export async function consultarContratacaoPncp(
  request: Request,
  response: Response
) {
  try {
    const identificador = obterIdentificadorConsulta(request);

    if (!identificador) {
      response.status(400).json({ mensagem: "Identificador não informado." });
      return;
    }

    const contratacao = await buscarContratacaoPncp(identificador);
    const dadosParaHash = prepararDadosParaHash(contratacao);
    const hashDados = gerarHash(dadosParaHash);

    response.json({
      contratacao,
      dadosParaHash,
      hashDados,
    });
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
  response: Response
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

  const dadosParaHash = prepararDadosParaHash(contratacao);
  const hashDados = gerarHash(dadosParaHash);

  response.json({
    contratacao,
    dadosParaHash,
    hashDados,
  });
}