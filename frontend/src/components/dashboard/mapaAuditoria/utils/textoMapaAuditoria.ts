import { NOMES_UF } from "../constantesMapaAuditoria";

const UFS_VALIDAS = new Set(Object.keys(NOMES_UF));

// normaliza textos para comparar nomes de estados, siglas e chaves vindas de APIs
export function normalizarTextoBusca(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

// cria um índice para reconhecer UF por sigla, nome e formatos como BR-AM
const UF_POR_CHAVE = Object.entries(NOMES_UF).reduce<Record<string, string>>(
  (ufs, [uf, nome]) => {
    ufs[normalizarTextoBusca(uf)] = uf;
    ufs[normalizarTextoBusca(nome)] = uf;
    ufs[normalizarTextoBusca(`BR-${uf}`)] = uf;
    ufs[normalizarTextoBusca(`br_${uf}`)] = uf;
    ufs[normalizarTextoBusca(`br-${uf}`)] = uf;

    return ufs;
  },
  {},
);

// tenta converter um texto em uma UF válida
export function obterUfDeTexto(texto: string): string | null {
  const textoLimpo = texto.trim();

  if (!textoLimpo) {
    return null;
  }

  const ufMaiuscula = textoLimpo.toUpperCase();

  if (UFS_VALIDAS.has(ufMaiuscula)) {
    return ufMaiuscula;
  }

  return UF_POR_CHAVE[normalizarTextoBusca(textoLimpo)] || null;
}

// lê o primeiro campo textual existente dentro de um objeto
export function lerCampoTexto(
  objeto: Record<string, unknown>,
  chaves: string[],
): string {
  for (const chave of chaves) {
    const valor = objeto[chave];

    if (typeof valor === "string" && valor.trim()) {
      return valor.trim();
    }
  }

  return "";
}