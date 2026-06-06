import type { SugestaoAuditoria } from "./sugestoesAuditoria/tiposSugestoes";
import { LIMITE_SUGESTOES } from "./sugestoesAuditoria/constantesSugestoes";
import { buscarSugestaoDemo } from "./sugestoesAuditoria/demoSugestoesService";
import { buscarIdentificadoresComEvidencia } from "./sugestoesAuditoria/evidenciasSugestoesRepository";
import {
  possuiModalidadeDeRisco,
  possuiValorMinimo,
  removerContratacoesComEvidencia,
} from "./sugestoesAuditoria/filtrosSugestoes";
import { criarSugestao } from "./sugestoesAuditoria/montarSugestao";
import { buscarContratacoesRecentes } from "./sugestoesAuditoria/pncpSugestoesService";

export type { SugestaoAuditoria } from "./sugestoesAuditoria/tiposSugestoes";

// busca sugestões de auditoria preventiva por gatilho de risco
export async function buscarSugestoesAuditoria(
  valorMinimo = 100000,
): Promise<SugestaoAuditoria[]> {
  const contratacoes = await buscarContratacoesRecentes();

  if (contratacoes.length === 0) {
    return buscarSugestaoDemo(valorMinimo);
  }

  const contratacoesDeRisco = contratacoes
    .filter((contratacao) => possuiModalidadeDeRisco(contratacao))
    .filter((contratacao) => possuiValorMinimo(contratacao, valorMinimo));

  const identificadores = contratacoesDeRisco.map((contratacao) => {
    return contratacao.identificador;
  });

  const identificadoresComEvidencia =
    await buscarIdentificadoresComEvidencia(identificadores);

  const contratacoesPendentes = removerContratacoesComEvidencia(
    contratacoesDeRisco,
    identificadoresComEvidencia,
  );

  const sugestoes = contratacoesPendentes
    .map((contratacao) => criarSugestao(contratacao, valorMinimo))
    .sort((a, b) => b.valor - a.valor)
    .slice(0, LIMITE_SUGESTOES);

  if (sugestoes.length > 0) {
    return sugestoes;
  }

  return buscarSugestaoDemo(valorMinimo);
}