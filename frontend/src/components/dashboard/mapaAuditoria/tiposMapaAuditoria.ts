import type { SugestaoAuditoria } from "../../../api/pncpApi";

export type SugestaoMapaAuditoria = SugestaoAuditoria;

export type RespostaSugestoesMapa = {
  total: number;
  sugestoes: SugestaoMapaAuditoria[];
};

export type UnidadeOrgaoPncp = {
  ufSigla?: string;
  municipioNome?: string;
};

export type DadosOriginaisPncp = {
  unidadeOrgao?: UnidadeOrgaoPncp;
};