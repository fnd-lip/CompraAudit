import { NOMES_UF } from "../constantesMapaAuditoria";
import { normalizarTextoBusca } from "../utils/textoMapaAuditoria";
import type { CoordenadaMapa } from "./tiposMapaLeaflet";

type RespostaNominatim = {
  lat: string;
  lon: string;
};

const PREFIXO_CACHE = "compraaudit:geo:v1:";

// Cria uma chave estável para guardar coordenadas em cache no navegador.
// Assim o app não precisa buscar a mesma cidade toda vez.
function montarChaveCache(municipio: string, uf: string): string {
  return `${PREFIXO_CACHE}${normalizarTextoBusca(`${municipio}-${uf}`)}`;
}

function lerCoordenadaCache(chave: string): CoordenadaMapa | null {
  try {
    const valor = localStorage.getItem(chave);

    if (!valor) {
      return null;
    }

    const coordenada = JSON.parse(valor) as CoordenadaMapa;

    if (
      Array.isArray(coordenada) &&
      coordenada.length === 2 &&
      Number.isFinite(coordenada[0]) &&
      Number.isFinite(coordenada[1])
    ) {
      return coordenada;
    }

    return null;
  } catch {
    return null;
  }
}

function salvarCoordenadaCache(chave: string, coordenada: CoordenadaMapa) {
  try {
    localStorage.setItem(chave, JSON.stringify(coordenada));
  } catch {
    // Se o navegador bloquear localStorage, o mapa continua funcionando sem cache.
  }
}

// Busca a coordenada do município usando município + UF + Brasil.
// Se não encontrar, retorna null e o registro não será desenhado no mapa.
export async function geocodificarMunicipio(
  municipio: string,
  uf: string,
): Promise<CoordenadaMapa | null> {
  const chaveCache = montarChaveCache(municipio, uf);
  const coordenadaCache = lerCoordenadaCache(chaveCache);

  if (coordenadaCache) {
    return coordenadaCache;
  }

  const estado = NOMES_UF[uf] || uf;
  const consulta = encodeURIComponent(`${municipio}, ${estado}, Brasil`);

  const url =
    `https://nominatim.openstreetmap.org/search` +
    `?format=json&limit=1&countrycodes=br&q=${consulta}`;

  try {
    const resposta = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!resposta.ok) {
      return null;
    }

    const dados = (await resposta.json()) as RespostaNominatim[];

    if (dados.length === 0) {
      return null;
    }

    const latitude = Number(dados[0].lat);
    const longitude = Number(dados[0].lon);

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      return null;
    }

    const coordenada: CoordenadaMapa = [latitude, longitude];

    salvarCoordenadaCache(chaveCache, coordenada);

    return coordenada;
  } catch {
    return null;
  }
}