import { normalizarTextoBusca } from "../utils/textoMapaAuditoria";

// Verifica se uma chave de objeto combina com algum nome esperado
// Exemplo: "municipioNome" combina com "municipio"
function chaveCombina(chave: string, candidatos: string[]): boolean {
  const chaveNormalizada = normalizarTextoBusca(chave);

  return candidatos.some((candidato) => {
    const candidatoNormalizado = normalizarTextoBusca(candidato);

    return (
      chaveNormalizada === candidatoNormalizado ||
      chaveNormalizada.includes(candidatoNormalizado)
    );
  });
}

// Busca um texto dentro de objetos aninhados.
// Isso é necessário porque as evidências podem vir com formatos diferentes->
// evidencia.municipio, evidencia.contratacao.municipioNome,
// evidencia.dadosOriginais.unidadeOrgao.municipioNome etc.
export function buscarTextoPorChaves(
  valor: unknown,
  chaves: string[],
  profundidade = 0,
): string {
  if (profundidade > 8 || valor === null || valor === undefined) {
    return "";
  }

  if (Array.isArray(valor)) {
    for (const item of valor) {
      const texto = buscarTextoPorChaves(item, chaves, profundidade + 1);

      if (texto) {
        return texto;
      }
    }

    return "";
  }

  if (typeof valor !== "object") {
    return "";
  }

  const objeto = valor as Record<string, unknown>;

  // Primeiro tenta achar diretamente por chaves parecidas
  for (const [chave, conteudo] of Object.entries(objeto)) {
    if (!chaveCombina(chave, chaves)) {
      continue;
    }

    if (typeof conteudo === "string" && conteudo.trim()) {
      return conteudo.trim();
    }

    if (typeof conteudo === "number") {
      return String(conteudo);
    }
  }

  // Depois faz busca recursiva nos valores internos
  for (const conteudo of Object.values(objeto)) {
    const texto = buscarTextoPorChaves(conteudo, chaves, profundidade + 1);

    if (texto) {
      return texto;
    }
  }

  return "";
}

// Busca números dentro de objetos aninhados.
// Usado para latitude/longitude, quando esses campos existirem na evidência.
export function buscarNumeroPorChaves(
  valor: unknown,
  chaves: string[],
  profundidade = 0,
): number | null {
  if (profundidade > 8 || valor === null || valor === undefined) {
    return null;
  }

  if (Array.isArray(valor)) {
    for (const item of valor) {
      const numero = buscarNumeroPorChaves(item, chaves, profundidade + 1);

      if (numero !== null) {
        return numero;
      }
    }

    return null;
  }

  if (typeof valor !== "object") {
    return null;
  }

  const objeto = valor as Record<string, unknown>;

  // Primeiro tenta encontrar número diretamente nas chaves esperadas
  for (const [chave, conteudo] of Object.entries(objeto)) {
    if (!chaveCombina(chave, chaves)) {
      continue;
    }

    if (typeof conteudo === "number" && Number.isFinite(conteudo)) {
      return conteudo;
    }

    if (typeof conteudo === "string") {
      const numero = Number(conteudo.replace(",", "."));

      if (Number.isFinite(numero)) {
        return numero;
      }
    }
  }

  // Depois procura dentro dos objetos filhos
  for (const conteudo of Object.values(objeto)) {
    const numero = buscarNumeroPorChaves(conteudo, chaves, profundidade + 1);

    if (numero !== null) {
      return numero;
    }
  }

  return null;
}