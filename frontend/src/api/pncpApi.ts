import { apiFetch } from "./api";
import type { Contratacao } from "../types/contratacao";

export function buscarContratacaoApi(identificador: string) {
  return apiFetch<Contratacao>(`/pncp/contratacoes/${identificador}`);
}