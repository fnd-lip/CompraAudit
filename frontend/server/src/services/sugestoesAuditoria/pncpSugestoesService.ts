import type { Contratacao } from "../../types";
import {
  CODIGOS_MODALIDADE_RISCO,
  DIAS_BUSCA_RECENTE,
  PAGINAS_BUSCA_PNCP,
  TAMANHO_PAGINA_PNCP,
} from "./constantesSugestoes";
import { formatarDataPncp } from "./datasPncp";
import { removerContratacoesDuplicadas } from "./filtrosSugestoes";
import { buscarContratacoesPublicacao } from "../pncp/pncpClient";
import { mapearContratacaoPncp } from "../pncp/mapearContratacaoPncp";

// busca contratações recentes no PNCP usando as modalidades de risco
export async function buscarContratacoesRecentes(): Promise<Contratacao[]> {
  const hoje = new Date();
  const dataInicial = new Date();

  dataInicial.setDate(hoje.getDate() - DIAS_BUSCA_RECENTE);

  const listas = await Promise.all(
    CODIGOS_MODALIDADE_RISCO.flatMap((codigoModalidadeContratacao) => {
      return Array.from({ length: PAGINAS_BUSCA_PNCP }, async (_, indice) => {
        const pagina = indice + 1;

        try {
          const registros = await buscarContratacoesPublicacao({
            dataInicial: formatarDataPncp(dataInicial),
            dataFinal: formatarDataPncp(hoje),
            codigoModalidadeContratacao,
            pagina,
            tamanhoPagina: TAMANHO_PAGINA_PNCP,
          });

          return registros.map((registro) => {
            return mapearContratacaoPncp(registro, "PNCP");
          });
        } catch {
          console.warn(
            `falha ao buscar sugestões no PNCP na modalidade ${codigoModalidadeContratacao}, página ${pagina}`,
          );

          return [];
        }
      });
    }),
  );

  return removerContratacoesDuplicadas(listas.flat());
}