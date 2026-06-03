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
    item.idCompra
  );
}

// converte o retorno bruto do PNCP para o modelo usado pelo CompraAudit 
export function mapearContratacaoPncp(
  item: RegistroPncp,
  identificadorFallback: string
): Contratacao {
  return {
    identificador: lerIdentificadorPncp(item) || identificadorFallback,

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