import type { Contratacao } from "./contratacao";

export type StatusEvidencia =
  | "PENDENTE"
  | "REGISTRADA"
  | "COMPATIVEL"
  | "DIVERGENTE";

export type Evidencia = {
  id: string;
  usuarioId?: string;
  identificador: string;
  hashDados: string;
  hashTransacao?: string;
  enderecoContrato?: string;
  carteiraRegistradora?: string;
  dataRegistro: string;
  status: StatusEvidencia;
  contratacao: Contratacao;
};

export type ResultadoVerificacaoPublica = {
  status: "COMPATIVEL" | "DIVERGENTE";
  mensagem: string;
  evidencia: Evidencia;
  hashSalvo: string;
  hashAtual: string;
  dadosAtuais: Contratacao;
  dadosParaHashAtual: unknown;
};