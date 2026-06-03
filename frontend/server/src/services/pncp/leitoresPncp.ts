export type RegistroPncp = Record<string, unknown>;

// lê texto com segurança a partir de campos opcionais 
export function lerTexto(...valores: unknown[]): string | undefined {
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

// lê número com segurança a partir de campos opcionais 
export function lerNumero(...valores: unknown[]): number {
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

// lê a razão social quando o órgão vem como objeto aninhado
export function lerRazaoSocialOrgao(
  item: RegistroPncp
): string | undefined {
  const orgaoEntidade = item.orgaoEntidade;

  if (
    orgaoEntidade &&
    typeof orgaoEntidade === "object" &&
    "razaoSocial" in orgaoEntidade
  ) {
    const razaoSocial = (orgaoEntidade as RegistroPncp).razaoSocial;

    return lerTexto(razaoSocial);
  }

  return undefined;
}