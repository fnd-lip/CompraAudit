import type { Evidencia } from "../../../../types/evidencia";
import { NOMES_UF } from "../constantesMapaAuditoria";
import type {
  DadosOriginaisPncp,
  EstadoGeoJson,
  SugestaoMapaAuditoria,
} from "../tiposMapaAuditoria";
import { normalizarTextoBusca, obterUfDeTexto } from "./textoMapaAuditoria";

// procura uma UF em objetos aninhados do PNCP, evidências ou GeoJSON
export function buscarUfEmValor(
  valor: unknown,
  profundidade = 0,
): string | null {
  if (profundidade > 7 || valor === null || valor === undefined) {
    return null;
  }

  if (typeof valor === "string") {
    return obterUfDeTexto(valor);
  }

  if (Array.isArray(valor)) {
    for (const item of valor) {
      const uf = buscarUfEmValor(item, profundidade + 1);

      if (uf) {
        return uf;
      }
    }

    return null;
  }

  if (typeof valor !== "object") {
    return null;
  }

  const objeto = valor as Record<string, unknown>;

  // prioriza campos cujo nome indica UF, sigla ou estado
  for (const [chave, conteudo] of Object.entries(objeto)) {
    const chaveNormalizada = normalizarTextoBusca(chave);

    if (
      chaveNormalizada.includes("uf") ||
      chaveNormalizada.includes("sigla") ||
      chaveNormalizada.includes("estado")
    ) {
      const uf = buscarUfEmValor(conteudo, profundidade + 1);

      if (uf) {
        return uf;
      }
    }
  }

  // faz uma varredura geral como fallback
  for (const conteudo of Object.values(objeto)) {
    const uf = buscarUfEmValor(conteudo, profundidade + 1);

    if (uf) {
      return uf;
    }
  }

  return null;
}

// identifica a UF de uma feature do GeoJSON
export function obterUfDaGeografia(estado: EstadoGeoJson): string | null {
  const candidatos = [
    estado.id,
    estado.properties.sigla,
    estado.properties.SIGLA,
    estado.properties.uf,
    estado.properties.UF,
    estado.properties.name,
    estado.properties.nome,
    estado.properties.NOME,
  ];

  for (const candidato of candidatos) {
    if (typeof candidato !== "string") {
      continue;
    }

    const uf = obterUfDeTexto(candidato);

    if (uf) {
      return uf;
    }
  }

  return buscarUfEmValor(estado.properties);
}

// identifica o nome amigável de uma feature do GeoJSON
export function obterNomeDaGeografia(estado: EstadoGeoJson): string {
  const candidatos = [
    estado.properties.name,
    estado.properties.nome,
    estado.properties.NOME,
  ];

  for (const candidato of candidatos) {
    if (typeof candidato === "string" && candidato.trim()) {
      return candidato.trim();
    }
  }

  const uf = obterUfDaGeografia(estado);

  return uf ? NOMES_UF[uf] : "Estado não identificado";
}

// identifica a UF de um alerta PNCP
export function obterUfDaSugestao(sugestao: SugestaoMapaAuditoria): string {
  const dadosOriginais = sugestao.dadosOriginais as
    | DadosOriginaisPncp
    | undefined;

  return buscarUfEmValor(dadosOriginais) || buscarUfEmValor(sugestao) || "NI";
}

// identifica a UF de uma evidência salva no sistema
export function obterUfDaEvidencia(evidencia: Evidencia): string {
  return buscarUfEmValor(evidencia) || "NI";
}