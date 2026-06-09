import type { Evidencia } from "../../../../types/evidencia";

// Coordenada usada pelo Leaflet no formato [latitude, longitude]
export type CoordenadaMapa = [number, number];

// Registro que pode ser desenhado no mapa
export type MarcadorBlockchain = {
  evidencia: Evidencia;
  uf: string;
  municipio: string;
  coordenada: CoordenadaMapa;

  // true quando a coordenada veio de geocodificação pelo município/UF,
  // e não de latitude/longitude salva diretamente na evidência.
  localizacaoAproximada: boolean;
};

// Registro on-chain que não será desenhado no mapa por falta de localização confiável
export type RegistroSemLocalizacao = {
  evidencia: Evidencia;
  uf: string;
  municipio: string;
  motivo: string;
};