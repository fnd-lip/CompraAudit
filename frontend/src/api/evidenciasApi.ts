import { apiFetch } from "./api";
import type { Contratacao } from "../types/contratacao";
import type {
  Evidencia,
  ResultadoVerificacaoPublica,
  StatusEvidencia,
} from "../types/evidencia";

export type CriarEvidenciaInput = {
  identificador: string;
  hashDados: string;
  hashTransacao?: string;
  enderecoContrato?: string;
  carteiraRegistradora?: string;
  status: StatusEvidencia;
  contratacao: Contratacao;
};

/* lista evidencias do usuario autenticado */
export function listarEvidenciasApi() {
  return apiFetch<Evidencia[]>("/evidencias");
}

/* busca uma evidencia privada pelo id */
export function buscarEvidenciaApi(id: string) {
  return apiFetch<Evidencia>(`/evidencias/${id}`);
}

/* salva uma evidencia off-chain no backend */
export function criarEvidenciaApi(evidencia: CriarEvidenciaInput) {
  return apiFetch<Evidencia>("/evidencias", {
    method: "POST",
    body: JSON.stringify(evidencia),
  });
}

/* busca uma evidencia publica por id, identificador ou hash */
export function verificarEvidenciaApi(consulta: string) {
  return apiFetch<Evidencia>(
    `/public/evidencias/${encodeURIComponent(consulta)}`
  );
}

/* compara a evidencia salva com os dados atuais da fonte publica */
export function verificarEvidenciaCompletaApi(consulta: string) {
  return apiFetch<ResultadoVerificacaoPublica>(
    `/public/verificacao/${encodeURIComponent(consulta)}`
  );
}