import type { Contratacao } from "../../types";

export type SugestaoAuditoria = Contratacao & {
  nivelRisco: "ALTO";
  motivoRisco: string;
};