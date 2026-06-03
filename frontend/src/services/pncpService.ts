import type { Contratacao } from "../types/contratacao";
import {
  buscarContratacaoApi,
  buscarSugestoesAuditoriaApi,
  gerarHashContratacaoApi,
} from "../api/pncpApi";

// busca contratação e hash calculado pelo backend
export async function buscarContratacaoPorIdentificador(identificador: string) {
  return buscarContratacaoApi(identificador);
}

// gera hash de uma contratação já selecionada
export async function gerarHashDeContratacao(contratacao: Contratacao) {
  return gerarHashContratacaoApi(contratacao);
}

// busca sugestões de auditoria preventiva por gatilho de risco
export async function buscarSugestoesAuditoria(valorMinimo = 100000) {
  return buscarSugestoesAuditoriaApi(valorMinimo);
}