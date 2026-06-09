import type { Evidencia } from "../../../../types/evidencia";
import { obterUfDaEvidencia } from "../utils/ufMapaAuditoria";
import { CENTRO_BRASIL, COORDENADAS_UF } from "./constantesMapaLeaflet";
import type { CoordenadaMapa, MarcadorBlockchain } from "./tiposMapaLeaflet";
import { buscarNumeroPorChaves, buscarTextoPorChaves } from "./utilsBuscaMapa";

// Extrai o município/cidade de uma evidência
// A busca é flexível porque o dado pode estar em campos diferentes
// dependendo de como a evidência foi salva.
export function obterMunicipioEvidencia(evidencia: Evidencia): string {
  return (
    buscarTextoPorChaves(evidencia, [
      "municipio",
      "municipioNome",
      "cidade",
      "localidade",
    ]) || "Município não informado"
  );
}

// Tenta extrair latitude/longitude exatas da evidência.
// Se o registro tiver esses campos no futuro, o marker ficará no ponto correto.
function obterCoordenadaDireta(evidencia: Evidencia): CoordenadaMapa | null {
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

// Quando vários registros caem na mesma UF sem latitude/longitude
// deslocamos um pouco cada ponto para evitar que fiquem todos sobrepostos.
function deslocarMarcador(
  coordenada: CoordenadaMapa,
  indice: number,
  total: number,
): CoordenadaMapa {
  if (total <= 1) {
    return coordenada;
  }

  const angulo = (2 * Math.PI * indice) / total;
  const raio = Math.min(0.65, 0.18 + total * 0.02);

  return [
    coordenada[0] + Math.sin(angulo) * raio,
    coordenada[1] + Math.cos(angulo) * raio,
  ];
}

// Converte as evidências registradas na blockchain em marcadores do mapa
// Cada evidência on-chain vira um ponto azul no Leaflet
export function montarMarcadoresBlockchain(
  evidencias: Evidencia[],
): MarcadorBlockchain[] {
  const evidenciasPorUf = new Map<string, Evidencia[]>();

  // Agrupa evidências pela UF para organizar os marcadores
  for (const evidencia of evidencias) {
    const uf = obterUfDaEvidencia(evidencia);

    if (!evidenciasPorUf.has(uf)) {
      evidenciasPorUf.set(uf, []);
    }

    evidenciasPorUf.get(uf)?.push(evidencia);
  }

  const marcadores: MarcadorBlockchain[] = [];

  for (const [uf, evidenciasDaUf] of evidenciasPorUf.entries()) {
    evidenciasDaUf.forEach((evidencia, indice) => {
      const coordenadaDireta = obterCoordenadaDireta(evidencia);

      // Usa coordenada exata se existir
      // Se não existir, usa centro aproximado da UF
      // Se nem UF for encontrada, cai no centro do Brasil
      const coordenadaBase =
        coordenadaDireta || COORDENADAS_UF[uf] || CENTRO_BRASIL;

      marcadores.push({
        evidencia,
        uf,
        municipio: obterMunicipioEvidencia(evidencia),
        coordenada: coordenadaDireta
          ? coordenadaDireta
          : deslocarMarcador(coordenadaBase, indice, evidenciasDaUf.length),
        localizacaoAproximada: !coordenadaDireta,
      });
    });
  }

  return marcadores;
}