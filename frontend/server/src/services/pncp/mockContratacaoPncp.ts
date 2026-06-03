import type { Contratacao } from "../../types";

// cria dados simulados para manter o MVP funcionando caso o PNCP falhe 
export function criarContratacaoMock(identificador: string): Contratacao {
  return {
    identificador,
    orgao: "Ministério da Educação",
    objeto: "Aquisição de equipamentos de informática para laboratório público",
    valor: 245000,
    modalidade: "Pregão eletrônico",
    dataPublicacao: new Date().toISOString(),
    fonte: "PNCP",
    dadosOriginais: {
      origem: "mock-temporario",
      identificador,
    },
  };
}