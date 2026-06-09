import type { Evidencia } from "../../../../types/evidencia";
import { normalizarTextoBusca } from "../utils/textoMapaAuditoria";
import { obterUfDaEvidencia } from "../utils/ufMapaAuditoria";
import type { CoordenadaMapa } from "./tiposMapaLeaflet";
import { buscarNumeroPorChaves, buscarTextoPorChaves } from "./utilsBuscaMapa";

export const MUNICIPIO_NAO_INFORMADO = "Município não informado";

// Extrai o município/cidade de uma evidência.
// A busca é flexível porque os dados podem estar em objetos diferentes.
export function obterMunicipioEvidencia(evidencia: Evidencia): string {
  return (
    buscarTextoPorChaves(evidencia, [
      "municipio",
      "municipioNome",
      "cidade",
      "localidade",
    ]) || MUNICIPIO_NAO_INFORMADO
  );
}

// Valida se o município é útil para geolocalização.
// Registros sem município não devem virar ponto aleatório no mapa.
export function municipioEhValido(municipio: string): boolean {
  return (
    Boolean(municipio.trim()) &&
    normalizarTextoBusca(municipio) !==
      normalizarTextoBusca(MUNICIPIO_NAO_INFORMADO)
  );
}

// Valida UF. Quando a UF vem como NI, não temos como posicionar com segurança.
export function ufEhValida(uf: string): boolean {
  return /^[A-Z]{2}$/.test(uf) && uf !== "NI";
}

// Tenta extrair latitude/longitude já salvas na evidência.
// Esta é a melhor localização possível.
export function obterCoordenadaDireta(
  evidencia: Evidencia,
): CoordenadaMapa | null {
  const latitude = buscarNumeroPorChaves(evidencia, ["latitude", "lat"]);

  const longitude = buscarNumeroPorChaves(evidencia, [
    "longitude",
    "lng",
    "lon",
  ]);

  if (latitude === null || longitude === null) {
    return null;
  }

  return [latitude, longitude];
}

// Junta UF e município em uma estrutura base para o mapa.
export function obterLocalizacaoBaseEvidencia(evidencia: Evidencia) {
  const uf = obterUfDaEvidencia(evidencia);
  const municipio = obterMunicipioEvidencia(evidencia);
  const coordenadaDireta = obterCoordenadaDireta(evidencia);

  return {
    uf,
    municipio,
    coordenadaDireta,
  };
}