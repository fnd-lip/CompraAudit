import type { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { converterJson, formatarEvidencia } from "../utils/evidenciaUtils";
import { obterParametro, obterUsuarioId } from "../utils/requestUtils";

type CriarEvidenciaBody = {
  identificador?: string;
  hashDados?: string;
  hashTransacao?: string;
  enderecoContrato?: string;
  carteiraRegistradora?: string;
  status?: "PENDENTE" | "REGISTRADA" | "COMPATIVEL" | "DIVERGENTE";
  contratacao?: unknown;
};

// salva uma evidência off-chain vinculada ao usuário autenticado 
export async function criarEvidencia(request: Request, response: Response) {
  const usuarioId = obterUsuarioId(request);

  if (!usuarioId) {
    response.status(401).json({ mensagem: "Usuário não autenticado." });
    return;
  }

  const {
    identificador,
    hashDados,
    hashTransacao,
    enderecoContrato,
    carteiraRegistradora,
    status,
    contratacao,
  } = request.body as CriarEvidenciaBody;

  if (!identificador || !hashDados || !contratacao) {
    response.status(400).json({
      mensagem: "Informe identificador, hashDados e contratacao.",
    });
    return;
  }

  const evidencia = await prisma.evidencia.create({
    data: {
      usuarioId,
      identificador,
      hashDados,
      hashTransacao,
      enderecoContrato,
      carteiraRegistradora,
      status: status ?? "REGISTRADA",
      contratacao: converterJson(contratacao),
    },
  });

  response.status(201).json(formatarEvidencia(evidencia));
}

// lista as evidências registradas pelo usuário autenticado
export async function listarEvidencias(request: Request, response: Response) {
  const usuarioId = obterUsuarioId(request);

  if (!usuarioId) {
    response.status(401).json({ mensagem: "Usuário não autenticado." });
    return;
  }

  const evidencias = await prisma.evidencia.findMany({
    where: { usuarioId },
    orderBy: { dataRegistro: "desc" },
  });

  response.json(evidencias.map(formatarEvidencia));
}

// busca uma evidência privada pelo id e pelo usuário autenticado 
export async function buscarEvidenciaPorId(
  request: Request,
  response: Response
) {
  const usuarioId = obterUsuarioId(request);
  const id = obterParametro(request.params.id);

  if (!usuarioId) {
    response.status(401).json({ mensagem: "Usuário não autenticado." });
    return;
  }

  if (!id) {
    response.status(400).json({ mensagem: "ID da evidência não informado." });
    return;
  }

  const evidencia = await prisma.evidencia.findFirst({
    where: {
      id,
      usuarioId,
    },
  });

  if (!evidencia) {
    response.status(404).json({ mensagem: "Evidência não encontrada." });
    return;
  }

  response.json(formatarEvidencia(evidencia));
}