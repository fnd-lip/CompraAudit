import type {
  BrasilGeoJson,
  CoordenadaGeo,
  EstadoGeoJson,
  EstadoMapaRenderizado,
  MultiPoligonoGeo,
  PoligonoGeo,
} from "../tiposMapaAuditoria";
import {
  ALTURA_MAPA,
  ESPACO_INTERNO_MAPA,
  LARGURA_MAPA,
} from "./constantesMapaBrasil";
import {
  obterNomeDaGeografia,
  obterUfDaGeografia,
} from "../utils/ufMapaAuditoria";

type ProjetorMapa = {
  projetar: (coordenada: CoordenadaGeo) => [number, number];
};

// converte Polygon/MultiPolygon para uma lista única de polígonos
function obterPoligonos(estado: EstadoGeoJson): PoligonoGeo[] {
  if (estado.geometry.type === "Polygon") {
    return [estado.geometry.coordinates as PoligonoGeo];
  }

  return estado.geometry.coordinates as MultiPoligonoGeo;
}

// coleta todas as coordenadas para calcular escala e enquadramento
function coletarCoordenadas(estados: EstadoGeoJson[]): CoordenadaGeo[] {
  return estados.flatMap((estado) => {
    return obterPoligonos(estado).flatMap((poligono) => {
      return poligono.flatMap((anel) => anel);
    });
  });
}

// cria uma projeção simples latitude/longitude -> coordenadas SVG
function criarProjetorMapa(estados: EstadoGeoJson[]): ProjetorMapa {
  const coordenadas = coletarCoordenadas(estados);

  const longitudes = coordenadas.map(([longitude]) => longitude);
  const latitudes = coordenadas.map(([, latitude]) => latitude);

  const longitudeMinima = Math.min(...longitudes);
  const longitudeMaxima = Math.max(...longitudes);
  const latitudeMinima = Math.min(...latitudes);
  const latitudeMaxima = Math.max(...latitudes);

  const larguraGeo = longitudeMaxima - longitudeMinima;
  const alturaGeo = latitudeMaxima - latitudeMinima;

  const escala = Math.min(
    (LARGURA_MAPA - ESPACO_INTERNO_MAPA * 2) / larguraGeo,
    (ALTURA_MAPA - ESPACO_INTERNO_MAPA * 2) / alturaGeo,
  );

  const larguraProjetada = larguraGeo * escala;
  const alturaProjetada = alturaGeo * escala;

  const deslocamentoX = (LARGURA_MAPA - larguraProjetada) / 2;
  const deslocamentoY = (ALTURA_MAPA - alturaProjetada) / 2;

  function projetar([longitude, latitude]: CoordenadaGeo): [number, number] {
    const x = deslocamentoX + (longitude - longitudeMinima) * escala;
    const y = deslocamentoY + (latitudeMaxima - latitude) * escala;

    return [x, y];
  }

  return { projetar };
}

// monta o atributo "d" usado pelo <path> do SVG
function montarCaminhoEstado(
  estado: EstadoGeoJson,
  projetor: ProjetorMapa,
): string {
  return obterPoligonos(estado)
    .flatMap((poligono) => {
      return poligono.map((anel) => {
        const pontos = anel.map((coordenada, indice) => {
          const [x, y] = projetor.projetar(coordenada);
          const comando = indice === 0 ? "M" : "L";

          return `${comando} ${x.toFixed(2)} ${y.toFixed(2)}`;
        });

        return `${pontos.join(" ")} Z`;
      });
    })
    .join(" ");
}

// transforma o GeoJSON bruto em estados prontos para desenhar no SVG
export function montarEstadosRenderizados(
  geoJson: BrasilGeoJson,
): EstadoMapaRenderizado[] {
  const projetor = criarProjetorMapa(geoJson.features);

  return geoJson.features.map((estado) => {
    const uf = obterUfDaGeografia(estado);

    return {
      uf,
      nome: obterNomeDaGeografia(estado),
      caminho: montarCaminhoEstado(estado, projetor),
    };
  });
}
