import type { SugestaoAuditoria } from "../../../api/pncpApi";

// sugestão vinda do endpoint /pncp/sugestoes-auditoria
export type SugestaoMapaAuditoria = SugestaoAuditoria;

export type RespostaSugestoesMapa = {
  total: number;
  sugestoes: SugestaoMapaAuditoria[];
};

// parte dos dados originais do PNCP que normalmente contém UF/município
export type UnidadeOrgaoPncp = {
  ufSigla?: string;
  municipioNome?: string;
};

export type DadosOriginaisPncp = {
  unidadeOrgao?: UnidadeOrgaoPncp;
};

// tipos mínimos para ler o GeoJSON do mapa do Brasil
export type CoordenadaGeo = [number, number];

export type PoligonoGeo = CoordenadaGeo[][];

export type MultiPoligonoGeo = PoligonoGeo[];

export type EstadoGeoJson = {
  type: "Feature";
  id?: string | number;
  properties: Record<string, unknown>;
  geometry: {
    type: "Polygon" | "MultiPolygon";
    coordinates: PoligonoGeo | MultiPoligonoGeo;
  };
};

export type BrasilGeoJson = {
  type: "FeatureCollection";
  features: EstadoGeoJson[];
};

// estado já convertido em caminho SVG para renderização
export type EstadoMapaRenderizado = {
  uf: string | null;
  nome: string;
  caminho: string;
};