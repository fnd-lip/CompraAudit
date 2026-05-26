import type { Contratacao } from "./contratacao";

export type StatusEvidencia = "PENDENTE" | "REGISTRADA" | "COMPATIVEL" | "DIVERGENTE";

export type Evidencia = {
  id: string;
  identificador: string;
  hashDados: string;
  hashTransacao?: string;
  enderecoContrato?: string;
  carteiraRegistradora?: string;
  dataRegistro: string;
  status: StatusEvidencia;
  contratacao: Contratacao;
};