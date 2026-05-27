import {
  buscarEvidenciaApi,
  criarEvidenciaApi,
  listarEvidenciasApi,
  verificarEvidenciaApi,
  verificarEvidenciaCompletaApi,
  type CriarEvidenciaInput,
} from "../api/evidenciasApi";

// lista evidencias salvas no backend 
export function listarEvidencias() {
  return listarEvidenciasApi();
}

// salva uma evidencia off-chain no backend
export function salvarEvidencia(evidencia: CriarEvidenciaInput) {
  return criarEvidenciaApi(evidencia);
}

// busca evidencia privada pelo id 
export function buscarEvidenciaPorId(id: string) {
  return buscarEvidenciaApi(id);
}

// busca evidencia publica por id, identificador ou hash 
export function buscarEvidenciaPublica(consulta: string) {
  return verificarEvidenciaApi(consulta);
}

// verifica evidencia comparando hash salvo e hash atual 
export function verificarEvidenciaCompleta(consulta: string) {
  return verificarEvidenciaCompletaApi(consulta);
}