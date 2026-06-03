import axios from "axios";
import type { RegistroPncp } from "./leitoresPncp";

const PNCP_BASE_URL =
  process.env.PNCP_BASE_URL || "https://pncp.gov.br/api/consulta";

type RespostaPncp = {
  data?: RegistroPncp[];
};

type BuscarContratacoesPublicacaoParams = {
  dataInicial: string;
  dataFinal: string;
  codigoModalidadeContratacao: number;
  pagina?: number;
  tamanhoPagina?: number;
};

// centraliza a chamada HTTP para a API pública do PNCP 
export async function buscarContratacoesPublicacao({
  pagina = 1,
  tamanhoPagina = 20,
  ...params
}: BuscarContratacoesPublicacaoParams): Promise<RegistroPncp[]> {
  const resposta = await axios.get<RespostaPncp>(
    `${PNCP_BASE_URL}/v1/contratacoes/publicacao`,
    {
      params: {
        ...params,
        pagina,
        tamanhoPagina,
      },
      headers: {
        accept: "*/*",
      },
    }
  );

  return resposta.data.data || [];
}