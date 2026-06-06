import type { Contratacao } from "../../types";
import type { SugestaoAuditoria } from "./tiposSugestoes";
import { buscarIdentificadoresComEvidencia } from "./evidenciasSugestoesRepository";
import {
  possuiModalidadeDeRisco,
  possuiValorMinimo,
} from "./filtrosSugestoes";
import { normalizarIdentificador } from "./identificadoresSugestoes";
import { criarSugestao } from "./montarSugestao";

// cria uma contratação conhecida para manter a demo funcionando caso o PNCP não responda
function criarContratacaoDemo(): Contratacao {
  return {
    identificador: "93859817000109-1-000027/2026",
    orgao: "FUNDACAO ESTADUAL DE PROTECAO AMBIENTAL",
    objeto:
      "Contratação de serviço técnico especializado voltado à realização de estudo para estabelecimento/complementação dos Valores de Referência de Qualidade – VRQ dos solos do Estado do Rio Grande do Sul.",
    valor: 339166.05,
    modalidade: "Dispensa",
    dataPublicacao: "2026-05-01T00:09:00",
    fonte: "PNCP",
    dadosOriginais: {
      origem: "fallback-demo",
      motivo:
        "Contratação conhecida usada para manter a demonstração funcionando caso o PNCP não responda.",
    },
  };
}

// usa uma contratação conhecida para a demo caso a busca recente não retorne dados
export async function buscarSugestaoDemo(
  valorMinimo: number,
): Promise<SugestaoAuditoria[]> {
  const contratacao = criarContratacaoDemo();

  if (!possuiModalidadeDeRisco(contratacao)) {
    return [];
  }

  if (!possuiValorMinimo(contratacao, valorMinimo)) {
    return [];
  }

  const identificadoresComEvidencia = await buscarIdentificadoresComEvidencia([
    contratacao.identificador,
  ]);

  if (
    identificadoresComEvidencia.has(
      normalizarIdentificador(contratacao.identificador),
    )
  ) {
    return [];
  }

  return [criarSugestao(contratacao, valorMinimo)];
}