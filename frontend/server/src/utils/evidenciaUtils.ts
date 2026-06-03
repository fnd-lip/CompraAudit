import { Prisma } from "../generated/prisma/client";
import type { Evidencia as EvidenciaBanco } from "../generated/prisma/client";

// converte objetos comuns para o formato JSON aceito pelo Prisma 
export function converterJson(valor: unknown): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(valor)) as Prisma.InputJsonValue;
}

// formata a evidência do banco para o formato retornado pela API 
export function formatarEvidencia(evidencia: EvidenciaBanco) {
  return {
    ...evidencia,
    dataRegistro: evidencia.dataRegistro.toISOString(),
    contratacao: evidencia.contratacao,
  };
}