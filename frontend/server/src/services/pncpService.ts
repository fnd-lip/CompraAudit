import axios from "axios";
import type { Contratacao } from "../types";

const PNCP_BASE_URL =
  process.env.PNCP_BASE_URL || "https://pncp.gov.br/api/consulta";

type RegistroPncp = Record<string, unknown>;

type RespostaPncp = {
  data?: RegistroPncp[];
};

/* lê texto com segurança a partir de campos opcionais */
function lerTexto(...valores: unknown[]): string | undefined {
  for (const valor of valores) {
    if (typeof valor === "string" && valor.trim()) {
      return valor;
    }

    if (typeof valor === "number") {
      return String(valor);
    }
  }

  return undefined;
}

/* lê número com segurança a partir de campos opcionais */
function lerNumero(...valores: unknown[]): number {
  for (const valor of valores) {
    if (typeof valor === "number") {
      return valor;
    }

    if (typeof valor === "string" && valor.trim()) {
      const numero = Number(valor);

      if (!Number.isNaN(numero)) {
        return numero;
      }
    }
  }

  return 0;
}

/* lê a razão social quando o órgão vem como objeto aninhado */
function lerRazaoSocialOrgao(item: RegistroPncp): string | undefined {
  const orgaoEntidade = item.orgaoEntidade;

  if (
    orgaoEntidade &&
    typeof orgaoEntidade === "object" &&
    "razaoSocial" in orgaoEntidade
  ) {
    const razaoSocial = (orgaoEntidade as Record<string, unknown>).razaoSocial;

    return lerTexto(razaoSocial);
  }

  return undefined;
}

/* converte o retorno do pncp para o formato usado pelo CompraAudit */
function mapearContratacaoPncp(
  item: RegistroPncp,
  identificadorFallback: string
): Contratacao {
  return {
    identificador:
      lerTexto(
        item.numeroControlePNCP,
        item.numeroControlePncp,
        item.idCompra
      ) || identificadorFallback,

    orgao:
      lerRazaoSocialOrgao(item) ||
      lerTexto(item.orgaoEntidadeRazaoSocial, item.nomeOrgao) ||
      "Órgão não informado",

    objeto:
      lerTexto(
        item.objetoCompra,
        item.objetoContratacao,
        item.descricaoObjeto
      ) || "Objeto não informado",

    valor: lerNumero(
      item.valorTotalEstimado,
      item.valorGlobal,
      item.valorTotal
    ),

    modalidade:
      lerTexto(item.modalidadeNome, item.modalidadeContratacaoNome) ||
      "Modalidade não informada",

    dataPublicacao:
      lerTexto(item.dataPublicacaoPncp, item.dataPublicacao) ||
      new Date().toISOString(),

    fonte: "PNCP",
    dadosOriginais: item,
  };
}

/* busca uma contratação no pncp e usa mock se a consulta falhar */
export async function buscarContratacaoPncp(
  identificador: string
): Promise<Contratacao> {
  try {
    const resposta = await axios.get<RespostaPncp>(
      `${PNCP_BASE_URL}/v1/contratacoes/publicacao`,
      {
        params: {
          dataInicial: "20260501",
          dataFinal: "20260526",
          codigoModalidadeContratacao: 8,
          pagina: 1,
          tamanhoPagina: 10,
        },
        headers: {
          accept: "*/*",
        },
      }
    );

    const lista = resposta.data.data || [];

    const encontrado =
      lista.find((item) => {
        const numeroControle = lerTexto(
          item.numeroControlePNCP,
          item.numeroControlePncp,
          item.idCompra
        );

        return numeroControle?.includes(identificador);
      }) || lista[0];

    if (encontrado) {
      return mapearContratacaoPncp(encontrado, identificador);
    }
  } catch {
    console.warn("falha ao consultar pncp, usando dados simulados");
  }

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