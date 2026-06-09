import type { CoordenadaMapa } from "./tiposMapaLeaflet";

// Centro aproximado do Brasil usado para abrir o mapa inicialmente
export const CENTRO_BRASIL: CoordenadaMapa = [-14.235, -51.9253];

// Coordenadas aproximadas de cada UF
// São usadas como fallback quando a evidência não possui latitude/longitude
// Depois podemos melhorar isso usando coordenadas reais do município
export const COORDENADAS_UF: Record<string, CoordenadaMapa> = {
  AC: [-9.02, -70.81],
  AL: [-9.57, -36.78],
  AP: [1.41, -51.77],
  AM: [-3.47, -65.1],
  BA: [-12.58, -41.7],
  CE: [-5.2, -39.53],
  DF: [-15.83, -47.86],
  ES: [-19.19, -40.34],
  GO: [-15.98, -49.86],
  MA: [-5.42, -45.44],
  MT: [-12.64, -55.42],
  MS: [-20.51, -54.54],
  MG: [-18.1, -44.38],
  PA: [-3.79, -52.48],
  PB: [-7.28, -36.72],
  PR: [-24.89, -51.55],
  PE: [-8.38, -37.86],
  PI: [-6.6, -42.28],
  RJ: [-22.25, -42.66],
  RN: [-5.81, -36.59],
  RS: [-30.17, -53.5],
  RO: [-10.83, -63.34],
  RR: [2.73, -61.36],
  SC: [-27.45, -50.95],
  SP: [-22.19, -48.79],
  SE: [-10.57, -37.45],
  TO: [-10.25, -48.25],
};