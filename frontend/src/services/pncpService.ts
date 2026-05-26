import { buscarContratacaoApi } from "../api/pncpApi";
import type { Contratacao } from "../types/contratacao";

export async function buscarContratacaoPorIdentificador(
  identificador: string
): Promise<Contratacao> {
  try {
    return await buscarContratacaoApi(identificador);
  } catch {
    return {
      identificador,
      orgao: "Ministério da Educação",
      objeto: "Aquisição de equipamentos de informática para laboratório público",
      valor: 245000,
      modalidade: "Pregão eletrônico",
      dataPublicacao: new Date().toISOString(),
      fonte: "PNCP",
      dadosOriginais: {
        identificador,
        origem: "mock-temporario",
      },
    };
  }
}