import { apiFetch } from "./api";
import type { Contratacao } from "../types/contratacao";

export type RespostaConsultaPncp = {
  contratacao: Contratacao;
  hashDados: string;
  dadosParaHash: unknown;
};

// consulta uma contratacao no backend 
export function buscarContratacaoApi(identificador: string) {
  return apiFetch<RespostaConsultaPncp>(
    `/pncp/contratacoes/${encodeURIComponent(identificador)}`
  );
}