import type { Evidencia } from "../types/evidencia";

const CHAVE_EVIDENCIAS = "compraaudit_evidencias";

export function listarEvidencias(): Evidencia[] {
  const dados = localStorage.getItem(CHAVE_EVIDENCIAS);

  if (!dados) {
    return [];
  }

  return JSON.parse(dados) as Evidencia[];
}

export function salvarEvidencia(evidencia: Evidencia): Evidencia {
  const evidencias = listarEvidencias();
  const evidenciasAtualizadas = [evidencia, ...evidencias];

  localStorage.setItem(CHAVE_EVIDENCIAS, JSON.stringify(evidenciasAtualizadas));

  return evidencia;
}

export function buscarEvidenciaPorId(id: string): Evidencia | null {
  const evidencias = listarEvidencias();

  return evidencias.find((evidencia) => evidencia.id === id) ?? null;
}

export function buscarEvidenciaPublica(consulta: string): Evidencia | null {
  const evidencias = listarEvidencias();

  return (
    evidencias.find(
      (evidencia) =>
        evidencia.id === consulta ||
        evidencia.identificador === consulta ||
        evidencia.hashDados === consulta
    ) ?? null
  );
}