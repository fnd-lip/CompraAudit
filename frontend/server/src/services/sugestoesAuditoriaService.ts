import type { Contratacao } from "../types";
import { prisma } from "../lib/prisma";
import { buscarContratacoesPublicacao } from "./pncp/pncpClient";
import { mapearContratacaoPncp } from "./pncp/mapearContratacaoPncp";

export type SugestaoAuditoria = Contratacao & {
  nivelRisco: "ALTO";
  motivoRisco: string;
};

// busca contratações diretas de maior risco
const CODIGOS_MODALIDADE_RISCO = [8, 9];

// quantidade de dias anteriores usada para buscar contratações recentes
const DIAS_BUSCA_RECENTE = 60;

// quantidade máxima de sugestões exibidas no carrossel
const LIMITE_SUGESTOES = 5;

// converte Date para o formato esperado pela API do PNCP: aaaammdd
function formatarDataPncp(data: Date): string {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");

  return `${ano}${mes}${dia}`;
}

// normaliza identificadores antes de comparar com o Prisma
function normalizarIdentificador(identificador: string): string {
  return identificador.trim();
}

// junta partes de texto garantindo espaço entre elas
function juntarTexto(...partes: string[]): string {
  return partes
    .map((parte) => parte.trim())
    .filter(Boolean)
    .join(" ");
}

// cria a justificativa exibida no feed de sugestões
function criarMotivoRisco(
  contratacao: Contratacao,
  valorMinimo: number,
): string {
  const valorFormatado = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valorMinimo);

  return juntarTexto(
    contratacao.modalidade,
    "acima de",
    valorFormatado,
    "ainda sem evidência criptográfica.",
  );
}

// verifica se a modalidade indica contratação direta relevante para auditoria
function possuiModalidadeDeRisco(contratacao: Contratacao): boolean {
  const modalidade = contratacao.modalidade.toLowerCase();

  return (
    modalidade.includes("dispensa") || modalidade.includes("inexigibilidade")
  );
}

// verifica se o valor da contratação passou do limite definido para alerta
function possuiValorMinimo(
  contratacao: Contratacao,
  valorMinimo: number,
): boolean {
  return contratacao.valor >= valorMinimo;
}

// remove identificadores duplicados antes de consultar o banco
function removerIdentificadoresDuplicados(identificadores: string[]): string[] {
  return [
    ...new Set(
      identificadores
        .map((identificador) => normalizarIdentificador(identificador))
        .filter(Boolean),
    ),
  ];
}

// evita que o PNCP retorne sugestões repetidas no carrossel
function removerContratacoesDuplicadas(
  contratacoes: Contratacao[],
): Contratacao[] {
  const identificadores = new Set<string>();

  return contratacoes.filter((contratacao) => {
    const identificador = normalizarIdentificador(contratacao.identificador);

    if (identificadores.has(identificador)) {
      return false;
    }

    identificadores.add(identificador);

    return true;
  });
}

// tenta ler o identificador salvo dentro do JSON da contratação no Prisma
function lerIdentificadorDaContratacaoSalva(
  contratacao: unknown,
): string | undefined {
  if (!contratacao || typeof contratacao !== "object") {
    return undefined;
  }

  const valor = (contratacao as { identificador?: unknown }).identificador;

  if (typeof valor !== "string") {
    return undefined;
  }

  return normalizarIdentificador(valor);
}

// busca no Prisma quais identificadores já possuem evidência registrada
async function buscarIdentificadoresComEvidencia(
  identificadores: string[],
): Promise<Set<string>> {
  const identificadoresUnicos =
    removerIdentificadoresDuplicados(identificadores);

  if (identificadoresUnicos.length === 0) {
    return new Set();
  }

  const identificadoresBuscados = new Set(identificadoresUnicos);

  const evidenciasEncontradas = await prisma.evidencia.findMany({
    select: {
      identificador: true,
      contratacao: true,
    },
  });

  const identificadoresComEvidencia = new Set<string>();

  for (const evidencia of evidenciasEncontradas) {
    const identificadorDireto = normalizarIdentificador(
      evidencia.identificador,
    );

    const identificadorJson = lerIdentificadorDaContratacaoSalva(
      evidencia.contratacao,
    );

    if (identificadoresBuscados.has(identificadorDireto)) {
      identificadoresComEvidencia.add(identificadorDireto);
    }

    if (identificadorJson && identificadoresBuscados.has(identificadorJson)) {
      identificadoresComEvidencia.add(identificadorJson);
    }
  }

  return identificadoresComEvidencia;
}

// remove da lista as contratações que já possuem evidência salva no Prisma
function removerContratacoesComEvidencia(
  contratacoes: Contratacao[],
  identificadoresComEvidencia: Set<string>,
): Contratacao[] {
  return contratacoes.filter((contratacao) => {
    const identificador = normalizarIdentificador(contratacao.identificador);

    return !identificadoresComEvidencia.has(identificador);
  });
}

// monta o objeto final que será enviado para o frontend
function criarSugestao(
  contratacao: Contratacao,
  valorMinimo: number,
): SugestaoAuditoria {
  return {
    ...contratacao,
    nivelRisco: "ALTO",
    motivoRisco: criarMotivoRisco(contratacao, valorMinimo),
  };
}

// busca contratações recentes no PNCP usando as modalidades de risco
async function buscarContratacoesRecentes(): Promise<Contratacao[]> {
  const hoje = new Date();
  const dataInicial = new Date();

  dataInicial.setDate(hoje.getDate() - DIAS_BUSCA_RECENTE);

  const listas = await Promise.all(
    CODIGOS_MODALIDADE_RISCO.map(async (codigoModalidadeContratacao) => {
      try {
        const registros = await buscarContratacoesPublicacao({
          dataInicial: formatarDataPncp(dataInicial),
          dataFinal: formatarDataPncp(hoje),
          codigoModalidadeContratacao,
          pagina: 1,
          tamanhoPagina: 50,
        });

        return registros.map((registro) => {
          return mapearContratacaoPncp(registro, "PNCP");
        });
      } catch {
        console.warn("falha ao buscar sugestões no PNCP");

        return [];
      }
    }),
  );

  return removerContratacoesDuplicadas(listas.flat());
}

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
async function buscarSugestaoDemo(
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