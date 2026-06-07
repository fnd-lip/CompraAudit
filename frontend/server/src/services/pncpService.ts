import type { Contratacao } from "../types";
import type { RegistroPncp } from "./pncp/leitoresPncp";
import { buscarContratacoesPublicacao } from "./pncp/pncpClient";
import {
  lerIdentificadorPncp,
  mapearContratacaoPncp,
} from "./pncp/mapearContratacaoPncp";
import { criarContratacaoMock } from "./pncp/mockContratacaoPncp";
import { buscarContratacoesRecentes } from "./sugestoesAuditoria/pncpSugestoesService";

const CODIGOS_MODALIDADE_BUSCA = [8, 9];
const DIAS_BUSCA_CONTRATACAO = 60;
const TOTAL_PAGINAS_BUSCA = 10;
const TAMANHO_PAGINA_BUSCA = 50;

// converte Date para o formato esperado pela API do PNCP: aaaammdd
function formatarDataPncp(data: Date): string {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");

  return `${ano}${mes}${dia}`;
}

// normaliza identificadores antes de comparar com o retorno do PNCP
function normalizarIdentificador(identificador: string): string {
  return identificador.trim();
}

// identifica se o valor informado é um atalho interno usado apenas no MVP
function ehIdentificadorDemo(identificador: string): boolean {
  return identificador.startsWith("PNCP-");
}

// monta o intervalo de datas usado na consulta manual
function montarPeriodoBusca(): { dataInicial: string; dataFinal: string } {
  const hoje = new Date();
  const dataInicial = new Date();

  dataInicial.setDate(hoje.getDate() - DIAS_BUSCA_CONTRATACAO);

  return {
    dataInicial: formatarDataPncp(dataInicial),
    dataFinal: formatarDataPncp(hoje),
  };
}

// verifica se o item retornado pelo PNCP corresponde ao identificador buscado
function identificadorCorresponde(
  item: RegistroPncp,
  identificadorBuscado: string,
): boolean {
  const identificadorPncp = lerIdentificadorPncp(item);

  if (!identificadorPncp) {
    return false;
  }

  return normalizarIdentificador(identificadorPncp) === identificadorBuscado;
}

// tenta encontrar a contratação reaproveitando a mesma busca usada no carrossel
async function buscarContratacaoNasSugestoesRecentes(
  identificadorBuscado: string,
): Promise<Contratacao | null> {
  const contratacoesRecentes = await buscarContratacoesRecentes();

  const encontrada = contratacoesRecentes.find((contratacao) => {
    return (
      normalizarIdentificador(contratacao.identificador) ===
      identificadorBuscado
    );
  });

  return encontrada || null;
}

// busca registros do PNCP em uma modalidade e página específicas
async function buscarPaginaPncp(
  codigoModalidadeContratacao: number,
  pagina: number,
  dataInicial: string,
  dataFinal: string,
): Promise<RegistroPncp[]> {
  try {
    return await buscarContratacoesPublicacao({
      dataInicial,
      dataFinal,
      codigoModalidadeContratacao,
      pagina,
      tamanhoPagina: TAMANHO_PAGINA_BUSCA,
    });
  } catch {
    console.warn(
      `falha ao consultar PNCP na modalidade ${codigoModalidadeContratacao}, página ${pagina}`,
    );

    return [];
  }
}

// busca a contratação em várias páginas e modalidades da API do PNCP
async function buscarRegistroPorIdentificador(
  identificadorBuscado: string,
): Promise<RegistroPncp | null> {
  const { dataInicial, dataFinal } = montarPeriodoBusca();

  const consultas = CODIGOS_MODALIDADE_BUSCA.flatMap(
    (codigoModalidadeContratacao) => {
      return Array.from({ length: TOTAL_PAGINAS_BUSCA }, (_, indice) => {
        const pagina = indice + 1;

        return buscarPaginaPncp(
          codigoModalidadeContratacao,
          pagina,
          dataInicial,
          dataFinal,
        );
      });
    },
  );

  const listas = await Promise.all(consultas);
  const registros = listas.flat();

  const encontrado = registros.find((item) => {
    return identificadorCorresponde(item, identificadorBuscado);
  });

  return encontrado || null;
}

// busca uma contratação no PNCP usando o identificador informado
export async function buscarContratacaoPncp(
  identificador: string,
): Promise<Contratacao> {
  const identificadorBuscado = normalizarIdentificador(identificador);

  if (!identificadorBuscado) {
    throw new Error("Identificador não informado.");
  }

  if (ehIdentificadorDemo(identificadorBuscado)) {
    return criarContratacaoMock(identificadorBuscado);
  }

  const contratacaoDasSugestoes =
    await buscarContratacaoNasSugestoesRecentes(identificadorBuscado);

  if (contratacaoDasSugestoes) {
    return contratacaoDasSugestoes;
  }

  const registroEncontrado =
    await buscarRegistroPorIdentificador(identificadorBuscado);

  if (registroEncontrado) {
    return mapearContratacaoPncp(registroEncontrado, identificadorBuscado);
  }

  throw new Error(
    "Contratação não encontrada no PNCP. Tente selecionar outra sugestão ou consultar novamente.",
  );
}