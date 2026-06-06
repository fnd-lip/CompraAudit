import type { Contratacao } from "../../types";
import type { SugestaoAuditoria } from "./tiposSugestoes";
import { criarMotivoRisco } from "./textosSugestoes";

// monta o objeto final que será enviado para o frontend
export function criarSugestao(
  contratacao: Contratacao,
  valorMinimo: number,
): SugestaoAuditoria {
  return {
    ...contratacao,
    nivelRisco: "ALTO",
    motivoRisco: criarMotivoRisco(contratacao, valorMinimo),
  };
}