import { apiFetch } from "./api";
import type { Evidencia } from "../types/evidencia";

export function listarEvidenciasApi() {
  return apiFetch<Evidencia[]>("/evidencias");
}

export function buscarEvidenciaApi(id: string) {
  return apiFetch<Evidencia>(`/evidencias/${id}`);
}

export function criarEvidenciaApi(evidencia: Evidencia) {
  return apiFetch<Evidencia>("/evidencias", {
    method: "POST",
    body: JSON.stringify(evidencia),
  });
}

export function verificarEvidenciaApi(consulta: string) {
  return apiFetch<Evidencia>(`/public/evidencias/${consulta}`);
}