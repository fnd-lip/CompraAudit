import type { Contratacao } from "../types";
import { buscarContratacoesPublicacao } from "./pncp/pncpClient";
import {
  lerIdentificadorPncp,
  mapearContratacaoPncp,
} from "./pncp/mapearContratacaoPncp";
import { criarContratacaoMock } from "./pncp/mockContratacaoPncp";

const CODIGOS_MODALIDADE_BUSCA = [8, 9];
const DIAS_BUSCA_CONTRATACAO = 120;
const TOTAL_PAGINAS_BUSCA = 5;
const TAMANHO_PAGINA_BUSCA = 50;

// converte Date para o formato esperado pela API do PNCP: aaaammdd 
function formatarDataPncp(data: Date): string {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");

  return `${ano}${mes}${dia}`;
}

// identifica se o valor informado é um atalho interno usado apenas no MVP 
function ehIdentificadorDemo(identificador: string): boolean {
  return identificador.startsWith("PNCP-");
}

// verifica se o item retornado pelo PNCP corresponde ao identificador buscado 
function identificadorCorresponde(
  identificadorPncp: string | undefined,
  identificadorBuscado: string
): boolean {
  if (!identificadorPncp) {
    return false;
  }

  return identificadorPncp === identificadorBuscado;
}

// busca a contratação em várias páginas da API do PNCP 
async function buscarContratacaoEmModalidade(
  identificador: string,
  codigoModalidadeContratacao: number,
  dataInicial: string,
  dataFinal: string
): Promise<Contratacao | null> {
  for (let pagina = 1; pagina <= TOTAL_PAGINAS_BUSCA; pagina++) {
    const registros = await buscarContratacoesPublicacao({
      dataInicial,
      dataFinal,
      codigoModalidadeContratacao,
      pagina,
      tamanhoPagina: TAMANHO_PAGINA_BUSCA,
    });

    const encontrado = registros.find((item) => {
      const identificadorPncp = lerIdentificadorPncp(item);

      return identificadorCorresponde(identificadorPncp, identificador);
    });

    if (encontrado) {
      return mapearContratacaoPncp(encontrado, identificador);
    }

    if (registros.length < TAMANHO_PAGINA_BUSCA) {
      return null;
    }
  }

  return null;
}

// busca uma contratação no PNCP usando o identificador informado 
export async function buscarContratacaoPncp(
  identificador: string
): Promise<Contratacao> {
  if (ehIdentificadorDemo(identificador)) {
    return criarContratacaoMock(identificador);
  }

  try {
    const hoje = new Date();
    const dataInicial = new Date();

    dataInicial.setDate(hoje.getDate() - DIAS_BUSCA_CONTRATACAO);

    const dataInicialFormatada = formatarDataPncp(dataInicial);
    const dataFinalFormatada = formatarDataPncp(hoje);

    for (const codigoModalidadeContratacao of CODIGOS_MODALIDADE_BUSCA) {
      const contratacao = await buscarContratacaoEmModalidade(
        identificador,
        codigoModalidadeContratacao,
        dataInicialFormatada,
        dataFinalFormatada
      );

      if (contratacao) {
        return contratacao;
      }
    }
  } catch (erro) {
    console.error("falha ao consultar PNCP", erro);
  }

  throw new Error(
    "Contratação não encontrada no PNCP. Tente selecionar outra sugestão ou consultar novamente."
  );
}