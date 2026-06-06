import { prisma } from "../../lib/prisma";
import {
  normalizarIdentificador,
  removerIdentificadoresDuplicados,
} from "./identificadoresSugestoes";

// tenta ler o identificador salvo dentro do JSON da contratação no Prisma
function lerIdentificadorDaContratacaoSalva(
  contratacao: unknown,
): string | undefined {
  if (!contratacao || typeof contratacao !== "object") {
    return undefined;
  }

  const valor = (contratacao as { identificador?: unknown }).identificador;

  if (typeof valor !== "string") {
    return undefined;
  }

  return normalizarIdentificador(valor);
}

// busca no Prisma quais identificadores já possuem evidência registrada
export async function buscarIdentificadoresComEvidencia(
  identificadores: string[],
): Promise<Set<string>> {
  const identificadoresUnicos =
    removerIdentificadoresDuplicados(identificadores);

  if (identificadoresUnicos.length === 0) {
    return new Set();
  }

  const identificadoresBuscados = new Set(identificadoresUnicos);

  const evidenciasEncontradas = await prisma.evidencia.findMany({
    select: {
      identificador: true,
      contratacao: true,
    },
  });

  const identificadoresComEvidencia = new Set<string>();

  for (const evidencia of evidenciasEncontradas) {
    const identificadorDireto = normalizarIdentificador(
      evidencia.identificador,
    );

    const identificadorJson = lerIdentificadorDaContratacaoSalva(
      evidencia.contratacao,
    );

    if (identificadoresBuscados.has(identificadorDireto)) {
      identificadoresComEvidencia.add(identificadorDireto);
    }

    if (identificadorJson && identificadoresBuscados.has(identificadorJson)) {
      identificadoresComEvidencia.add(identificadorJson);
    }
  }

  return identificadoresComEvidencia;
}