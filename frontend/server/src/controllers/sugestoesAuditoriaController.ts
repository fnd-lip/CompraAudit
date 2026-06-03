import type { Request, Response } from "express";
import {
  buscarSugestoesAuditoria,
  type SugestaoAuditoria,
} from "../services/sugestoesAuditoriaService";

// reduz o retorno para exibir apenas os dados necessários no feed 
function resumirSugestao(sugestao: SugestaoAuditoria) {
  return {
    identificador: sugestao.identificador,
    orgao: sugestao.orgao,
    objeto: sugestao.objeto,
    valor: sugestao.valor,
    modalidade: sugestao.modalidade,
    dataPublicacao: sugestao.dataPublicacao,
    fonte: sugestao.fonte,
    nivelRisco: sugestao.nivelRisco,
    motivoRisco: sugestao.motivoRisco,
  };
}

// controla a requisição HTTP das sugestões de auditoria 
export async function listarSugestoesAuditoria(
  request: Request,
  response: Response
) {
  try {
    const valorMinimo = Number(request.query.valorMinimo || 100000);
    const sugestoes = await buscarSugestoesAuditoria(valorMinimo);
    const sugestoesResumo = sugestoes.map(resumirSugestao);

    response.json({
      total: sugestoesResumo.length,
      sugestoes: sugestoesResumo,
    });
  } catch (erro) {
    console.error("erro ao buscar sugestões de auditoria", erro);

    response.status(500).json({
      mensagem: "Erro ao buscar sugestões de auditoria.",
    });
  }
}