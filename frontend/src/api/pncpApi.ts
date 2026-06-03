import { apiFetch } from "./api";
import type { Contratacao } from "../types/contratacao";

export type RespostaConsultaPncp = {
  contratacao: Contratacao;
  hashDados: string;
  dadosParaHash: unknown;
};

export type SugestaoAuditoria = Contratacao & {
  nivelRisco: "ALTO";
  motivoRisco: string;
};

export type RespostaSugestoesAuditoria = {
  total: number;
  sugestoes: SugestaoAuditoria[];
};

// consulta uma contratação no backend
export function buscarContratacaoApi(identificador: string) {
  return apiFetch<RespostaConsultaPncp>(
    `/pncp/contratacoes/${encodeURIComponent(identificador)}`
  );
}

// busca contratações recentes sugeridas para auditoria preventiva
export function buscarSugestoesAuditoriaApi(valorMinimo = 100000) {
  return apiFetch<RespostaSugestoesAuditoria>(
    `/pncp/sugestoes-auditoria?valorMinimo=${valorMinimo}`
  );
}

// gera hash para uma contratação já carregada no frontend
export function gerarHashContratacaoApi(contratacao: Contratacao) {
  return apiFetch<RespostaConsultaPncp>("/pncp/contratacoes/hash", {
    method: "POST",
    body: JSON.stringify(contratacao),
  });
}