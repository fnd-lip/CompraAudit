import type { Evidencia } from "../../../../types/evidencia";

// Coordenada no formato usado pelo Leaflet: [latitude, longitude]
export type CoordenadaMapa = [number, number];

// Representa um ponto que será desenhado no mapa para uma evidência on-chain
export type MarcadorBlockchain = {
  evidencia: Evidencia;
  uf: string;
  municipio: string;
  coordenada: CoordenadaMapa;

  // true quando não temos latitude/longitude exata e usamos posição aproximada da UF
  localizacaoAproximada: boolean;
};