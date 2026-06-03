import type { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { buscarContratacaoPncp } from "../services/pncpService";
import { gerarHash, prepararDadosParaHash } from "../services/hashService";
import { formatarEvidencia } from "../utils/evidenciaUtils";
import { obterParametro } from "../utils/requestUtils";

// busca uma evidência pública por id, identificador ou hash 
async function buscarEvidenciaPublica(consulta: string) {
  return prisma.evidencia.findFirst({
    where: {
      OR: [{ id: consulta }, { identificador: consulta }, { hashDados: consulta }],
    },
    orderBy: { dataRegistro: "desc" },
  });
}

// retorna uma evidência pública sem exigir login 
export async function consultarEvidenciaPublica(
  request: Request,
  response: Response
) {
  const consulta = obterParametro(request.params.consulta);

  if (!consulta) {
    response.status(400).json({ mensagem: "Consulta não informada." });
    return;
  }

  const evidencia = await buscarEvidenciaPublica(consulta);

  if (!evidencia) {
    response.status(404).json({ mensagem: "Evidência não encontrada." });
    return;
  }

  response.json(formatarEvidencia(evidencia));
}

// compara a evidência salva com os dados atuais da fonte pública
export async function verificarEvidenciaPublica(
  request: Request,
  response: Response
) {
  const consulta = obterParametro(request.params.consulta);

  if (!consulta) {
    response.status(400).json({ mensagem: "Consulta não informada." });
    return;
  }

  const evidencia = await buscarEvidenciaPublica(consulta);

  if (!evidencia) {
    response.status(404).json({ mensagem: "Evidência não encontrada." });
    return;
  }

  /* consulta novamente os dados atuais da fonte pública */
  const dadosAtuais = await buscarContratacaoPncp(evidencia.identificador);

  /* calcula o hash atual usando os mesmos campos normalizados */
  const dadosParaHashAtual = prepararDadosParaHash(dadosAtuais);
  const hashAtual = gerarHash(dadosParaHashAtual);

  /* compara o hash salvo com o hash calculado agora */
  const status =
    hashAtual === evidencia.hashDados ? "COMPATIVEL" : "DIVERGENTE";

  const mensagem =
    status === "COMPATIVEL"
      ? "Os dados atuais continuam compatíveis com a evidência registrada."
      : "Foi detectada divergência entre os dados atuais e a evidência registrada.";

  response.json({
    status,
    mensagem,
    evidencia: formatarEvidencia(evidencia),
    hashSalvo: evidencia.hashDados,
    hashAtual,
    dadosAtuais,
    dadosParaHashAtual,
  });
}