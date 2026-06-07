import type { Contratacao } from "../../types";
import {
  lerNumero,
  lerRazaoSocialOrgao,
  lerTexto,
  type RegistroPncp,
} from "./leitoresPncp";

// lê o identificador oficial da contratação dentro do retorno bruto do PNCP
export function lerIdentificadorPncp(item: RegistroPncp): string | undefined {
  return lerTexto(
    item.numeroControlePNCP,
    item.numeroControlePncp,
    item.idCompra,
  );
}

// melhora textos vindos do PNCP antes de exibir no frontend
function normalizarTextoExibicao(texto: string): string {
  return texto
    .replace(/\s+/g, " ")
    .replace(/,([^\s])/g, ", $1")
    .replace(/\.([^\s])/g, ". $1")
    .replace(/;([^\s])/g, "; $1")
    .replace(/:([^\s])/g, ": $1")
    .replace(/([a-záéíóúàâêôãõç])([A-ZÁÉÍÓÚÀÂÊÔÃÕÇ])/g, "$1 $2")
    .replace(/\bÉA\b/g, "É A")
    .replace(/\bpara\s*fornecimento\b/gi, "para fornecimento")
    .trim();
}
// lê o órgão da contratação e aplica um fallback seguro
function lerOrgaoContratacao(item: RegistroPncp): string {
  const orgao =
    lerRazaoSocialOrgao(item) ||
    lerTexto(item.orgaoEntidadeRazaoSocial, item.nomeOrgao) ||
    "Órgão não informado";

  return normalizarTextoExibicao(orgao);
}

// lê o objeto da contratação e melhora pequenos problemas de espaçamento
function lerObjetoContratacao(item: RegistroPncp): string {
  const objeto =
    lerTexto(item.objetoCompra, item.objetoContratacao, item.descricaoObjeto) ||
    "Objeto não informado";

  return normalizarTextoExibicao(objeto);
}

// lê a modalidade da contratação e aplica um fallback seguro
function lerModalidadeContratacao(item: RegistroPncp): string {
  const modalidade =
    lerTexto(item.modalidadeNome, item.modalidadeContratacaoNome) ||
    "Modalidade não informada";

  return normalizarTextoExibicao(modalidade);
}

// lê a data de publicação e aplica a data atual como fallback
function lerDataPublicacaoContratacao(item: RegistroPncp): string {
  return (
    lerTexto(item.dataPublicacaoPncp, item.dataPublicacao) ||
    new Date().toISOString()
  );
}

// converte o retorno bruto do PNCP para o modelo usado pelo CompraAudit
export function mapearContratacaoPncp(
  item: RegistroPncp,
  identificadorFallback: string,
): Contratacao {
  return {
    identificador: lerIdentificadorPncp(item) || identificadorFallback,
    orgao: lerOrgaoContratacao(item),
    objeto: lerObjetoContratacao(item),

    valor: lerNumero(
      item.valorTotalEstimado,
      item.valorGlobal,
      item.valorTotal,
    ),

    modalidade: lerModalidadeContratacao(item),
    dataPublicacao: lerDataPublicacaoContratacao(item),
    fonte: "PNCP",
    dadosOriginais: item,
  };
}